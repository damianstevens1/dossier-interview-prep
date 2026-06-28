import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { BRIEFING_CARDS, FLASH_CARDS, PROVENANCE_SECTIONS, SEED_PEOPLE, SOURCE_EVIDENCE } from "./data";
import type { FlashCard, ParsedProfileIntel, PersonDossier, ProfileStatus, SourceEvidence } from "./types";

type ViewMode = "deck" | "missions" | "roster" | "import" | "briefing" | "metadata";
type DeckMotion = "idle" | "next" | "previous" | "shuffle";

const PEOPLE_STORAGE_KEY = "dossier-people-glass-v1";
const EVIDENCE_STORAGE_KEY = "dossier-evidence-glass-v1";
const MISSION_STORAGE_KEY = "dossier-missions-glass-v1";
const START_STORAGE_KEY = "dossier-start-glass-v1";
const CASE_BRIEF_STORAGE_KEY = "dossier-case-brief-glass-v1";
const VIEW_NAV: Array<{ id: ViewMode; label: string; detail: string }> = [
  { id: "missions", label: "Today", detail: "Plan" },
  { id: "deck", label: "Cards", detail: "Practice" },
  { id: "roster", label: "People", detail: "Panel" },
];

type MissionFlag =
  | "profileSearchDone"
  | "profilePhotoCaptured"
  | "profileExperienceCaptured"
  | "profileEvidenceAttached"
  | "documentPdfFound"
  | "documentFactsCaptured"
  | "documentQuestionsBuilt"
  | "documentEvidenceAttached"
  | "debriefPermissionConfirmed"
  | "debriefCaptured"
  | "debriefAnalyzed"
  | "nextStudyPlanReady";

type MissionState = Record<MissionFlag, boolean> & {
  debriefText: string;
  debriefSummary: string[];
  debriefStudyTargets: string[];
  debriefFollowUps: string[];
  debriefStatus: string;
};

type CaseBriefState = {
  recruiterMessage: string;
  roleTitle: string;
  organization: string;
  interviewDateTime: string;
  interviewerLine: string;
  prepMaterials: string;
  researchTargets: string;
  intakeStatus: string;
};

const DEFAULT_MISSION_STATE: MissionState = {
  profileSearchDone: false,
  profilePhotoCaptured: false,
  profileExperienceCaptured: false,
  profileEvidenceAttached: false,
  documentPdfFound: false,
  documentFactsCaptured: false,
  documentQuestionsBuilt: false,
  documentEvidenceAttached: false,
  debriefPermissionConfirmed: false,
  debriefCaptured: false,
  debriefAnalyzed: false,
  nextStudyPlanReady: false,
  debriefText: "",
  debriefSummary: [],
  debriefStudyTargets: [],
  debriefFollowUps: [],
  debriefStatus: "No debrief analyzed yet.",
};

const DEFAULT_CASE_BRIEF: CaseBriefState = {
  recruiterMessage: "",
  roleTitle: "",
  organization: "",
  interviewDateTime: "",
  interviewerLine: "",
  prepMaterials: "",
  researchTargets: "",
  intakeStatus: "No first-interview brief saved yet.",
};

function normalizeMissionState(value: MissionState): MissionState {
  return { ...DEFAULT_MISSION_STATE, ...value };
}

const stopNameParts = new Set([
  "Calendar",
  "Invite",
  "Interview",
  "Program",
  "Manager",
  "Community",
  "Impact",
  "Google",
  "Slides",
  "Share",
  "Candidate",
  "Pre",
  "Read",
  "Talent",
  "Advisor",
  "System",
  "Office",
  "Acquisition",
  "Recruiter",
  "Follow",
  "Thank",
  "Email",
  "Source",
  "Date",
  "Subject",
  "Found",
  "Interpretation",
]);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can fail in private browsing or locked-down contexts.
  }
}

function mergeSeedPeople(storedPeople: PersonDossier[]) {
  const seedById = new Map(SEED_PEOPLE.map((person) => [person.id, person]));
  const seen = new Set<string>();
  const refreshed = storedPeople.map((person) => {
    const seed = seedById.get(person.id);
    if (!seed) return person;

    seen.add(seed.id);
    return {
      ...person,
      ...seed,
      evidenceIds: mergeList(seed.evidenceIds, person.evidenceIds ?? []),
      imported: person.imported,
    };
  });

  SEED_PEOPLE.forEach((person) => {
    if (!seen.has(person.id)) refreshed.push(person);
  });

  return refreshed;
}

function readPeopleStorage() {
  return mergeSeedPeople(readStorage(PEOPLE_STORAGE_KEY, SEED_PEOPLE));
}

function initialsFor(name: string) {
  const initials = name
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return initials || "??";
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/\d+/g, "").replace(/[._-]+/g, " ").trim();
  return titleCase(cleaned || email);
}

function displayRole(person: PersonDossier) {
  return person.roleFromEmail ?? person.roleFromProfile ?? "Profile Pending";
}

function roleConfidence(person: PersonDossier) {
  if (person.roleFromEmail) return "Email signature verified";
  if (person.profileStatus === "verified" && person.roleFromProfile && person.roleFromProfile !== "Profile Pending") {
    return "Verified profile data";
  }
  if (person.profileStatus === "user-provided" && person.roleFromProfile && person.roleFromProfile !== "Profile Pending") {
    return "User-provided profile/prep text";
  }
  if (person.roleFromProfile && person.roleFromProfile !== "Profile Pending") {
    return "Public web result; confirm before relying";
  }
  return "Profile Pending";
}

function profileLookupSummary(person: PersonDossier) {
  if (person.profilePhotoUrl || person.profileBackdropUrl || person.profileBackgroundSummary) {
    return "User-provided profile media/text only";
  }
  if (person.profileStatus === "user-provided") return "User-provided profile/prep text only";
  if (person.profileStatus === "verified") return "Marked verified locally";
  return "No LinkedIn/profile lookup performed";
}

function statusLabel(status: ProfileStatus) {
  if (status === "verified") return "Verified";
  if (status === "user-provided") return "User-provided";
  return "Profile Pending";
}

function confidenceLabel(confidence: SourceEvidence["confidence"]) {
  if (confidence === "user-provided") return "User-provided";
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
}

function sourceTypeLabel(type: SourceEvidence["type"]) {
  if (type === "pre-read") return "PRE-READ";
  return type.toUpperCase();
}

function evidenceMap(sources: SourceEvidence[]) {
  return new Map(sources.map((source) => [source.id, source]));
}

function sourceChips(
  evidenceIds: string[],
  sourcesById: Map<string, SourceEvidence>,
  person?: PersonDossier,
) {
  const chips = new Set<string>();

  evidenceIds.forEach((id) => {
    const source = sourcesById.get(id);
    if (!source) return;
    if (source.type === "email") chips.add("EMAIL");
    if (source.type === "calendar") chips.add("CALENDAR");
    if (source.type === "pre-read") chips.add("PRE-READ");
    if (source.type === "linkedin") {
      chips.add(source.confidence === "verified" ? "LINKEDIN: VERIFIED" : "LINKEDIN: USER PROVIDED");
    }
    if (source.type === "manual" && source.confidence === "user-provided") chips.add("USER PROVIDED");
    if (source.type === "manual" && source.confidence === "inferred") chips.add("PUBLIC WEB");
    if (source.type === "screenshot") chips.add("SCREENSHOT");
    if (source.confidence === "user-provided") chips.add("USER PROVIDED");
  });

  if (person?.profileStatus === "profile-pending") chips.add("LINKEDIN: PENDING");
  if (person?.profileStatus === "user-provided") chips.add("USER PROVIDED");
  if (person?.profileStatus === "verified") chips.add("PROFILE VERIFIED");

  if (chips.size === 0) chips.add("SOURCE PENDING");
  return Array.from(chips);
}

function profilePacketSourcesFor(sources: SourceEvidence[]) {
  return sources.filter((source) => source.type === "screenshot" || source.type === "linkedin");
}

function flashCardsFor(person: PersonDossier, allEvidence: SourceEvidence[]) {
  const seeded = FLASH_CARDS.filter((card) => card.personId === person.id);
  if (seeded.length > 0) return seeded;

  const sourceTitles = person.evidenceIds
    .map((id) => allEvidence.find((source) => source.id === id)?.title)
    .filter(Boolean)
    .join("; ");

  return [
    {
      id: `${person.id}-who`,
      category: "Person",
      title: `Who is ${person.name}?`,
      prompt: `Who is ${person.name}?`,
      answer: `${person.name} was imported from pasted interview intel. Role data is ${displayRole(
        person,
      )}. Keep profile claims pending until sourced text is attached.`,
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-why`,
      category: "Evidence",
      title: "Why are they here?",
      prompt: `Why is ${person.name} in this interview?`,
      answer: person.whyTheyMatter,
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-emphasize`,
      category: "Answer Angle",
      title: "What to emphasize",
      prompt: `What should I emphasize to ${person.name}?`,
      answer: person.howToSpeakToThem.join(" "),
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-evidence`,
      category: "Notes",
      title: "Source trail",
      prompt: `What notes explain why ${person.name} is in this prep set?`,
      answer: sourceTitles || "Imported from pasted text. Review the note details before using this in the interview.",
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
    {
      id: `${person.id}-question`,
      category: "Likely Question",
      title: "Smart question",
      prompt: `What question should I ask ${person.name}?`,
      answer: person.smartQuestion,
      personId: person.id,
      evidenceIds: person.evidenceIds,
    },
  ] satisfies FlashCard[];
}

function extractContacts(text: string) {
  const contacts = new Map<string, { name: string; email?: string }>();
  const emailMatches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];

  emailMatches.forEach((email) => {
    const normalized = email.toLowerCase();
    contacts.set(normalized, { name: nameFromEmail(normalized), email: normalized });
  });

  const nameMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) ?? [];
  nameMatches.forEach((candidate) => {
    const parts = candidate.split(/\s+/);
    if (parts.length < 2 || parts.some((part) => stopNameParts.has(part))) return;
    if (parts.some((part) => part.length <= 1)) return;
    if (Array.from(contacts.values()).some((contact) => contact.name.toLowerCase() === candidate.toLowerCase())) {
      return;
    }
    const key = candidate.toLowerCase();
    if (!contacts.has(key)) contacts.set(key, { name: candidate });
  });

  return Array.from(contacts.values()).slice(0, 10);
}

function parseProfileIntel(text: string): ParsedProfileIntel {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headlineLine =
    lines.find((line) => /^(headline|about|title):/i.test(line)) ??
    lines.find((line) => line.length > 10 && line.length < 140);
  const roleLine = lines.find((line) => /^(current role|role|title):/i.test(line));
  const companyLine = lines.find((line) => /^(company|organization):/i.test(line));
  const atCompany = lines.join(" ").match(/\bat\s+([A-Z][A-Za-z0-9&.,'\s-]{2,60})/);

  const keywordCandidates = [
    "strategy",
    "community",
    "health",
    "operations",
    "portfolio",
    "equity",
    "program",
    "partnership",
    "analytics",
    "communications",
    "leadership",
    "impact",
  ];
  const lowered = text.toLowerCase();
  const keywords = keywordCandidates.filter((keyword) => lowered.includes(keyword));
  const likelyPriorities = keywords
    .slice(0, 5)
    .map((keyword) => `${titleCase(keyword)} context from user-provided profile text`);

  return {
    headline: headlineLine?.replace(/^(headline|about|title):\s*/i, ""),
    currentRole: roleLine?.replace(/^(current role|role|title):\s*/i, ""),
    company: companyLine?.replace(/^(company|organization):\s*/i, "") ?? atCompany?.[1]?.trim(),
    keywords,
    likelyPriorities,
  };
}

function readImageInput(
  event: ChangeEvent<HTMLInputElement>,
  setValue: (value: string) => void,
  setResult: (value: string) => void,
  label: string,
) {
  const file = event.target.files?.[0];
  if (!file) {
    setValue("");
    return;
  }

  if (!file.type.startsWith("image/")) {
    setResult(`${label} must be an image file.`);
    event.target.value = "";
    return;
  }

  if (file.size > 1_800_000) {
    setResult(`${label} is too large for localStorage. Use an image under 1.8 MB for this demo.`);
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      setValue(reader.result);
      setResult(`${label} staged as user-provided profile media.`);
    }
  };
  reader.onerror = () => setResult(`${label} could not be read.`);
  reader.readAsDataURL(file);
}

async function readClipboardImage(
  setValue: (value: string) => void,
  setResult: (value: string) => void,
  label: string,
) {
  try {
    if (!navigator.clipboard || !("read" in navigator.clipboard)) {
      setResult("Clipboard image paste is not available in this browser. Use the file picker instead.");
      return;
    }

    const clipboard = navigator.clipboard as Clipboard & {
      read?: () => Promise<ClipboardItem[]>;
    };
    const items = await clipboard.read?.();
    const imageItem = items?.find((item) => item.types.some((type) => type.startsWith("image/")));
    const imageType = imageItem?.types.find((type) => type.startsWith("image/"));

    if (!imageItem || !imageType) {
      setResult(`No image found on clipboard for ${label}. Copy or screenshot an image first.`);
      return;
    }

    const blob = await imageItem.getType(imageType);
    if (blob.size > 1_800_000) {
      setResult(`${label} is too large for localStorage. Use an image under 1.8 MB for this demo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setValue(reader.result);
        setResult(`${label} pasted as user-provided profile media.`);
      }
    };
    reader.onerror = () => setResult(`${label} could not be read from the clipboard.`);
    reader.readAsDataURL(blob);
  } catch {
    setResult("Clipboard image access was blocked or unavailable. Use the file picker instead.");
  }
}

function createImportedPerson(contact: { name: string; email?: string }, evidenceId: string): PersonDossier {
  return {
    id: `imported-${contact.email ?? contact.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
    name: contact.name,
    initials: initialsFor(contact.name),
    email: contact.email,
    roleFromProfile: "Profile Pending",
    profileStatus: "profile-pending",
    functionInInterview: "Imported interview contact",
    whyTheyMatter:
      "This person was extracted from pasted interview intel. Treat the record as temporary until you attach verified email, calendar, or user-provided profile evidence.",
    likelyCaresAbout: [
      "Role and source still need review",
      "Alignment-first interview strategy",
      "Clear source trail before claims are used",
    ],
    howToSpeakToThem: [
      "Do not assume role or seniority.",
      "Anchor questions in the interview context you can source.",
      "Ask for their view of what this role needs early on.",
    ],
    smartQuestion:
      "What would be most useful for this role to clarify in the first month?",
    evidenceIds: [evidenceId],
    imported: true,
  };
}

function mergeList(existing: string[], additions: string[]) {
  return Array.from(new Set([...existing, ...additions])).filter(Boolean);
}

function createSvgAsset(person: PersonDossier, chips: string[]) {
  const esc = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const lines = [
    displayRole(person),
    person.functionInInterview,
    person.whyTheyMatter,
    `Question: ${person.smartQuestion}`,
  ];
  const wrapped = lines.flatMap((line) => {
    const words = line.split(" ");
    const rows: string[] = [];
    let row = "";
    words.forEach((word) => {
      const next = `${row} ${word}`.trim();
      if (next.length > 48) {
        rows.push(row);
        row = word;
      } else {
        row = next;
      }
    });
    if (row) rows.push(row);
    return rows;
  });

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <rect width="1200" height="1600" fill="#11130f"/>
  <rect width="1200" height="1600" fill="#f7f3ea"/>
  <rect x="90" y="80" width="1020" height="1440" rx="48" fill="#fffdf7" stroke="#d7dfd0" stroke-width="6"/>
  <rect x="170" y="160" width="860" height="120" rx="60" fill="#d9e7d5"/>
  <text x="600" y="237" font-family="Arial, sans-serif" font-size="54" text-anchor="middle" fill="#27666a" font-weight="800">PREP ROOM</text>
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="92" text-anchor="middle" fill="#17201c" font-weight="800">${esc(person.name)}</text>
  <circle cx="600" cy="545" r="124" fill="#27666a"/>
  <text x="600" y="580" font-family="Arial, sans-serif" font-size="88" text-anchor="middle" fill="#fffdf7" font-weight="800">${esc(person.initials)}</text>
  <rect x="250" y="695" width="700" height="115" rx="58" fill="#f0eadb" stroke="#d7dfd0" stroke-width="4"/>
  <text x="600" y="767" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#33423c" font-weight="800">INTERVIEW PREP</text>
  ${wrapped
    .slice(0, 13)
    .map(
      (line, index) =>
        `<text x="150" y="${900 + index * 58}" font-family="Arial, sans-serif" font-size="40" fill="#1f2118">${esc(
          line,
        )}</text>`,
    )
    .join("")}
  ${chips
    .slice(0, 5)
    .map((chip, index) => {
      const x = 150 + (index % 2) * 430;
      const y = 1370 + Math.floor(index / 2) * 70;
      return `<rect x="${x}" y="${y}" width="370" height="48" rx="24" fill="#1f2118"/><text x="${
        x + 185
      }" y="${y + 33}" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#e3d6a7">${esc(
        chip,
      )}</text>`;
    })
    .join("")}
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  return {
    url,
    filename: `${person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-prep-card.svg`,
    label: `${person.initials} SVG ready`,
  };
}

function SourceChips({
  chips,
  compact = false,
}: {
  chips: string[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "source-chips compact" : "source-chips"} aria-label="Source chips">
      {chips.map((chip) => (
        <span key={chip} className="source-chip">
          {chip}
        </span>
      ))}
    </div>
  );
}

function EvidenceDrawer({
  isOpen,
  onClose,
  person,
  sources,
}: {
  isOpen: boolean;
  onClose: () => void;
  person: PersonDossier;
  sources: SourceEvidence[];
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside className="evidence-drawer" role="dialog" aria-modal="true" aria-label="Source notes" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <p className="kicker">SOURCE TRAIL</p>
            <h2>{person.name}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close source notes" onClick={onClose}>
            X
          </button>
        </div>
        <div className="stamp-row" aria-hidden="true">
          REVIEW NOTES
        </div>
        <div className="source-list">
          {sources.map((source) => (
            <article className="source-paper" key={source.id}>
              <div className="source-paper-top">
                <span>{sourceTypeLabel(source.type)}</span>
                <span>{confidenceLabel(source.confidence)}</span>
              </div>
              <h3>{source.title}</h3>
              {source.date ? <time dateTime={source.date}>{source.date}</time> : <time>No date supplied</time>}
              {source.url ? (
                <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                  Open source
                </a>
              ) : null}
              <p>{source.excerpt}</p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}

function App() {
  const [people, setPeople] = useState<PersonDossier[]>(() => readPeopleStorage());
  const [customEvidence, setCustomEvidence] = useState<SourceEvidence[]>(() => readStorage(EVIDENCE_STORAGE_KEY, []));
  const [missionState, setMissionState] = useState<MissionState>(() =>
    normalizeMissionState(readStorage(MISSION_STORAGE_KEY, DEFAULT_MISSION_STATE)),
  );
  const [hasOpenedCase, setHasOpenedCase] = useState<boolean>(true);
  const [caseBrief, setCaseBrief] = useState<CaseBriefState>(() =>
    readStorage(CASE_BRIEF_STORAGE_KEY, DEFAULT_CASE_BRIEF),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<ViewMode>("missions");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [deckMotion, setDeckMotion] = useState<DeckMotion>("idle");
  const [flightCard, setFlightCard] = useState<{ person: PersonDossier; direction: DeckMotion } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [studyCardIndex, setStudyCardIndex] = useState(0);
  const [intelText, setIntelText] = useState("");
  const [profileText, setProfileText] = useState("");
  const [profileBackgroundText, setProfileBackgroundText] = useState("");
  const [profilePhotoDataUrl, setProfilePhotoDataUrl] = useState("");
  const [profileBackdropDataUrl, setProfileBackdropDataUrl] = useState("");
  const [profileTargetId, setProfileTargetId] = useState(SEED_PEOPLE[0].id);
  const [importResult, setImportResult] = useState("No imported intel yet.");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [exportAsset, setExportAsset] = useState<{ url: string; filename: string; label: string } | null>(null);
  const [briefingIndex, setBriefingIndex] = useState(0);
  const [dossierPanelIndex, setDossierPanelIndex] = useState(0);
  const motionTimer = useRef<number | undefined>(undefined);
  const flightTimer = useRef<number | undefined>(undefined);
  const pointerStart = useRef<number | null>(null);
  const rosterPointerStart = useRef<number | null>(null);
  const rosterDragValue = useRef(0);
  const rosterDragFrame = useRef<number | undefined>(undefined);
  const rosterShowcaseRef = useRef<HTMLDivElement | null>(null);
  const rosterCardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const dossierCarouselRef = useRef<HTMLDivElement | null>(null);
  const dossierScrollFrame = useRef<number | undefined>(undefined);
  const liquidVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<{
    context: AudioContext;
    master: GainNode;
    nodes: AudioNode[];
    timers: number[];
  } | null>(null);

  const allEvidence = useMemo(() => {
    const merged = new Map<string, SourceEvidence>();
    SOURCE_EVIDENCE.forEach((source) => merged.set(source.id, source));
    customEvidence.forEach((source) => merged.set(source.id, source));
    return Array.from(merged.values());
  }, [customEvidence]);

  const sourcesById = useMemo(() => evidenceMap(allEvidence), [allEvidence]);
  const currentPerson = people[currentIndex] ?? people[0] ?? SEED_PEOPLE[0];
  const currentSources = currentPerson.evidenceIds
    .map((id) => sourcesById.get(id))
    .filter((source): source is SourceEvidence => Boolean(source));
  const currentProfilePacketSources = profilePacketSourcesFor(currentSources);
  const currentChips = sourceChips(currentPerson.evidenceIds, sourcesById, currentPerson);
  const nextPerson = people.length > 1 ? people[(currentIndex + 1) % people.length] : undefined;
  const secondNextPerson = people.length > 2 ? people[(currentIndex + 2) % people.length] : undefined;
  const currentStudyCards = useMemo(() => {
    const cards = flashCardsFor(currentPerson, allEvidence);
    const strategyCard = FLASH_CARDS.find((card) => card.id === "overall-interview-strategy");
    return strategyCard ? [...cards, strategyCard] : cards;
  }, [allEvidence, currentPerson]);
  const activeStudyCard = currentStudyCards[studyCardIndex] ?? currentStudyCards[0];
  const activeStudyCardChips = activeStudyCard
    ? sourceChips(activeStudyCard.evidenceIds, sourcesById, currentPerson)
    : currentChips;
  const activeBriefing = BRIEFING_CARDS[briefingIndex] ?? BRIEFING_CARDS[0];
  const activeBriefingSources = activeBriefing.evidenceIds
    .map((id) => sourcesById.get(id))
    .filter((source): source is SourceEvidence => Boolean(source));
  const deckProgress = people.length ? Math.round(((currentIndex + 1) / people.length) * 100) : 0;
  const pendingProfileCount = people.filter((person) => person.profileStatus === "profile-pending").length;
  const sourcedPersonCount = people.filter((person) => person.evidenceIds.length > 0).length;
  const currentSourceTypeCount = new Set(currentSources.map((source) => source.type)).size;

  useEffect(() => {
    applyRosterMotion(0);
  }, [currentIndex, people]);

  useEffect(() => {
    setDossierPanelIndex(0);
    dossierCarouselRef.current?.scrollTo({ left: 0 });
  }, [currentPerson.id, isRevealed]);

  const playLiquidVideo = () => {
    const video = liquidVideoRef.current;
    if (!video) return;

    video.controls = false;
    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.playbackRate = 0.88;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    void video.play().catch(() => undefined);
  };

  useEffect(() => {
    const video = liquidVideoRef.current;
    if (!video) return undefined;

    const keepMoving = () => {
      if (!document.hidden && video.paused) {
        playLiquidVideo();
      }
    };
    const restart = () => {
      video.currentTime = 0;
      playLiquidVideo();
    };

    video.addEventListener("loadedmetadata", playLiquidVideo);
    video.addEventListener("canplay", playLiquidVideo);
    video.addEventListener("ended", restart);
    document.addEventListener("visibilitychange", keepMoving);
    document.addEventListener("pointerdown", playLiquidVideo, { passive: true });
    document.addEventListener("touchstart", playLiquidVideo, { passive: true });
    document.addEventListener("scroll", playLiquidVideo, { passive: true });
    window.addEventListener("pageshow", keepMoving);
    window.addEventListener("focus", keepMoving);
    const timer = window.setInterval(keepMoving, 1600);

    playLiquidVideo();

    return () => {
      video.removeEventListener("loadedmetadata", playLiquidVideo);
      video.removeEventListener("canplay", playLiquidVideo);
      video.removeEventListener("ended", restart);
      document.removeEventListener("visibilitychange", keepMoving);
      document.removeEventListener("pointerdown", playLiquidVideo);
      document.removeEventListener("touchstart", playLiquidVideo);
      document.removeEventListener("scroll", playLiquidVideo);
      window.removeEventListener("pageshow", keepMoving);
      window.removeEventListener("focus", keepMoving);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(
    () => () => {
      if (rosterDragFrame.current !== undefined) {
        window.cancelAnimationFrame(rosterDragFrame.current);
      }
      if (dossierScrollFrame.current !== undefined) {
        window.cancelAnimationFrame(dossierScrollFrame.current);
      }
    },
    [],
  );

  useEffect(() => {
    writeStorage(PEOPLE_STORAGE_KEY, people);
  }, [people]);

  useEffect(() => {
    writeStorage(EVIDENCE_STORAGE_KEY, customEvidence);
  }, [customEvidence]);

  useEffect(() => {
    writeStorage(MISSION_STORAGE_KEY, missionState);
  }, [missionState]);

  useEffect(() => {
    writeStorage(START_STORAGE_KEY, hasOpenedCase);
  }, [hasOpenedCase]);

  useEffect(() => {
    writeStorage(CASE_BRIEF_STORAGE_KEY, caseBrief);
  }, [caseBrief]);

  useEffect(() => {
    if (currentIndex >= people.length) setCurrentIndex(0);
  }, [currentIndex, people.length]);

  useEffect(() => {
    setStudyCardIndex(0);
    setIsRevealed(false);
    setIsEvidenceOpen(false);
    setProfileTargetId(currentPerson.id);
    setExportAsset(null);
  }, [currentPerson.id]);

  useEffect(() => {
    return () => {
      window.clearTimeout(motionTimer.current);
      window.clearTimeout(flightTimer.current);
      stopSignal();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (exportAsset) URL.revokeObjectURL(exportAsset.url);
    };
  }, [exportAsset]);

  function playBlip(context: AudioContext, destination: AudioNode) {
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const frequency = [392, 466.16, 523.25, 587.33][Math.floor(Math.random() * 4)];

    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + 0.28);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(820, now);
    filter.Q.setValueAtTime(8, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  function startSignal() {
    if (audioRef.current) return;

    const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
    const AudioContextCtor = window.AudioContext ?? audioWindow.webkitAudioContext;
    if (!AudioContextCtor) {
      setImportResult("Audio signal is not available in this browser.");
      return;
    }

    const context = new AudioContextCtor();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const droneA = context.createOscillator();
    const droneB = context.createOscillator();
    const droneGain = context.createGain();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    const noiseSource = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    const nodes: AudioNode[] = [filter, droneA, droneB, droneGain, lfo, lfoGain, noiseSource, noiseFilter, noiseGain];

    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * 0.45;
    }

    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.6);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(760, context.currentTime);
    filter.Q.setValueAtTime(1.7, context.currentTime);
    droneA.type = "sine";
    droneB.type = "sawtooth";
    droneA.frequency.setValueAtTime(55, context.currentTime);
    droneB.frequency.setValueAtTime(82.41, context.currentTime);
    droneGain.gain.setValueAtTime(0.16, context.currentTime);
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.18, context.currentTime);
    lfoGain.gain.setValueAtTime(0.04, context.currentTime);
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(2400, context.currentTime);
    noiseGain.gain.setValueAtTime(0.025, context.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    droneA.connect(droneGain);
    droneB.connect(droneGain);
    droneGain.connect(filter);
    filter.connect(master);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    master.connect(context.destination);

    droneA.start();
    droneB.start();
    lfo.start();
    noiseSource.start();

    const timers = [
      window.setInterval(() => playBlip(context, master), 2600),
      window.setInterval(() => {
        filter.frequency.setTargetAtTime(600 + Math.random() * 320, context.currentTime, 0.8);
      }, 4100),
    ];
    window.setTimeout(() => playBlip(context, master), 280);

    audioRef.current = { context, master, nodes, timers };
    setAudioEnabled(true);
  }

  function stopSignal() {
    const signal = audioRef.current;
    if (!signal) {
      setAudioEnabled(false);
      return;
    }

    signal.timers.forEach((timer) => window.clearInterval(timer));
    signal.master.gain.setTargetAtTime(0.0001, signal.context.currentTime, 0.08);
    window.setTimeout(() => {
      signal.nodes.forEach((node) => {
        if ("stop" in node && typeof node.stop === "function") {
          try {
            node.stop();
          } catch {
            // Oscillators can already be stopped during rapid toggles.
          }
        }
        try {
          node.disconnect();
        } catch {
          // Disconnection is best-effort for nodes already closed.
        }
      });
      signal.context.close();
    }, 180);
    audioRef.current = null;
    setAudioEnabled(false);
  }

  function toggleSignal() {
    if (audioEnabled) {
      stopSignal();
    } else {
      startSignal();
    }
  }

  function startMotion(motion: DeckMotion) {
    setDeckMotion(motion);
    window.clearTimeout(motionTimer.current);
    motionTimer.current = window.setTimeout(() => setDeckMotion("idle"), 580);
  }

  function normalizedRosterOffset(rawOffset: number) {
    if (people.length <= 1) return 0;
    let offset = rawOffset;
    const halfway = people.length / 2;
    if (offset > halfway) offset -= people.length;
    if (offset < -halfway) offset += people.length;
    return offset;
  }

  function rosterMotionForOffset(rawOffset: number) {
    const offset = normalizedRosterOffset(rawOffset);
    const absoluteOffset = Math.abs(offset);
    const visible = absoluteOffset <= 1.85;
    const limitedOffset = Math.max(-1.75, Math.min(1.75, offset));
    const easedOffset = Math.sign(limitedOffset) * Math.pow(Math.abs(limitedOffset), 0.86);
    const translateX = easedOffset * 142;
    const translateY = absoluteOffset * 7;
    const translateZ = -absoluteOffset * 64;
    const rotateY = limitedOffset * -14;
    const rotateZ = limitedOffset * -0.8;
    const scale = Math.max(0.82, 1 - absoluteOffset * 0.07);
    const opacity = visible ? Math.max(0.2, 1 - absoluteOffset * 0.28) : 0;
    const transform = `translate(-50%, -50%) translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(
      2,
    )}px, ${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(
      2,
    )}deg) scale(${scale.toFixed(3)})`;

    return {
      absoluteOffset,
      opacity,
      pointerEvents: visible ? ("auto" as const) : ("none" as const),
      tabIndex: visible ? 0 : -1,
      transform,
      zIndex: String(Math.round(100 - absoluteOffset * 10)),
    };
  }

  function applyRosterMotion(progress = 0) {
    people.forEach((person, index) => {
      const card = rosterCardRefs.current.get(person.id);
      if (!card) return;
      const motion = rosterMotionForOffset(index - currentIndex + progress);
      card.style.transform = motion.transform;
      card.style.opacity = String(motion.opacity);
      card.style.pointerEvents = motion.pointerEvents;
      card.style.zIndex = motion.zIndex;
      card.tabIndex = motion.tabIndex;
      card.toggleAttribute("data-motion-center", motion.absoluteOffset < 0.42);
    });
  }

  function applyRosterDrag(value: number) {
    rosterDragValue.current = value;
    if (rosterDragFrame.current !== undefined) return;
    rosterDragFrame.current = window.requestAnimationFrame(() => {
      rosterDragFrame.current = undefined;
      applyRosterMotion(rosterDragValue.current);
    });
  }

  function clearRosterDragState() {
    rosterDragValue.current = 0;
    if (rosterDragFrame.current !== undefined) {
      window.cancelAnimationFrame(rosterDragFrame.current);
      rosterDragFrame.current = undefined;
    }
    rosterShowcaseRef.current?.removeAttribute("data-dragging");
  }

  function resetRosterDrag() {
    clearRosterDragState();
    applyRosterMotion(0);
  }

  function goToIndex(index: number, motion: DeckMotion = "next") {
    if (!people.length) return;
    startMotion(motion);
    if ((motion === "next" || motion === "previous") && view === "deck") {
      window.clearTimeout(flightTimer.current);
      setFlightCard({ person: currentPerson, direction: motion });
      flightTimer.current = window.setTimeout(() => setFlightCard(null), 540);
    }
    setDragX(0);
    clearRosterDragState();
    setIsRevealed(false);
    setCurrentIndex(((index % people.length) + people.length) % people.length);
  }

  function goNext() {
    goToIndex(currentIndex + 1, "next");
  }

  function goPrevious() {
    goToIndex(currentIndex - 1, "previous");
  }

  function shuffleDeck() {
    if (people.length <= 1) return;
    startMotion("shuffle");
    setFlightCard(null);
    setDragX(0);
    clearRosterDragState();
    setIsRevealed(false);
    setPeople((previous) => {
      const shuffled = [...previous];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
  }

  function markProfileStatus(status: ProfileStatus) {
    setPeople((previous) =>
      previous.map((person) =>
        person.id === currentPerson.id
          ? {
              ...person,
              profileStatus: status,
            }
          : person,
      ),
    );
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    setDragX(Math.max(-120, Math.min(120, delta)));
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    pointerStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (delta < -70) {
      goNext();
      return;
    }
    if (delta > 70) {
      goPrevious();
      return;
    }
    setDragX(0);
  }

  function onRosterPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    rosterPointerStart.current = event.clientX;
    rosterDragValue.current = 0;
    event.currentTarget.setAttribute("data-dragging", "true");
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onRosterPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (rosterPointerStart.current === null) return;
    const delta = event.clientX - rosterPointerStart.current;
    applyRosterDrag(Math.max(-1.18, Math.min(1.18, delta / 150)));
  }

  function onRosterPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (rosterPointerStart.current === null) return;
    const delta = event.clientX - rosterPointerStart.current;
    const shouldGoNext = delta < -42;
    const shouldGoPrevious = delta > 42;

    rosterPointerStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (shouldGoNext) {
      clearRosterDragState();
      goNext();
      return;
    }
    if (shouldGoPrevious) {
      clearRosterDragState();
      goPrevious();
      return;
    }

    resetRosterDrag();
  }

  function onRosterPointerCancel() {
    rosterPointerStart.current = null;
    resetRosterDrag();
  }

  function openRosterCard(index: number) {
    if (index !== currentIndex) {
      goToIndex(index, index > currentIndex ? "next" : "previous");
    } else {
      clearRosterDragState();
    }

    setView("deck");
    setIsRevealed(true);
    setDossierPanelIndex(0);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function scrollDossierPanel(index: number) {
    const container = dossierCarouselRef.current;
    if (!container) return;
    const panels = Array.from(container.querySelectorAll<HTMLElement>(".dossier-packet-panel"));
    const targetIndex = Math.max(0, Math.min(index, panels.length - 1));
    const target = panels[targetIndex];
    if (!target) return;
    setDossierPanelIndex(targetIndex);
    const left = target.offsetLeft - container.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }

  function onDossierCarouselScroll(event: React.UIEvent<HTMLDivElement>) {
    const container = event.currentTarget;
    if (dossierScrollFrame.current !== undefined) return;
    dossierScrollFrame.current = window.requestAnimationFrame(() => {
      dossierScrollFrame.current = undefined;
      const panels = Array.from(container.querySelectorAll<HTMLElement>(".dossier-packet-panel"));
      if (!panels.length) return;
      const center = container.getBoundingClientRect().left + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      panels.forEach((panel, index) => {
        const rect = panel.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setDossierPanelIndex((current) => (current === closestIndex ? current : closestIndex));
    });
  }

  function parseIntel() {
    const trimmedIntel = intelText.trim();
    const trimmedProfile = profileText.trim();
    const trimmedProfileBackground = profileBackgroundText.trim();
    const hasProfileMedia = Boolean(profilePhotoDataUrl || profileBackdropDataUrl || trimmedProfileBackground);
    if (!trimmedIntel && !trimmedProfile && !hasProfileMedia) {
      setImportResult("Paste email, calendar, job, profile text, or attach profile media before parsing.");
      return;
    }

    const timestamp = Date.now();
    const createdEvidence: SourceEvidence[] = [];
    let contacts: { name: string; email?: string }[] = [];

    if (trimmedIntel) {
      const evidenceId = `manual-import-${timestamp}`;
      contacts = extractContacts(trimmedIntel);
      createdEvidence.push({
        id: evidenceId,
        type: "manual",
        title: "Imported interview intel",
        date: new Date().toISOString().slice(0, 10),
        excerpt: `User pasted interview text. Extracted ${contacts.length} possible contact record${
          contacts.length === 1 ? "" : "s"
        }. Excerpt: ${trimmedIntel.slice(0, 300)}`,
        confidence: "user-provided",
      });
    }

    let profileIntel: ParsedProfileIntel | undefined;
    let profileEvidence: SourceEvidence | undefined;
    if (trimmedProfile || hasProfileMedia) {
      profileIntel = trimmedProfile ? parseProfileIntel(trimmedProfile) : undefined;
      const target = people.find((person) => person.id === profileTargetId) ?? currentPerson;
      const mediaDetails = [
        profilePhotoDataUrl ? "Profile photo image attached" : "No profile photo image attached",
        profileBackdropDataUrl ? "Profile background image attached" : "No profile background image attached",
        trimmedProfileBackground
          ? `Background/context note: ${trimmedProfileBackground.slice(0, 220)}`
          : "No background/context note supplied",
      ];
      profileEvidence = {
        id: `profile-import-${target.id}-${timestamp}`,
        type: "linkedin",
        title: `User-provided LinkedIn/profile material: ${target.name}`,
        date: new Date().toISOString().slice(0, 10),
        excerpt: `Headline: ${profileIntel?.headline ?? "not supplied"}. Company: ${
          profileIntel?.company ?? "not supplied"
        }. Keywords: ${profileIntel?.keywords.join(", ") || "none detected"}. ${mediaDetails.join(". ")}.`,
        confidence: "user-provided",
      };
      createdEvidence.push(profileEvidence);
    }

    setCustomEvidence((previous) => mergeEvidence(previous, createdEvidence));

    setPeople((previous) => {
      let next = [...previous];
      const manualEvidenceId = createdEvidence.find((source) => source.id.startsWith("manual-import-"))?.id;

      if (manualEvidenceId && contacts.length > 0) {
        contacts.forEach((contact) => {
          const existingIndex = next.findIndex(
            (person) =>
              (contact.email && person.email?.toLowerCase() === contact.email.toLowerCase()) ||
              person.name.toLowerCase() === contact.name.toLowerCase(),
          );
          if (existingIndex >= 0) {
            const existing = next[existingIndex];
            next[existingIndex] = {
              ...existing,
              email: existing.email ?? contact.email,
              evidenceIds: mergeList(existing.evidenceIds, [manualEvidenceId]),
            };
          } else {
            next.push(createImportedPerson(contact, manualEvidenceId));
          }
        });
      }

      if (profileIntel && profileEvidence) {
        const targetId = profileTargetId || currentPerson.id;
        next = next.map((person) => {
          if (person.id !== targetId) return person;
          const profileRole =
            profileIntel?.currentRole ?? profileIntel?.headline ?? person.roleFromProfile ?? "Profile Pending";
          return {
            ...person,
            roleFromProfile: profileRole,
            profileStatus: "user-provided",
            likelyCaresAbout: mergeList(person.likelyCaresAbout, profileIntel?.likelyPriorities ?? []),
            evidenceIds: mergeList(person.evidenceIds, [profileEvidence.id]),
          };
        });
      }

      if (!profileIntel && profileEvidence) {
        const targetId = profileTargetId || currentPerson.id;
        next = next.map((person) =>
          person.id === targetId
            ? {
                ...person,
                profileStatus: "user-provided",
                profilePhotoUrl: profilePhotoDataUrl || person.profilePhotoUrl,
                profileBackdropUrl: profileBackdropDataUrl || person.profileBackdropUrl,
                profileBackgroundSummary: trimmedProfileBackground || person.profileBackgroundSummary,
                evidenceIds: mergeList(person.evidenceIds, [profileEvidence.id]),
              }
            : person,
        );
      }

      if (profileIntel && profileEvidence && hasProfileMedia) {
        const targetId = profileTargetId || currentPerson.id;
        next = next.map((person) =>
          person.id === targetId
            ? {
                ...person,
                profilePhotoUrl: profilePhotoDataUrl || person.profilePhotoUrl,
                profileBackdropUrl: profileBackdropDataUrl || person.profileBackdropUrl,
                profileBackgroundSummary: trimmedProfileBackground || person.profileBackgroundSummary,
              }
            : person,
        );
      }

      return next;
    });

    const importedCount = contacts.length;
    const profileMessage =
      trimmedProfile || hasProfileMedia ? " Profile material attached as user-provided evidence." : "";
    setImportResult(
      importedCount > 0
        ? `Parsed ${importedCount} contact record${importedCount === 1 ? "" : "s"} into localStorage.${profileMessage}`
        : `No new contact names found.${profileMessage}`,
    );
  }

  function mergeEvidence(previous: SourceEvidence[], additions: SourceEvidence[]) {
    const merged = new Map(previous.map((source) => [source.id, source]));
    additions.forEach((source) => merged.set(source.id, source));
    return Array.from(merged.values());
  }

  function resetDemoData() {
    setPeople(SEED_PEOPLE);
    setCustomEvidence([]);
    setMissionState({ ...DEFAULT_MISSION_STATE });
    setCurrentIndex(0);
    setView("missions");
    setIntelText("");
    setProfileText("");
    setProfileBackgroundText("");
    setProfilePhotoDataUrl("");
    setProfileBackdropDataUrl("");
    setImportResult("Demo data restored. Imported localStorage records cleared.");
  }

  function updateMissionFlag(key: MissionFlag, value: boolean) {
    setMissionState((previous) => ({ ...previous, [key]: value }));
  }

  function resetMissions() {
    setMissionState({ ...DEFAULT_MISSION_STATE });
  }

  function analyzeDebrief() {
    const text = missionState.debriefText.trim();

    if (!missionState.debriefPermissionConfirmed) {
      setMissionState((previous) => ({
        ...previous,
        debriefStatus:
          "Confirm permission/consent before using an interview recording. You can also paste lawful rough notes instead.",
      }));
      return;
    }

    if (!text) {
      setMissionState((previous) => ({
        ...previous,
        debriefStatus: "Paste a voice memo transcript, rough notes, or after-action summary before analysis.",
      }));
      return;
    }

    const lower = text.toLowerCase();
    const signalChecks = [
      {
        keywords: ["alignment", "align", "operating rhythm", "decision rights", "direction"],
        target: "Alignment-first operating rhythm: clarify decision rights, meeting cadence, and shared direction.",
      },
      {
        keywords: ["dashboard", "visibility", "portfolio", "metric", "measure", "reporting"],
        target: "Portfolio visibility: be ready to explain dashboards as a second-step tool after trust and alignment.",
      },
      {
        keywords: ["stakeholder", "communication", "meeting", "facilitate", "trust"],
        target: "Stakeholder communication: prepare a concrete example of building trust across teams.",
      },
      {
        keywords: ["community", "benefit", "ministry", "mission", "good of all"],
        target: "Mission identity: connect answers to service of the poor, human dignity, justice, and common good.",
      },
      {
        keywords: ["clinical", "social", "resources", "services", "sdoh", "neighbors"],
        target: "CHM service scope: study the split between clinical services and social services/resources.",
      },
      {
        keywords: ["scale", "markets", "sites", "fy24", "footprint", "ascension"],
        target: "Ascension scale and footprint: rehearse concise context from the pre-read facts.",
      },
    ];
    const detectedTargets = signalChecks
      .filter((check) => check.keywords.some((keyword) => lower.includes(keyword)))
      .map((check) => check.target);
    const gapLanguage = /struggl|forgot|unsure|don't know|didn't know|missed|blank|confus|stumbled|wish i|should have/i.test(
      text,
    );
    const studyTargets = mergeList(
      detectedTargets,
      gapLanguage
        ? ["Rebuild the answer that felt weak: state the question, your answer, the better answer, and the proof point."]
        : ["Pressure-test your strongest answer against likely follow-up questions."],
    );
    const summary = [
      `Debrief used ${text.split(/\s+/).filter(Boolean).length} words of user-provided notes/transcript.`,
      detectedTargets.length
        ? `Detected ${detectedTargets.length} interview theme${detectedTargets.length === 1 ? "" : "s"} to convert into study cards.`
        : "No explicit CHM theme keywords were detected; review the transcript for exact questions and names.",
      gapLanguage
        ? "The notes include uncertainty or missed-answer language, so the next prep pass should focus on repair answers."
        : "The notes read as a general debrief; add exact questions for sharper coaching.",
    ];
    const followUps = [
      "Create one STAR story for alignment before dashboards: listen, map stakeholders, clarify cadence, then make work visible.",
      "Write a one-sentence answer tying CHM work to ministry identity and community impact.",
      "Add any names, titles, or follow-up topics mentioned in the interview as new source evidence through Import.",
    ];

    setMissionState((previous) => ({
      ...previous,
      debriefCaptured: true,
      debriefAnalyzed: true,
      nextStudyPlanReady: true,
      debriefSummary: summary,
      debriefStudyTargets: studyTargets,
      debriefFollowUps: followUps,
      debriefStatus: "Debrief analyzed locally from user-provided notes.",
    }));
  }

  function exportCurrentCard() {
    const asset = createSvgAsset(currentPerson, currentChips);
    setExportAsset(asset);

    const anchor = document.createElement("a");
    anchor.href = asset.url;
    anchor.download = asset.filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function openCaseFile() {
    setHasOpenedCase(true);
    setView("missions");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  function updateCaseBriefField(field: keyof CaseBriefState, value: string) {
    setCaseBrief((previous) => ({ ...previous, [field]: value }));
  }

  function buildMissionBrief() {
    const message = caseBrief.recruiterMessage.trim();
    const interviewerLine = caseBrief.interviewerLine.trim();
    const roleTitle = caseBrief.roleTitle.trim();
    const organization = caseBrief.organization.trim();
    const interviewDateTime = caseBrief.interviewDateTime.trim();
    const prepMaterials = caseBrief.prepMaterials.trim();
    const researchTargets = caseBrief.researchTargets.trim();
    const combinedIntel = [message, interviewerLine, roleTitle, organization, interviewDateTime, prepMaterials, researchTargets]
      .filter(Boolean)
      .join("\n");

    if (!combinedIntel) {
      setCaseBrief((previous) => ({
        ...previous,
        intakeStatus: "Add the recruiter message, interview time, role, people, or prep materials before building the prep set.",
      }));
      return;
    }

    const timestamp = Date.now();
    const contacts = extractContacts([message, interviewerLine].filter(Boolean).join("\n"));
    const evidenceId = `first-interview-brief-${timestamp}`;
    const evidence: SourceEvidence = {
      id: evidenceId,
      type: "manual",
      title: "First interview message and prep brief",
      date: new Date().toISOString().slice(0, 10),
      excerpt: [
        roleTitle ? `Role: ${roleTitle}` : "",
        organization ? `Organization: ${organization}` : "",
        interviewDateTime ? `Interview time: ${interviewDateTime}` : "",
        contacts.length
          ? `People detected: ${contacts.map((contact) => contact.name).join(", ")}`
          : "People detected: none yet",
        prepMaterials ? `Prep materials: ${prepMaterials.slice(0, 180)}` : "",
        researchTargets ? `Research targets: ${researchTargets.slice(0, 180)}` : "",
        message ? `Recruiter message excerpt: ${message.slice(0, 220)}` : "",
      ]
        .filter(Boolean)
        .join(". "),
      confidence: "user-provided",
    };

    setCustomEvidence((previous) => mergeEvidence(previous, [evidence]));
    setIntelText(message || combinedIntel);
    setImportResult(
      `First-interview prep saved. Detected ${contacts.length} possible profile target${
        contacts.length === 1 ? "" : "s"
      }. Bring back profile screenshots through Intake.`,
    );

    if (contacts.length) {
      setPeople((previous) => {
        const next = [...previous];
        contacts.forEach((contact) => {
          const existingIndex = next.findIndex(
            (person) =>
              (contact.email && person.email?.toLowerCase() === contact.email.toLowerCase()) ||
              person.name.toLowerCase() === contact.name.toLowerCase(),
          );
          if (existingIndex >= 0) {
            const existing = next[existingIndex];
            next[existingIndex] = {
              ...existing,
              email: existing.email ?? contact.email,
              evidenceIds: mergeList(existing.evidenceIds, [evidenceId]),
            };
            return;
          }
          next.push(createImportedPerson(contact, evidenceId));
        });
        return next;
      });
    }

    setMissionState((previous) => ({
      ...previous,
      profileSearchDone: previous.profileSearchDone || contacts.length > 0,
      documentPdfFound: previous.documentPdfFound || Boolean(prepMaterials),
      documentFactsCaptured: previous.documentFactsCaptured || Boolean(researchTargets),
    }));
    setHasOpenedCase(true);
    setView("missions");
    setCaseBrief((previous) => ({
      ...previous,
      intakeStatus: `Mission built from first-interview intake. ${contacts.length} possible profile target${
        contacts.length === 1 ? "" : "s"
      } detected.`,
    }));
  }

  function renderCaseNav() {
    return (
      <nav className="case-nav" aria-label="Interview prep sections">
        {VIEW_NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? "active" : ""}
            aria-current={view === item.id ? "page" : undefined}
            onClick={() => setView(item.id)}
          >
            <span>{item.label}</span>
            <small>{item.detail}</small>
          </button>
        ))}
      </nav>
    );
  }

  function renderFlightCard() {
    if (!flightCard || (flightCard.direction !== "next" && flightCard.direction !== "previous")) return null;
    const chips = sourceChips(flightCard.person.evidenceIds, sourcesById, flightCard.person);

    return (
      <article className={`flight-card flight-${flightCard.direction}`} aria-hidden="true">
        <div className="flight-card-inner">
          <p className="kicker">PRACTICE SNAPSHOT</p>
          <div className="flight-file-lines">
            <span>Person: {flightCard.person.name}</span>
            <span>Role: {displayRole(flightCard.person)}</span>
            <span>Prep set: Interview</span>
          </div>
          <div className={flightCard.person.profilePhotoUrl ? "mini-flight-portrait has-photo" : "mini-flight-portrait"}>
            {flightCard.person.profilePhotoUrl ? (
              <img src={flightCard.person.profilePhotoUrl} alt="" />
            ) : (
              <span>{flightCard.person.initials}</span>
            )}
          </div>
          <strong>CHECK THE NOTES</strong>
          <small>Use confirmed details when you are in the room.</small>
          <SourceChips chips={chips.slice(0, 4)} compact />
        </div>
      </article>
    );
  }

  function renderDeck() {
    const dossierPanelLabels = [
      "Identity",
      currentPerson.profileBackdropUrl || currentPerson.profileBackgroundSummary ? "Background" : null,
      currentProfilePacketSources.length > 0 ? "Packet" : null,
      "Mark",
      "Context",
      "Priorities",
      "Approach",
      "Question",
      activeStudyCard ? "Study" : null,
    ].filter((label): label is string => Boolean(label));

    return (
      <>
        <section className="simple-file-header" aria-label="Current file">
          <div>
            <p className="kicker">PERSON</p>
            <h2>{currentPerson.name}</h2>
            <span>
              {String(currentIndex + 1).padStart(2, "0")} / {String(people.length).padStart(2, "0")} ·{" "}
              {displayRole(currentPerson)}
            </span>
          </div>
        </section>

        <section className="case-status-panel" aria-label="Active person status">
          <div className="case-status-top">
            <div>
              <p className="kicker">CURRENT PERSON</p>
              <h2>{currentPerson.name}</h2>
              <span>{currentPerson.functionInInterview}</span>
            </div>
            <div className="file-count-badge">
              <strong>
                {String(currentIndex + 1).padStart(2, "0")}/{String(people.length).padStart(2, "0")}
              </strong>
              <small>{deckProgress}%</small>
            </div>
          </div>
          <div className="progress-track" aria-label={`Deck progress ${deckProgress}%`}>
            <span style={{ width: `${deckProgress}%` }} />
          </div>
          <div className="case-metrics">
            <div>
              <span>Notes</span>
              <strong>{currentSources.length}</strong>
              <small>{currentSourceTypeCount} source type{currentSourceTypeCount === 1 ? "" : "s"}</small>
            </div>
            <div>
              <span>Profile</span>
              <strong>{statusLabel(currentPerson.profileStatus)}</strong>
              <small>{roleConfidence(currentPerson)}</small>
            </div>
            <div>
              <span>Coverage</span>
              <strong>{sourcedPersonCount}/{people.length}</strong>
              <small>{pendingProfileCount} profile pending</small>
            </div>
          </div>
        </section>

        <nav className="initials-rail" aria-label="Jump by initials">
          {people.map((person, index) => (
            <button
              key={person.id}
              type="button"
              className={index === currentIndex ? "active" : ""}
              aria-label={`Jump to ${person.name}`}
              onClick={() => goToIndex(index, index > currentIndex ? "next" : "previous")}
            >
              {person.initials}
            </button>
          ))}
        </nav>

        <section className="deck-command-shelf" aria-label="Deck command shelf">
          <section className="action-pad" aria-label="Flashcard actions">
            <button type="button" onClick={goPrevious}>
              Previous
            </button>
            <button className="primary-action" type="button" onClick={() => setIsRevealed((value) => !value)}>
              {isRevealed ? "Hide" : "Reveal"}
            </button>
            <button type="button" onClick={goNext}>
              Next
            </button>
          </section>
        </section>

        <section className="simple-card-controls" aria-label="Primary flashcard controls">
          <button type="button" onClick={goPrevious}>
            Previous
          </button>
          <button className="primary-action" type="button" onClick={() => setIsRevealed((value) => !value)}>
            {isRevealed ? "Hide" : "Reveal"}
          </button>
          <button type="button" onClick={goNext}>
            Next
          </button>
        </section>

        <section className="deck-stage" data-motion={deckMotion}>
          {secondNextPerson ? (
            <div className="ghost-card ghost-two" data-folder={(currentIndex + 2) % 4} aria-hidden="true">
              <span>{secondNextPerson.initials}</span>
            </div>
          ) : null}
          {nextPerson ? (
            <div className="ghost-card ghost-one" data-folder={(currentIndex + 1) % 4} aria-hidden="true">
              <span>{nextPerson.initials}</span>
            </div>
          ) : null}
          {renderFlightCard()}
          <div
            className="drag-shell"
            style={{
              transform: `translateX(${dragX}px) rotate(${dragX * 0.025}deg)`,
              opacity: dragX ? Math.max(0.62, 1 - Math.abs(dragX) / 210) : 1,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointerStart.current = null;
              setDragX(0);
            }}
          >
            <article
              className={isRevealed ? "person-card is-revealed" : "person-card"}
              data-folder={currentIndex % 4}
              key={currentPerson.id}
            >
              <div className="card-face card-front">
                <div className="file-tab">{currentPerson.initials}</div>
                <div className="reticle" aria-hidden="true" />
                <div className="confidential-stamp" aria-hidden="true">
                  READY
                </div>
                <p className="kicker">PERSON</p>
                <div className="intel-file-head">
                  <strong>Review details</strong>
                  <span>Person: {currentPerson.name}</span>
                  <span>Prep set: Interview</span>
                  <span>Status: {roleConfidence(currentPerson)}</span>
                </div>
                <div className={currentPerson.profilePhotoUrl ? "portrait-frame has-photo" : "portrait-frame"}>
                  {currentPerson.profilePhotoUrl ? (
                    <img src={currentPerson.profilePhotoUrl} alt={`${currentPerson.name} user-provided profile`} />
                  ) : (
                    <span>{currentPerson.initials}</span>
                  )}
                </div>
                <h2>{currentPerson.name}</h2>
                <p className="email-line">{currentPerson.email ?? "Email pending"}</p>
                <div className="role-panel">
                  <span>ROLE</span>
                  <strong>{displayRole(currentPerson)}</strong>
                  <small>{roleConfidence(currentPerson)}</small>
                </div>
                <p className="prompt-line">Tap Reveal for the practice notes.</p>
                <SourceChips chips={currentChips} />
              </div>

              <div className="card-face card-back">
                <div className="file-tab">{currentPerson.initials}</div>
                <p className="kicker">PRACTICE NOTES</p>
                <h2>{currentPerson.name}</h2>
                <p className="email-line">{currentPerson.email ?? "Email pending"}</p>

                <section
                  className="dossier-packet-shell"
                  aria-label={`${currentPerson.name} swipeable prep cards`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onPointerMove={(event) => event.stopPropagation()}
                  onPointerUp={(event) => event.stopPropagation()}
                >
                  <div className="dossier-packet-toolbar">
                    <span>{dossierPanelLabels[dossierPanelIndex] ?? "Identity"}</span>
                    <div>
                      <button
                        type="button"
                        aria-label="Previous prep card"
                        onClick={() => scrollDossierPanel(dossierPanelIndex - 1)}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        aria-label="Next prep card"
                        onClick={() => scrollDossierPanel(dossierPanelIndex + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div
                    className="dossier-packet-carousel"
                    ref={dossierCarouselRef}
                    onScroll={onDossierCarouselScroll}
                  >
                    <article className="dossier-packet-panel">
                      <span>Identity</span>
                      <h3>Role and function</h3>
                      <div className="status-grid dossier-status-grid">
                        <div>
                          <span>Role</span>
                          <strong>{displayRole(currentPerson)}</strong>
                          <small>{roleConfidence(currentPerson)}</small>
                        </div>
                        <div>
                          <span>Function</span>
                          <strong>{currentPerson.functionInInterview}</strong>
                          <small>{statusLabel(currentPerson.profileStatus)}</small>
                        </div>
                      </div>
                      <SourceChips chips={currentChips} compact />
                    </article>

                    {currentPerson.profileBackdropUrl || currentPerson.profileBackgroundSummary ? (
                      <article className="dossier-packet-panel profile-media-panel">
                        <span>Background</span>
                        <h3>Profile background</h3>
                        {currentPerson.profileBackdropUrl ? (
                          <div className="profile-background-artifact">
                            <img
                              src={currentPerson.profileBackdropUrl}
                              alt={`${currentPerson.name} user-provided profile background`}
                            />
                          </div>
                        ) : null}
                        <p>
                          {currentPerson.profileBackgroundSummary ??
                            "User-provided profile media is attached. No background/context note was supplied."}
                        </p>
                        <SourceChips chips={["LINKEDIN: USER PROVIDED", "USER PROVIDED"]} compact />
                      </article>
                    ) : null}

                    {currentProfilePacketSources.length > 0 ? (
                      <article
                        className="dossier-packet-panel profile-file-stack"
                        aria-label={`${currentPerson.name} profile packet files`}
                      >
                        <div className="profile-file-stack-top">
                          <span>Profile notes</span>
                          <strong>{currentProfilePacketSources.length} items</strong>
                        </div>
                        <div className="profile-file-grid">
                          {currentProfilePacketSources.map((source, index) => (
                            <article className="profile-file-slip" key={source.id}>
                              <div className="profile-file-slip-top">
                                <span>ITEM {String(index + 1).padStart(2, "0")}</span>
                                <small>{sourceTypeLabel(source.type)}</small>
                              </div>
                              <h3>{source.title.replace(/^User-provided LinkedIn screenshot: /, "")}</h3>
                              <p>{source.excerpt}</p>
                              <SourceChips
                                chips={[
                                  source.type === "linkedin" ? "LINKEDIN: VERIFIED" : "SCREENSHOT",
                                  confidenceLabel(source.confidence).toUpperCase(),
                                ]}
                                compact
                              />
                            </article>
                          ))}
                        </div>
                      </article>
                    ) : null}

                    <article className="dossier-packet-panel profile-status">
                      <span>Profile mark</span>
                      <h3>Evidence status</h3>
                      <div>
                        {(["verified", "user-provided", "profile-pending"] as ProfileStatus[]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={currentPerson.profileStatus === status ? "active" : ""}
                            onClick={() => markProfileStatus(status)}
                          >
                            {statusLabel(status)}
                          </button>
                        ))}
                      </div>
                    </article>

                    <article className="dossier-packet-panel reveal-card-panel">
                      <span>Context</span>
                      <h3>Why this person matters</h3>
                      <p>{currentPerson.whyTheyMatter}</p>
                    </article>

                    <article className="dossier-packet-panel reveal-card-panel">
                      <span>Priorities</span>
                      <h3>Likely cares about</h3>
                      <ul>
                        {currentPerson.likelyCaresAbout.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="dossier-packet-panel reveal-card-panel">
                      <span>Approach</span>
                      <h3>How to speak to them</h3>
                      <ul>
                        {currentPerson.howToSpeakToThem.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="dossier-packet-panel reveal-card-panel">
                      <span>Question</span>
                      <h3>Smart question to ask</h3>
                      <p>{currentPerson.smartQuestion}</p>
                    </article>

                    {activeStudyCard ? (
                      <article className="dossier-packet-panel reveal-card-panel study-card">
                        <div className="study-card-top">
                          <span>{activeStudyCard.category}</span>
                          <div className="study-pips">
                            {currentStudyCards.map((card, index) => (
                              <button
                                key={card.id}
                                type="button"
                                aria-label={`Show flashcard ${index + 1}`}
                                className={index === studyCardIndex ? "active" : ""}
                                onClick={() => setStudyCardIndex(index)}
                              />
                            ))}
                          </div>
                        </div>
                        <h3>{activeStudyCard.prompt}</h3>
                        <p>{activeStudyCard.answer}</p>
                        <SourceChips chips={activeStudyCardChips} compact />
                      </article>
                    ) : null}
                  </div>

                  <nav className="dossier-panel-pips" aria-label="Prep card panels">
                    {dossierPanelLabels.map((label, index) => (
                      <button
                        key={`${label}-${index}`}
                        type="button"
                        className={index === dossierPanelIndex ? "active" : ""}
                        aria-label={`Show ${label} panel`}
                        onClick={() => scrollDossierPanel(index)}
                      >
                        <span>{label}</span>
                      </button>
                    ))}
                  </nav>
                </section>

                <SourceChips chips={currentChips} />
              </div>
            </article>
          </div>
        </section>
      </>
    );
  }

  function renderRoster() {
    return (
      <section className="roster-view">
        <div className="view-header">
          <div>
            <p className="kicker">PEOPLE</p>
            <h2>People in the room</h2>
          </div>
        </div>

        <div
          className="roster-showcase"
          ref={rosterShowcaseRef}
          aria-label="Swipe through people"
          onPointerDown={onRosterPointerDown}
          onPointerMove={onRosterPointerMove}
          onPointerUp={onRosterPointerUp}
          onPointerCancel={onRosterPointerCancel}
        >
          <div className="roster-orbit">
          {people.map((person, index) => {
            const chips = sourceChips(person.evidenceIds, sourcesById, person);
            const motion = rosterMotionForOffset(index - currentIndex);
            return (
              <article
                className={index === currentIndex ? "roster-card roster-orbit-card active" : "roster-card roster-orbit-card"}
                key={person.id}
                ref={(node) => {
                  if (node) {
                    rosterCardRefs.current.set(person.id, node);
                  } else {
                    rosterCardRefs.current.delete(person.id);
                  }
                }}
                aria-current={index === currentIndex ? "true" : undefined}
                data-motion-center={motion.absoluteOffset < 0.42 ? "" : undefined}
                tabIndex={motion.tabIndex}
                style={{
                  opacity: motion.opacity,
                  pointerEvents: motion.pointerEvents,
                  transform: motion.transform,
                  zIndex: motion.zIndex,
                }}
                role="button"
                onClick={() => {
                  openRosterCard(index);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openRosterCard(index);
                  }
                }}
              >
                <span className="mini-tab">{person.initials}</span>
                <span className={person.profilePhotoUrl ? "mini-portrait has-photo" : "mini-portrait"}>
                  {person.profilePhotoUrl ? (
                    <img src={person.profilePhotoUrl} alt={`${person.name} user-provided profile`} />
                  ) : (
                    person.initials
                  )}
                </span>
                <strong>{person.name}</strong>
                <small>{displayRole(person)}</small>
                <SourceChips chips={chips} compact />
              </article>
            );
          })}
          </div>
        </div>

        <div className="roster-orbit-controls" aria-label="Roster carousel controls">
          <button type="button" onClick={goPrevious}>
            Previous
          </button>
          <button className="primary-action" type="button" onClick={() => openRosterCard(currentIndex)}>
            Open
          </button>
          <button type="button" onClick={goNext}>
            Next
          </button>
        </div>

      </section>
    );
  }

  function renderBriefing() {
    return (
      <section className="briefing-view">
        <div className="view-header">
          <div>
            <p className="kicker">PRE-READ BRIEF</p>
            <h2>CHM briefing file</h2>
          </div>
          <button type="button" onClick={() => setView("deck")}>
            Back to Deck
          </button>
        </div>

        <div className="briefing-console">
          <div className="briefing-radar" data-radar={briefingIndex % 4} aria-hidden="true">
            <span className="radar-grid" />
            <span className="radar-sweep" />
            <span className="map-block block-a" />
            <span className="map-block block-b" />
            <span className="map-block block-c" />
            <span className="map-dot dot-a" />
            <span className="map-dot dot-b" />
            <span className="map-dot dot-c" />
            <span className="map-dot dot-d" />
            <span className="map-dot dot-e" />
          </div>

          <div className="briefing-copy">
            <p className="kicker">{activeBriefing.label}</p>
            <h3>{activeBriefing.title}</h3>
            <strong>{activeBriefing.metric}</strong>
            <p>{activeBriefing.summary}</p>
            <SourceChips chips={sourceChips([...activeBriefing.evidenceIds], sourcesById)} compact />
          </div>
        </div>

        <nav className="briefing-tabs" aria-label="Pre-read briefing files">
          {BRIEFING_CARDS.map((briefing, index) => (
            <button
              key={briefing.id}
              type="button"
              className={index === briefingIndex ? "active" : ""}
              onClick={() => setBriefingIndex(index)}
            >
              {briefing.label}
            </button>
          ))}
        </nav>

        <article className="briefing-paper">
          <div className="confidential-stamp compact-stamp" aria-hidden="true">
            SOURCE
          </div>
          <h3>{activeBriefing.title}</h3>
          <ul>
            {activeBriefing.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>

        <div className="briefing-source-stack">
          {activeBriefingSources.map((source) => (
            <article className="source-paper mini-source" key={source.id}>
              <div className="source-paper-top">
                <span>{sourceTypeLabel(source.type)}</span>
                <span>{confidenceLabel(source.confidence)}</span>
              </div>
              <h3>{source.title}</h3>
              <p>{source.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderStartGate() {
    return (
      <section className="start-gate" aria-label="Open interview case file">
        <article className="start-folder">
          <div className="start-folder-tab" aria-hidden="true">
            NEW PREP
          </div>
          <p className="kicker">INTERVIEW RECEIVED</p>
          <h2>Set up the conversation.</h2>
          <p>
            Start with the invite, the people named, the role, the date, and any material you were sent.
          </p>
          <div className="start-case-lines" aria-label="Case intake checklist">
            <span>Recruiter message</span>
            <span>Date and time</span>
            <span>People mentioned</span>
            <span>Pre-read and links</span>
            <span>Profile screenshots</span>
            <span>Website and news scan</span>
          </div>
          <button className="start-tap-button" type="button" onClick={openCaseFile}>
            Start Prep
          </button>
        </article>
        <aside className="start-brief">
          <span>WHAT TO COLLECT</span>
          <p>
            Bring back profile screenshots, PDFs, notes, and public material you are allowed to keep. Every claim keeps
            a visible source.
          </p>
        </aside>
      </section>
    );
  }

  function renderFirstInterviewIntake() {
    return (
      <article className="first-interview-panel">
        <div className="case-form-header">
          <div>
            <p className="kicker">START HERE</p>
            <h3>First interview intake</h3>
          </div>
          <span>Local only</span>
        </div>
        <p>
          Paste the first recruiter message or invite, then fill any missing blanks. This creates the prep brief and
          tells you what screenshots, docs, and profile evidence to collect next.
        </p>
        <div className="case-form-grid">
          <label className="wide-field">
            Recruiter message or calendar invite
            <textarea
              value={caseBrief.recruiterMessage}
              onChange={(event) => updateCaseBriefField("recruiterMessage", event.target.value)}
              placeholder="Paste the interview message, calendar invite, sender notes, dates, links, and names here."
            />
          </label>
          <label>
            Role
            <input
              value={caseBrief.roleTitle}
              onChange={(event) => updateCaseBriefField("roleTitle", event.target.value)}
              placeholder="Program Manager, Community Impact"
            />
          </label>
          <label>
            Organization
            <input
              value={caseBrief.organization}
              onChange={(event) => updateCaseBriefField("organization", event.target.value)}
              placeholder="Ascension"
            />
          </label>
          <label>
            Interview date and time
            <input
              value={caseBrief.interviewDateTime}
              onChange={(event) => updateCaseBriefField("interviewDateTime", event.target.value)}
              placeholder="Jun 18, 2026, 1:00 PM"
            />
          </label>
          <label>
            People mentioned
            <input
              value={caseBrief.interviewerLine}
              onChange={(event) => updateCaseBriefField("interviewerLine", event.target.value)}
              placeholder="Names or emails from the invite"
            />
          </label>
          <label className="wide-field">
            Decks, PDFs, links, or attachments to review
            <textarea
              value={caseBrief.prepMaterials}
              onChange={(event) => updateCaseBriefField("prepMaterials", event.target.value)}
              placeholder="Candidate pre-read, job description, calendar attachments, website pages, PDFs."
            />
          </label>
          <label className="wide-field">
            Website/news research targets
            <textarea
              value={caseBrief.researchTargets}
              onChange={(event) => updateCaseBriefField("researchTargets", event.target.value)}
              placeholder="Company news, leadership pages, program pages, public reports, recent announcements."
            />
          </label>
        </div>
        <div className="case-form-actions">
          <button className="primary-action" type="button" onClick={buildMissionBrief}>
            Build Prep
          </button>
          <button type="button" onClick={() => setView("import")}>
            Attach Evidence
          </button>
        </div>
        <output className="case-brief-status">{caseBrief.intakeStatus}</output>
      </article>
    );
  }

  function renderMissions() {
    const verifiedPeopleCount = people.filter((person) => person.profileStatus === "verified").length;
    const verifiedEvidenceCount = allEvidence.filter((source) => source.confidence === "verified").length;
    const sourceTypeCount = new Set(allEvidence.map((source) => source.type)).size;
    const activeFileNumber = `${String(currentIndex + 1).padStart(2, "0")} / ${String(people.length).padStart(2, "0")}`;
    const panelPeople = people.slice(0, 8);
    const focusPeople = people.slice(0, 4);

    return (
      <section className="missions-view expert-home">
        <article className="expert-command-panel" aria-label="Upcoming interview prep brief">
          <div className="expert-command-topline">
            <span>Upcoming conversation</span>
            <span>Panel ready</span>
          </div>
          <div className="expert-command-main">
            <div>
              <p className="kicker">INTERVIEW PREP</p>
              <h2>Walk in ready.</h2>
              <p>
                Your people, notes, priorities, and practice cards are organized for the next conversation. Start with
                who is in the room, then rehearse the points you want to land.
              </p>
            </div>
            <div className="expert-signal-lens" aria-hidden="true">
              <span />
              <i />
            </div>
          </div>
          <div className="expert-command-footer">
            <button
              className="primary-action expert-study-button"
              type="button"
              onClick={() => {
                setView("deck");
                setIsRevealed(false);
              }}
            >
              Start Practice
            </button>
            <dl className="expert-metric-strip" aria-label="Loaded prep summary">
              <div>
                <dt>People</dt>
                <dd>{people.length}</dd>
              </div>
              <div>
                <dt>Ready</dt>
                <dd>{verifiedPeopleCount}</dd>
              </div>
              <div>
                <dt>Notes</dt>
                <dd>{allEvidence.length}</dd>
              </div>
            </dl>
          </div>
        </article>

        <article className="expert-current-file" aria-label="Current person to review">
          <button
            className="expert-current-file-button"
            type="button"
            onClick={() => {
              setView("deck");
              setIsRevealed(false);
            }}
          >
            <span className={currentPerson.profilePhotoUrl ? "expert-current-avatar has-photo" : "expert-current-avatar"}>
              {currentPerson.profilePhotoUrl ? (
                <img src={currentPerson.profilePhotoUrl} alt={`${currentPerson.name} user-provided profile`} />
              ) : (
                currentPerson.initials
              )}
            </span>
            <span className="expert-current-copy">
              <small>{currentPerson.functionInInterview}</small>
              <strong>{currentPerson.name}</strong>
              <span>{displayRole(currentPerson)}</span>
            </span>
            <span className="expert-current-count">{activeFileNumber}</span>
          </button>
        </article>

        <section className="expert-panel-map" aria-label="Interview panel map">
          <div className="expert-section-header">
            <div>
              <p className="kicker">PANEL</p>
              <h3>People in the room.</h3>
            </div>
            <span>{sourceTypeCount} note types</span>
          </div>
          <div className="expert-panel-list">
            {panelPeople.map((person, index) => {
              const chips = sourceChips(person.evidenceIds, sourcesById, person).slice(0, 1);
              return (
                <article
                  className={index === currentIndex ? "expert-person-row active" : "expert-person-row"}
                  key={person.id}
                  aria-current={index === currentIndex ? "true" : undefined}
                >
                  <span className={person.profilePhotoUrl ? "expert-mini-avatar has-photo" : "expert-mini-avatar"}>
                    {person.profilePhotoUrl ? (
                      <img src={person.profilePhotoUrl} alt={`${person.name} user-provided profile`} />
                    ) : (
                      person.initials
                    )}
                  </span>
                  <span>
                    <strong>{person.name}</strong>
                    <small>{displayRole(person)}</small>
                  </span>
                  <SourceChips chips={chips} compact />
                </article>
              );
            })}
          </div>
        </section>

        <article className="expert-room-panel" aria-label="Study focus">
          <div className="expert-section-header">
            <div>
              <p className="kicker">FOCUS</p>
              <h3>Conversation priorities.</h3>
            </div>
            <span>{verifiedEvidenceCount} confirmed notes</span>
          </div>
          <div className="expert-focus-stack">
            <section>
              <span>01</span>
              <div>
                <strong>Know who is listening.</strong>
                <p>Start with names, roles, and what each person likely cares about.</p>
              </div>
            </section>
            <section>
              <span>02</span>
              <div>
                <strong>Make alignment concrete.</strong>
                <p>Connect your examples to clarity, follow-through, trust, and practical outcomes.</p>
              </div>
            </section>
            <section>
              <span>03</span>
              <div>
                <strong>Practice, then simplify.</strong>
                <p>Use Cards to rehearse, then carry only the strongest points into the conversation.</p>
              </div>
            </section>
          </div>
        </article>

        <section className="expert-priority-strip" aria-label="Priority people">
          {focusPeople.map((person, index) => (
            <button
              key={person.id}
              type="button"
              className={index === currentIndex ? "active" : ""}
              onClick={() => {
                setCurrentIndex(index);
                setView("deck");
                setIsRevealed(false);
              }}
            >
              <span>{person.initials}</span>
              <strong>{person.name.split(" ")[0]}</strong>
            </button>
          ))}
        </section>
      </section>
    );
  }

  function renderMissionOperations() {
    const profileProgress = [
      missionState.profileSearchDone,
      missionState.profilePhotoCaptured,
      missionState.profileExperienceCaptured,
      missionState.profileEvidenceAttached,
    ].filter(Boolean).length;
    const documentProgress = [
      missionState.documentPdfFound,
      missionState.documentFactsCaptured,
      missionState.documentQuestionsBuilt,
      missionState.documentEvidenceAttached,
    ].filter(Boolean).length;
    const debriefProgress = [
      missionState.debriefPermissionConfirmed,
      missionState.debriefCaptured,
      missionState.debriefAnalyzed,
      missionState.nextStudyPlanReady,
    ].filter(Boolean).length;
    const missionTotal = profileProgress + documentProgress + debriefProgress;
    const missionMax = 12;
    const missionPercent = Math.round((missionTotal / missionMax) * 100);
    const pendingNames = people
      .filter((person) => person.profileStatus === "profile-pending")
      .slice(0, 3)
      .map((person) => person.initials)
      .join(" ");

    return (
      <section className="missions-view">
        <div className="view-header">
          <div>
            <p className="kicker">TODAY</p>
            <h2>Interview prep</h2>
          </div>
          <button type="button" onClick={() => setView("deck")}>
            Practice
          </button>
        </div>

        {renderFirstInterviewIntake()}

        <article className="simple-mission-brief" aria-label="Prep summary">
          <div className="simple-mission-top">
            <p className="kicker">PREP PATH</p>
            <strong>{missionTotal}/{missionMax} checks logged</strong>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Paste the invite.</strong>
                <p>Capture the role, time, recruiter note, people, and attachments.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Add supporting notes.</strong>
                <p>Upload profile screenshots, pre-reads, PDFs, and notes you are allowed to keep.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Practice the conversation.</strong>
                <p>Use the deck to rehearse who matters, what to emphasize, and what to ask.</p>
              </div>
            </li>
          </ol>
          <div className="simple-file-actions">
            <button type="button" onClick={() => setView("import")}>
              Attach Notes
            </button>
            <button type="button" onClick={() => setView("briefing")}>
              Pre-Read
            </button>
            <button type="button" onClick={() => setView("metadata")}>
              Source Log
            </button>
            <button className="primary-action" type="button" onClick={() => setView("deck")}>
              Study Deck
            </button>
          </div>
        </article>

        <article className="mission-command">
          <div>
            <p className="kicker">PREP LEDGER</p>
            <h3>What to collect</h3>
            <p>
              Build the prep set from material you are allowed to keep: profile screenshots, PDFs, pre-reads,
              interview notes, and transcripts. Each item is logged before it becomes a study card.
            </p>
          </div>
          <div className="mission-dial" aria-label={`Case progress ${missionPercent}%`}>
            <strong>{missionPercent}%</strong>
            <span>
              {missionTotal}/{missionMax} steps
            </span>
          </div>
          <div className="mission-phase-grid" aria-label="Case phase progress">
            <section>
              <span>Profile</span>
              <strong>{profileProgress}/4</strong>
              <div className="mission-mini-track">
                <i style={{ width: `${(profileProgress / 4) * 100}%` }} />
              </div>
            </section>
            <section>
              <span>Documents</span>
              <strong>{documentProgress}/4</strong>
              <div className="mission-mini-track">
                <i style={{ width: `${(documentProgress / 4) * 100}%` }} />
              </div>
            </section>
            <section>
              <span>Debrief</span>
              <strong>{debriefProgress}/4</strong>
              <div className="mission-mini-track">
                <i style={{ width: `${(debriefProgress / 4) * 100}%` }} />
              </div>
            </section>
          </div>
        </article>

        <article className="active-target-file">
          <div className={currentPerson.profilePhotoUrl ? "target-portrait has-photo" : "target-portrait"}>
            {currentPerson.profilePhotoUrl ? (
              <img src={currentPerson.profilePhotoUrl} alt={`${currentPerson.name} user-provided profile`} />
            ) : (
              <span>{currentPerson.initials}</span>
            )}
          </div>
          <div className="target-copy">
            <p className="kicker">CURRENT PERSON</p>
            <h3>{currentPerson.name}</h3>
            <p>{displayRole(currentPerson)}</p>
            <SourceChips chips={currentChips} compact />
          </div>
          <div className="target-actions">
            <button type="button" onClick={() => setView("deck")}>
              Practice
            </button>
            <button type="button" onClick={goNext}>
              Next Person
            </button>
          </div>
        </article>

        <div className="field-summary-strip" aria-label="Prep summary">
          <span>{people.length} people</span>
          <span>{allEvidence.length} source notes</span>
          <span>{pendingProfileCount} pending profiles</span>
          <span>{pendingNames || "profiles tracked"}</span>
        </div>

        <div className="mission-grid">
          <article className="mission-card">
            <div className="mission-card-top">
              <span>STEP 01</span>
              <strong>Profile check</strong>
              <small>{profileProgress}/4</small>
            </div>
            <p>
              Search manually, confirm the correct person, then bring back screenshots of the photo, headline, company,
              current role, and previous-role evidence. The app handles organizing and sourcing after that.
            </p>
            <div className="mission-checklist">
              <label>
                <input
                  type="checkbox"
                  checked={missionState.profileSearchDone}
                  onChange={(event) => updateMissionFlag("profileSearchDone", event.target.checked)}
                />
                <span>Open the public profile or search result manually</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.profilePhotoCaptured}
                  onChange={(event) => updateMissionFlag("profilePhotoCaptured", event.target.checked)}
                />
                <span>Capture photo, headline, and company screenshot</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.profileExperienceCaptured}
                  onChange={(event) => updateMissionFlag("profileExperienceCaptured", event.target.checked)}
                />
                <span>Capture current and previous-role evidence</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.profileEvidenceAttached}
                  onChange={(event) => updateMissionFlag("profileEvidenceAttached", event.target.checked)}
                />
                <span>Attach screenshots through Intake as user-provided notes</span>
              </label>
            </div>
            <div className="mission-actions">
              <button type="button" onClick={() => setView("import")}>
                Attach Screenshots
              </button>
              <button type="button" onClick={() => setView("roster")}>
                Pick Person
              </button>
            </div>
          </article>

          <article className="mission-card">
            <div className="mission-card-top">
              <span>STEP 02</span>
              <strong>Document review</strong>
              <small>{documentProgress}/4</small>
            </div>
            <p>
              Pull in PDFs, pre-reads, calendar attachments, and email-linked files. Treat each slide, metric, org
              chart, and unclear claim as a note before it becomes a card.
            </p>
            <div className="mission-checklist">
              <label>
                <input
                  type="checkbox"
                  checked={missionState.documentPdfFound}
                  onChange={(event) => updateMissionFlag("documentPdfFound", event.target.checked)}
                />
                <span>Find PDFs, pre-reads, and attachments mentioned in email</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.documentFactsCaptured}
                  onChange={(event) => updateMissionFlag("documentFactsCaptured", event.target.checked)}
                />
                <span>Capture names, dates, metrics, market maps, and org charts</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.documentQuestionsBuilt}
                  onChange={(event) => updateMissionFlag("documentQuestionsBuilt", event.target.checked)}
                />
                <span>Turn unclear or partial claims into interview questions</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.documentEvidenceAttached}
                  onChange={(event) => updateMissionFlag("documentEvidenceAttached", event.target.checked)}
                />
                <span>Attach document excerpts or screenshots through Intake</span>
              </label>
            </div>
            <div className="mission-actions">
              <button type="button" onClick={() => setView("briefing")}>
                Review Briefing
              </button>
              <button type="button" onClick={() => setIsEvidenceOpen(true)}>
                Open Source Trail
              </button>
            </div>
          </article>

          <article className="mission-card risky-mission">
            <div className="mission-card-top">
              <span>STEP 03</span>
              <strong>Interview debrief</strong>
              <small>{debriefProgress}/4</small>
            </div>
            <p>
              After the interview, paste a permitted voice memo transcript, rough notes, or after-action summary. The
              app will convert it into study targets for the next round.
            </p>
            <div className="risk-note">
              Recording laws and company policies vary. Use this only when recording or retaining notes is allowed and,
              when required, everyone has consented.
            </div>
            <div className="mission-checklist">
              <label>
                <input
                  type="checkbox"
                  checked={missionState.debriefPermissionConfirmed}
                  onChange={(event) => updateMissionFlag("debriefPermissionConfirmed", event.target.checked)}
                />
                <span>Permission or consent confirmed</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.debriefCaptured}
                  onChange={(event) => updateMissionFlag("debriefCaptured", event.target.checked)}
                />
                <span>Voice memo transcript, rough notes, or summary captured</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.debriefAnalyzed}
                  onChange={(event) => updateMissionFlag("debriefAnalyzed", event.target.checked)}
                />
                <span>Debrief analyzed into study targets</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missionState.nextStudyPlanReady}
                  onChange={(event) => updateMissionFlag("nextStudyPlanReady", event.target.checked)}
                />
                <span>Next-round study plan ready</span>
              </label>
            </div>
            <label className="debrief-text">
              Paste transcript or notes
              <textarea
                value={missionState.debriefText}
                onChange={(event) =>
                  setMissionState((previous) => ({ ...previous, debriefText: event.target.value }))
                }
                placeholder="Example: They asked how I would build alignment before dashboards. I mentioned stakeholder cadence but forgot to connect it to ministry identity..."
              />
            </label>
            <div className="mission-actions">
              <button className="primary-action" type="button" onClick={analyzeDebrief}>
                Process Debrief
              </button>
              <button type="button" onClick={() => setView("deck")}>
                Study Cards
              </button>
            </div>
            <button className="reset-missions-button" type="button" onClick={resetMissions}>
              Reset Prep
            </button>
            <output className="debrief-status">{missionState.debriefStatus}</output>
            {missionState.debriefSummary.length ? (
              <div className="debrief-output">
                <section>
                  <h3>After-action readout</h3>
                  <ul>
                    {missionState.debriefSummary.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Study targets</h3>
                  <ul>
                    {missionState.debriefStudyTargets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Next updates</h3>
                  <ul>
                    {missionState.debriefFollowUps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : null}
          </article>
        </div>
      </section>
    );
  }

  function renderMetadata() {
    return (
      <section className="metadata-view">
        <div className="view-header">
          <div>
            <p className="kicker">SOURCE METADATA</p>
            <h2>How this prep set was shaped</h2>
          </div>
          <button type="button" onClick={() => setView("deck")}>
            Back to Deck
          </button>
        </div>

        <article className="metadata-status">
          <div className="source-paper-top">
            <span>CONNECTOR STATUS</span>
            <span>PUBLIC SOURCES</span>
          </div>
          <h3>Public profile text was sourced; scraping was not performed</h3>
          <p>
            Person names came from supplied interview evidence. Role/headline claims now use explicit public profile/search source cards where available. Tenure, profile photos, and background images are not pulled from LinkedIn unless supplied by the user or a future approved API.
          </p>
        </article>

        <div className="metadata-sections">
          {PROVENANCE_SECTIONS.map((section) => (
            <article className="metadata-card" key={section.id}>
              <p className="kicker">{section.label}</p>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className="metadata-card ledger-card">
          <p className="kicker">PERSON SOURCE LEDGER</p>
          <h3>Name, role, and profile status by file</h3>
          <div className="ledger-list">
            {people.map((person) => {
              const personSources = person.evidenceIds
                .map((id) => sourcesById.get(id))
                .filter((source): source is SourceEvidence => Boolean(source));
              const topSources = personSources.slice(0, 3).map((source) => sourceTypeLabel(source.type));
              return (
                <section className="ledger-row" key={person.id}>
                  <div className="ledger-id">
                    <span>{person.initials}</span>
                    <strong>{person.name}</strong>
                  </div>
                  <dl>
                    <div>
                      <dt>Role shown</dt>
                      <dd>{displayRole(person)}</dd>
                    </div>
                    <div>
                      <dt>Role source</dt>
                      <dd>{roleConfidence(person)}</dd>
                    </div>
                    <div>
                      <dt>Profile lookup</dt>
                      <dd>{profileLookupSummary(person)}</dd>
                    </div>
                    <div>
                      <dt>Evidence</dt>
                      <dd>
                        {personSources.length} record{personSources.length === 1 ? "" : "s"}
                        {topSources.length ? `: ${Array.from(new Set(topSources)).join(", ")}` : ""}
                      </dd>
                    </div>
                  </dl>
                  <SourceChips chips={sourceChips(person.evidenceIds, sourcesById, person)} compact />
                </section>
              );
            })}
          </div>
        </article>
      </section>
    );
  }

  function renderImport() {
    return (
      <section className="import-view">
        <div className="view-header">
          <div>
            <p className="kicker">INTEL INTAKE</p>
            <h2>Import Interview Intel</h2>
          </div>
          <button type="button" onClick={() => setView("deck")}>
            Back to Deck
          </button>
        </div>

        <div className="import-panel">
          <label>
            Paste email invite, calendar guest list, or job description
            <textarea
              value={intelText}
              onChange={(event) => setIntelText(event.target.value)}
              placeholder="Example: Stephanie Gross <stephanie.gross1@ascension.org> invited Colene Daniel and Mary Clabeaux..."
            />
          </label>

          <label>
            Attach profile text to
            <select value={profileTargetId} onChange={(event) => setProfileTargetId(event.target.value)}>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Paste LinkedIn/profile headline or about text
            <textarea
              value={profileText}
              onChange={(event) => setProfileText(event.target.value)}
              placeholder="Paste public profile text you have permission to use. Example: Headline: Community health strategy leader..."
            />
          </label>

          <div className="profile-media-import">
            <label>
              Attach profile photo
              <input
                type="file"
                accept="image/*"
                onChange={(event) => readImageInput(event, setProfilePhotoDataUrl, setImportResult, "Profile photo")}
              />
              <button
                type="button"
                onClick={() => readClipboardImage(setProfilePhotoDataUrl, setImportResult, "Profile photo")}
              >
                Paste Profile Photo
              </button>
            </label>
            <label>
              Attach profile background image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  readImageInput(event, setProfileBackdropDataUrl, setImportResult, "Profile background image")
                }
              />
              <button
                type="button"
                onClick={() =>
                  readClipboardImage(setProfileBackdropDataUrl, setImportResult, "Profile background image")
                }
              >
                Paste Background Image
              </button>
            </label>
          </div>

          {profilePhotoDataUrl || profileBackdropDataUrl ? (
            <div className="profile-media-preview" aria-label="Profile media preview">
              {profilePhotoDataUrl ? <img src={profilePhotoDataUrl} alt="Staged user-provided profile" /> : null}
              {profileBackdropDataUrl ? <img src={profileBackdropDataUrl} alt="Staged user-provided profile background" /> : null}
            </div>
          ) : null}

          <label>
            What the profile background gives you
            <textarea
              className="compact-textarea"
              value={profileBackgroundText}
              onChange={(event) => setProfileBackgroundText(event.target.value)}
              placeholder="Example: Banner emphasizes community partnerships, public health, equity, or operations. Keep this sourced to what you can see."
            />
          </label>

          <p className="helper-text">
            Paste public profile text or upload screenshots/photos you have permission to use. This demo does not scrape LinkedIn or use your LinkedIn login.
          </p>

          <div className="import-actions">
            <button className="primary-action" type="button" onClick={parseIntel}>
              Parse Intel
            </button>
            <button type="button" onClick={resetDemoData}>
              Reset Demo Data
            </button>
          </div>

          <output className="parse-output">{importResult}</output>
        </div>

        <div className="imported-strip">
          <p className="kicker">LOCAL PEOPLE</p>
          <div className="imported-list">
            {people.map((person) => (
              <span key={person.id}>
                {person.initials} {person.imported ? "IMPORTED" : "SEED"}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="app-shell clinical-shell" data-view={view}>
      <div className="scanline-overlay" aria-hidden="true" />
      <div className="liquid-video-backdrop" aria-hidden="true">
        <video
          autoPlay
          disablePictureInPicture
          loop
          muted
          controls={false}
          ref={liquidVideoRef}
          onCanPlay={(event) => {
            if (event.currentTarget.paused) {
              void event.currentTarget.play().catch(() => undefined);
            }
          }}
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            void event.currentTarget.play().catch(() => undefined);
          }}
          onLoadedMetadata={playLiquidVideo}
          playsInline
          preload="auto"
          src="/assets/glass-ui/dossier-liquid-glass-texture.mp4"
        />
      </div>
      <header className="app-header">
        <div>
          <p className="kicker">INTERVIEW PREP</p>
          <h1>Prep Room</h1>
        </div>
        <div className="system-light" aria-label="Prep status">
          Ready
        </div>
      </header>

      {renderCaseNav()}

      {view === "deck" ? renderDeck() : null}
      {view === "missions" ? renderMissions() : null}
      {view === "roster" ? renderRoster() : null}
      {view === "import" ? renderImport() : null}
      {view === "briefing" ? renderBriefing() : null}
      {view === "metadata" ? renderMetadata() : null}

      <EvidenceDrawer isOpen={isEvidenceOpen} onClose={() => setIsEvidenceOpen(false)} person={currentPerson} sources={currentSources} />
    </main>
  );
}

export default App;
