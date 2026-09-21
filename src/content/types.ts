export type SiteId = "shibuya" | "shinjuku";

export type DraftKind = "road-use" | "road-occupy" | "plan";

export type RequestChannel = "email" | "fax";

export type IngestStep = "receiving" | "reading" | "drafting";

export type ViewMode = "inbox" | "ingest" | "result";

export type SitePermit = {
  n: string;
  to: string;
  lead: number;
  leadu: string;
  draft: DraftKind | null;
  note?: string;
};

export type SiteCrew = {
  r: string;
  q: number;
  note?: string;
};

export type SiteDoc = {
  n: string;
  note?: string;
  draft?: DraftKind;
};

export type SiteSchedule = {
  off: number;
  t: string;
  o?: string;
};

export type SiteReason = {
  h: string;
  b: string;
};

export type SitePlan = {
  id: SiteId;
  label: string;
  addr: string;
  type: string;
  time: string;
  locname: string;
  title: string;
  sub: string;
  police: { v: string; n: string; badge: string };
  admin: { v: string; n: string };
  nara: { police: string; admin: string };
  permits: SitePermit[];
  crew: SiteCrew[];
  docs: SiteDoc[];
  sched: SiteSchedule[];
  reasons: SiteReason[];
};

export type IncomingRequest = {
  id: string;
  siteId: SiteId;
  channel: RequestChannel;
  time: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  workDate: string;
};
