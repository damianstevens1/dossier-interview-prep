export type SourceEvidence = {
  id: string;
  type: "email" | "calendar" | "linkedin" | "screenshot" | "manual" | "pre-read";
  title: string;
  date?: string;
  url?: string;
  excerpt: string;
  confidence: "verified" | "user-provided" | "inferred" | "pending";
};

export type ProfileStatus = "verified" | "user-provided" | "profile-pending";

export type PersonDossier = {
  id: string;
  name: string;
  initials: string;
  email?: string;
  roleFromEmail?: string;
  roleFromProfile?: string;
  profileStatus: ProfileStatus;
  functionInInterview: string;
  profilePhotoUrl?: string;
  profileBackdropUrl?: string;
  profileBackgroundSummary?: string;
  whyTheyMatter: string;
  likelyCaresAbout: string[];
  howToSpeakToThem: string[];
  smartQuestion: string;
  evidenceIds: string[];
  imported?: boolean;
};

export type FlashCard = {
  id: string;
  category: "Person File" | "Evidence" | "Strategy" | "Likely Question" | "Answer Angle";
  title: string;
  prompt: string;
  answer: string;
  personId?: string;
  evidenceIds: string[];
};

export type ParsedProfileIntel = {
  headline?: string;
  currentRole?: string;
  company?: string;
  keywords: string[];
  likelyPriorities: string[];
};
