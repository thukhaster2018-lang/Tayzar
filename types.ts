
export interface RedFlags {
  chest_pain: boolean;
  shortness_of_breath: boolean;
  neuro_deficit: boolean;
  high_fever_72h: boolean;
  severe_pain_8of10: boolean;
  gi_bleed_black_stool: boolean;
  dehydration: boolean;
  rbs_over_300_or_ketones: boolean;
  pregnancy_bleeding: boolean;
}

export enum TriageLevel {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}

export enum Status {
    New = "New",
    Claimed = "Claimed",
    Scheduled = "Scheduled",
    Completed = "Completed",
    FollowUp = "Follow-up"
}

export enum Sex {
    Male = "M",
    Female = "F",
    Other = "Other",
    Unknown = "Unknown"
}

export enum Comorbidity {
    DM = "DM",
    HTN = "HTN",
    IHD = "IHD",
    CKD = "CKD",
    Asthma = "Asthma",
    Liver = "Liver",
    Pregnancy = "Pregnancy",
    Other = "Other"
}

export interface PatientDataSchema {
  case_id: string;
  timestamp: string;
  channel: string;
  name: string;
  age: number | null;
  sex: Sex;
  phone: string;
  location_mm: string;
  location_en: string;
  chief_complaint: string;
  duration: string;
  key_symptoms: string[];
  comorbidities: Comorbidity[];
  meds_tried: string;
  red_flags: RedFlags;
  triage: TriageLevel;
  advice: string[];
  teleconsult_offer: "Yes" | "No";
  uploads_links: string[];
  staff_notes: string;
  status: Status;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  userText?: string;
  botResponse?: {
    patientMessage: string;
    jsonData: PatientDataSchema;
  };
}
