import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { incomingRequests } from "../content/requests";
import { sites } from "../content/sites";
import type { DraftKind, IncomingRequest, IngestStep, ViewMode } from "../content/types";
import { selectionReturnUrl, syncSelectionEntry } from "../lib/selectionReturn";

type Store = {
  view: ViewMode;
  requests: IncomingRequest[];
  activeRequest: IncomingRequest | null;
  site: (typeof sites)[keyof typeof sites] | null;
  workDateIso: string;
  naraMode: boolean;
  toggleNara: () => void;
  ingestStep: IngestStep;
  openRequest: (id: string) => void;
  backToInbox: () => void;
  draftKind: DraftKind | null;
  openDraft: (kind: DraftKind) => void;
  closeDraft: () => void;
  returnUrl: string | null;
  lockPulse: number;
};

const Ctx = createContext<Store | null>(null);

const INGEST_STEPS: IngestStep[] = ["receiving", "reading", "drafting"];
const STEP_MS = 850;

export function DemoProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>("inbox");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ingestStep, setIngestStep] = useState<IngestStep>("receiving");
  const [naraMode, setNaraMode] = useState(false);
  const [draftKind, setDraftKind] = useState<DraftKind | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [lockPulse, setLockPulse] = useState(0);

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

  const workDateIso = activeRequest?.workDate ?? "";

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
    setView("ingest");
    window.scrollTo(0, 0);
  }, []);

  const backToInbox = useCallback(() => {
    setView("inbox");
    setActiveId(null);
    setNaraMode(false);
    setDraftKind(null);
    window.scrollTo(0, 0);
  }, []);

  const toggleNara = useCallback(() => {
    setNaraMode((prev) => !prev);
    setLockPulse((n) => n + 1);
  }, []);

  const value: Store = {
    view,
    requests: incomingRequests,
    activeRequest,
    site,
    workDateIso,
    naraMode,
    toggleNara,
    ingestStep,
    openRequest,
    backToInbox,
    draftKind,
    openDraft: setDraftKind,
    closeDraft: () => setDraftKind(null),
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
