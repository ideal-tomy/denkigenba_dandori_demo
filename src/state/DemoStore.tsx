import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialFieldsFor } from "../content/extractions";
import { incomingRequests } from "../content/requests";
import { sites } from "../content/sites";
import type {
  DraftKind,
  EvidenceId,
  ExecuteTask,
  ExtractField,
  IncomingRequest,
  IngestStep,
  PlanStatus,
  TaskStatus,
  ViewMode,
} from "../content/types";
import { selectionReturnUrl, syncSelectionEntry } from "../lib/selectionReturn";
import { buildExecuteTasks } from "../lib/tasks";

type RequestState = {
  planStatus: PlanStatus;
  fields: ExtractField[];
  seenEvidence: EvidenceId[];
  clearedReviews: string[];
  taskStates: Record<string, TaskStatus>;
  draftEdits: Partial<Record<DraftKind, Record<string, string>>>;
  packetEdits: Record<string, Record<string, string>>;
};

type Store = {
  view: ViewMode;
  requests: IncomingRequest[];
  activeRequest: IncomingRequest | null;
  site: (typeof sites)[keyof typeof sites] | null;
  workDateIso: string;
  guardCount: number;
  fields: ExtractField[];
  planStatus: PlanStatus;
  reviewCount: number;
  fieldNeedsReviewOf: (fieldId: string) => boolean;
  seenEvidence: EvidenceId[];
  evidenceId: EvidenceId | null;
  openEvidence: (id: EvidenceId) => void;
  closeEvidence: () => void;
  updateField: (id: string, value: string) => void;
  naraMode: boolean;
  toggleNara: () => void;
  ingestStep: IngestStep;
  openRequest: (id: string) => void;
  backToInbox: () => void;
  goToResult: () => void;
  goToExecute: () => void;
  draftKind: DraftKind | null;
  openDraft: (kind: DraftKind) => void;
  closeDraft: () => void;
  draftEditOf: (kind: DraftKind, key: string, fallback: string) => string;
  setDraftEdit: (kind: DraftKind, key: string, value: string) => void;
  draftEdited: (kind: DraftKind) => boolean;
  approvePlan: () => void;
  executeTasks: ExecuteTask[];
  taskStatusOf: (id: string) => TaskStatus;
  completeTask: (id: string) => void;
  packetTaskId: string | null;
  openPacket: (id: string) => void;
  closePacket: () => void;
  packetFieldOf: (taskId: string, key: string, fallback: string) => string;
  setPacketField: (taskId: string, key: string, value: string) => void;
  markPacketReady: (taskId: string) => void;
  permitDone: number;
  permitTotal: number;
  crewDone: number;
  crewTotal: number;
  allTasksDone: boolean;
  statusOf: (requestId: string) => "needs-check" | "draft" | "preparing" | "done";
  toast: string | null;
  clearToast: () => void;
  returnUrl: string | null;
  lockPulse: number;
};

const Ctx = createContext<Store | null>(null);

const INGEST_STEPS: IngestStep[] = ["receiving", "reading", "drafting"];
const STEP_MS = 850;

function initialRequestState(id: string): RequestState {
  return {
    planStatus: "draft",
    fields: initialFieldsFor(id),
    seenEvidence: [],
    clearedReviews: [],
    taskStates: {},
    draftEdits: {},
    packetEdits: {},
  };
}

function initialStates(): Record<string, RequestState> {
  const next: Record<string, RequestState> = {};
  for (const r of incomingRequests) {
    next[r.id] = initialRequestState(r.id);
  }
  return next;
}

function fieldNeedsReview(field: ExtractField, cleared: string[]): boolean {
  return Boolean(field.needsReview) && !cleared.includes(field.id);
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>("inbox");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ingestStep, setIngestStep] = useState<IngestStep>("receiving");
  const [naraMode, setNaraMode] = useState(false);
  const [draftKind, setDraftKind] = useState<DraftKind | null>(null);
  const [evidenceId, setEvidenceId] = useState<EvidenceId | null>(null);
  const [packetTaskId, setPacketTaskId] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [lockPulse, setLockPulse] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [states, setStates] = useState(initialStates);

  useEffect(() => {
    syncSelectionEntry();
    setReturnUrl(selectionReturnUrl());
  }, []);

  const activeRequest = useMemo(
    () => incomingRequests.find((r) => r.id === activeId) ?? null,
    [activeId],
  );

  const site = useMemo(
    () => (activeRequest ? sites[activeRequest.siteId] : null),
    [activeRequest],
  );

  const cur = activeId ? states[activeId] : null;
  const fields = cur?.fields ?? [];
  const planStatus = cur?.planStatus ?? "draft";
  const seenEvidence = cur?.seenEvidence ?? [];
  const clearedReviews = cur?.clearedReviews ?? [];

  const workDateIso =
    fields.find((f) => f.id === "workDate")?.value ?? activeRequest?.workDate ?? "";

  const guardCount = Number(fields.find((f) => f.id === "crew-guard")?.value ?? "0") || 0;

  const reviewCount = fields.filter((f) => fieldNeedsReview(f, clearedReviews)).length;

  const fieldNeedsReviewOf = useCallback(
    (fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return false;
      return fieldNeedsReview(field, clearedReviews);
    },
    [fields, clearedReviews],
  );

  const executeTasks = useMemo(() => (site ? buildExecuteTasks(site) : []), [site]);

  const taskStatusOf = useCallback(
    (id: string): TaskStatus => cur?.taskStates[id] ?? "todo",
    [cur],
  );

  const permitTasks = executeTasks.filter((t) => t.kind === "permit");
  const crewTasks = executeTasks.filter((t) => t.kind === "crew");
  const permitDone = permitTasks.filter((t) => taskStatusOf(t.id) === "done").length;
  const crewDone = crewTasks.filter((t) => taskStatusOf(t.id) === "done").length;
  const allTasksDone =
    executeTasks.length > 0 && executeTasks.every((t) => taskStatusOf(t.id) === "done");

  useEffect(() => {
    if (view !== "ingest" || !activeId) return;

    setIngestStep("receiving");
    let stepIndex = 0;
    const timers: number[] = [];

    const advance = () => {
      stepIndex += 1;
      if (stepIndex < INGEST_STEPS.length) {
        setIngestStep(INGEST_STEPS[stepIndex]);
        timers.push(window.setTimeout(advance, STEP_MS));
      } else {
        timers.push(
          window.setTimeout(() => {
            setNaraMode(false);
            setView("result");
            window.scrollTo(0, 0);
          }, STEP_MS),
        );
      }
    };

    timers.push(window.setTimeout(advance, STEP_MS));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [view, activeId]);

  const openRequest = useCallback((id: string) => {
    setActiveId(id);
    const st = states[id];
    if (st?.planStatus === "approved") {
      setView("execute");
    } else {
      setView("ingest");
    }
    window.scrollTo(0, 0);
  }, [states]);

  const backToInbox = useCallback(() => {
    setView("inbox");
    setActiveId(null);
    setNaraMode(false);
    setDraftKind(null);
    setEvidenceId(null);
    setPacketTaskId(null);
    window.scrollTo(0, 0);
  }, []);

  const goToResult = useCallback(() => {
    setView("result");
    window.scrollTo(0, 0);
  }, []);

  const goToExecute = useCallback(() => {
    setView("execute");
    window.scrollTo(0, 0);
  }, []);

  const toggleNara = useCallback(() => {
    setNaraMode((prev) => !prev);
    setLockPulse((n) => n + 1);
  }, []);

  const openEvidence = useCallback(
    (id: EvidenceId) => {
      if (!activeId) return;
      setEvidenceId(id);
      setStates((prev) => {
        const st = prev[activeId];
        const seen = st.seenEvidence.includes(id) ? st.seenEvidence : [...st.seenEvidence, id];
        const cleared = new Set(st.clearedReviews);
        for (const f of st.fields) {
          if (f.evidenceId === id && f.needsReview) cleared.add(f.id);
        }
        return {
          ...prev,
          [activeId]: {
            ...st,
            seenEvidence: seen,
            clearedReviews: [...cleared],
          },
        };
      });
    },
    [activeId],
  );

  const updateField = useCallback(
    (id: string, value: string) => {
      if (!activeId) return;
      setStates((prev) => {
        const st = prev[activeId];
        const fieldsNext = st.fields.map((f) => (f.id === id ? { ...f, value } : f));
        const cleared = st.clearedReviews.includes(id)
          ? st.clearedReviews
          : [...st.clearedReviews, id];
        return {
          ...prev,
          [activeId]: { ...st, fields: fieldsNext, clearedReviews: cleared },
        };
      });
    },
    [activeId],
  );

  const draftEditOf = useCallback(
    (kind: DraftKind, key: string, fallback: string) => {
      return cur?.draftEdits[kind]?.[key] ?? fallback;
    },
    [cur],
  );

  const setDraftEdit = useCallback(
    (kind: DraftKind, key: string, value: string) => {
      if (!activeId) return;
      setStates((prev) => {
        const st = prev[activeId];
        return {
          ...prev,
          [activeId]: {
            ...st,
            draftEdits: {
              ...st.draftEdits,
              [kind]: { ...st.draftEdits[kind], [key]: value },
            },
          },
        };
      });
    },
    [activeId],
  );

  const draftEdited = useCallback(
    (kind: DraftKind) => {
      const edits = cur?.draftEdits[kind];
      return Boolean(edits && Object.keys(edits).length > 0);
    },
    [cur],
  );

  const approvePlan = useCallback(() => {
    if (!activeId || reviewCount > 0) return;
    setStates((prev) => {
      const st = prev[activeId];
      const taskStates: Record<string, TaskStatus> = { ...st.taskStates };
      for (const t of executeTasks) {
        if (!taskStates[t.id]) taskStates[t.id] = "todo";
      }
      return {
        ...prev,
        [activeId]: { ...st, planStatus: "approved", taskStates },
      };
    });
    setToast("段取り案を確定しました。このデモでは申請提出しません。");
    setView("execute");
    window.scrollTo(0, 0);
  }, [activeId, reviewCount, executeTasks]);

  const completeTask = useCallback(
    (id: string) => {
      if (!activeId) return;
      setStates((prev) => {
        const st = prev[activeId];
        return {
          ...prev,
          [activeId]: {
            ...st,
            taskStates: { ...st.taskStates, [id]: "done" },
          },
        };
      });
    },
    [activeId],
  );

  const packetFieldOf = useCallback(
    (taskId: string, key: string, fallback: string) => {
      return cur?.packetEdits?.[taskId]?.[key] ?? fallback;
    },
    [cur],
  );

  const setPacketField = useCallback(
    (taskId: string, key: string, value: string) => {
      if (!activeId) return;
      setStates((prev) => {
        const st = prev[activeId];
        return {
          ...prev,
          [activeId]: {
            ...st,
            packetEdits: {
              ...(st.packetEdits ?? {}),
              [taskId]: { ...(st.packetEdits?.[taskId] ?? {}), [key]: value },
            },
          },
        };
      });
    },
    [activeId],
  );

  const markPacketReady = useCallback(
    (taskId: string) => {
      if (!activeId) return;
      setStates((prev) => {
        const st = prev[activeId];
        return {
          ...prev,
          [activeId]: {
            ...st,
            taskStates: { ...st.taskStates, [taskId]: "done" },
          },
        };
      });
      setToast("提出できる状態にしました。このデモでは申請提出しません。");
    },
    [activeId],
  );

  const statusOf = useCallback(
    (requestId: string): "needs-check" | "draft" | "preparing" | "done" => {
      const st = states[requestId];
      if (!st) return "draft";
      if (st.planStatus === "approved") {
        const req = incomingRequests.find((r) => r.id === requestId);
        const sitePlan = req ? sites[req.siteId] : null;
        const tasks = sitePlan ? buildExecuteTasks(sitePlan) : [];
        const done =
          tasks.length > 0 && tasks.every((t) => st.taskStates[t.id] === "done");
        return done ? "done" : "preparing";
      }
      const cleared = st.clearedReviews;
      const openReviews = st.fields.filter((f) => fieldNeedsReview(f, cleared)).length;
      if (openReviews > 0) return "needs-check";
      return "draft";
    },
    [states],
  );

  const value: Store = {
    view,
    requests: incomingRequests,
    activeRequest,
    site,
    workDateIso,
    guardCount,
    fields,
    planStatus,
    reviewCount,
    fieldNeedsReviewOf,
    seenEvidence,
    evidenceId,
    openEvidence,
    closeEvidence: () => setEvidenceId(null),
    updateField,
    naraMode,
    toggleNara,
    ingestStep,
    openRequest,
    backToInbox,
    goToResult,
    goToExecute,
    draftKind,
    openDraft: setDraftKind,
    closeDraft: () => setDraftKind(null),
    draftEditOf,
    setDraftEdit,
    draftEdited,
    approvePlan,
    executeTasks,
    taskStatusOf,
    completeTask,
    packetTaskId,
    openPacket: (id: string) => setPacketTaskId(id),
    closePacket: () => setPacketTaskId(null),
    packetFieldOf,
    setPacketField,
    markPacketReady,
    permitDone,
    permitTotal: permitTasks.length,
    crewDone,
    crewTotal: crewTasks.length,
    allTasksDone,
    statusOf,
    toast,
    clearToast: () => setToast(null),
    returnUrl,
    lockPulse,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo outside provider");
  return ctx;
}
