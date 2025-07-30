export interface Submission {
  id: string;
  barangayName: string;
  overallProgress: number;
  currentStatus: SubmissionStatus;
  assignedAssessors: Assessor[];
  lastUpdated: string;
  governanceArea: string;
}

export type SubmissionStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Submitted for Review'
  | 'Needs Rework'
  | 'Validated'
  | 'Finalized';

export interface Assessor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SubmissionFilters {
  search: string;
  status: SubmissionStatus[];
  governanceArea: string[];
  assessor: string[];
}

export interface SubmissionTableData {
  data: Submission[];
  total: number;
  loading: boolean;
} 