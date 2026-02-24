

export interface ProjectListsApiResponse {
  status: boolean;
  message: string;
  data: {
    items: ProjectListItem[];
    paginationInfo: PaginationInfo;
  };
}

export interface ProjectListItem {
  systemForms: SystemForms;
  _id: string;
  participantName: string;
  organization: string;
  projectTitle: string;
  kickOffDate: string; // ISO date string
  stakeholders: Stakeholder[];
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface SystemForms {
  vision: string;
  pastGoodOldDays: string;
  obstacleProblem: string;
  riskOfInaction: string;
  solutionIdea: string;
}

export interface Stakeholder {
  name: string;
  roleType: "OPINION_LEADER" | "FOLLOWER";
  painPoint: string;
  benefits: string;
  triggerEvaluation: "HIGH_POINTS" | "LOW_POINTS";
  objectionsConcerns: string;
  objectionHandling: string;
  measures: Measure[];
}

export interface Measure {
  category: "COMMUNICATION" | "INVOLVEMENT" | "RECOGNITION";
  type: "PRESENTATION" | "WORKSHOP" | "NEWSLETTER";
  name: string;
  startWeeks: number;
  timing: "PRE" | "POST";
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

