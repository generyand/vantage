import { useState, useMemo } from 'react';
import { Submission, SubmissionFilters } from '@/types/submissions';

// Mock data for development - replace with actual API calls
const mockSubmissions: Submission[] = [
  {
    id: '1',
    barangayName: 'Barangay San Antonio',
    overallProgress: 85,
    currentStatus: 'Submitted for Review',
    assignedAssessors: [
      { id: '1', name: 'Juan Dela Cruz', email: 'juan@example.com' },
      { id: '2', name: 'Maria Santos', email: 'maria@example.com' }
    ],
    lastUpdated: '2024-01-15T10:30:00Z',
    governanceArea: 'Financial Administration'
  },
  {
    id: '2',
    barangayName: 'Barangay San Jose',
    overallProgress: 45,
    currentStatus: 'In Progress',
    assignedAssessors: [
      { id: '3', name: 'Pedro Reyes', email: 'pedro@example.com' }
    ],
    lastUpdated: '2024-01-14T15:45:00Z',
    governanceArea: 'Disaster Preparedness'
  },
  {
    id: '3',
    barangayName: 'Barangay San Miguel',
    overallProgress: 100,
    currentStatus: 'Finalized',
    assignedAssessors: [
      { id: '1', name: 'Juan Dela Cruz', email: 'juan@example.com' }
    ],
    lastUpdated: '2024-01-13T09:15:00Z',
    governanceArea: 'Safety, Peace and Order'
  },
  {
    id: '4',
    barangayName: 'Barangay San Pedro',
    overallProgress: 0,
    currentStatus: 'Not Started',
    assignedAssessors: [],
    lastUpdated: '2024-01-12T14:20:00Z',
    governanceArea: 'Social Protection'
  },
  {
    id: '5',
    barangayName: 'Barangay San Isidro',
    overallProgress: 70,
    currentStatus: 'Needs Rework',
    assignedAssessors: [
      { id: '2', name: 'Maria Santos', email: 'maria@example.com' }
    ],
    lastUpdated: '2024-01-11T11:30:00Z',
    governanceArea: 'Environmental Management'
  },
  {
    id: '6',
    barangayName: 'Barangay San Nicolas',
    overallProgress: 95,
    currentStatus: 'Validated',
    assignedAssessors: [
      { id: '3', name: 'Pedro Reyes', email: 'pedro@example.com' }
    ],
    lastUpdated: '2024-01-10T16:45:00Z',
    governanceArea: 'Financial Administration'
  }
];

const governanceAreas = [
  'Financial Administration',
  'Disaster Preparedness',
  'Safety, Peace and Order',
  'Social Protection',
  'Environmental Management',
  'Business-Friendliness and Competitiveness',
  'Tourism, Heritage, Culture and the Arts',
  'Youth Development'
];

const assessors = [
  { id: '1', name: 'Juan Dela Cruz', email: 'juan@example.com' },
  { id: '2', name: 'Maria Santos', email: 'maria@example.com' },
  { id: '3', name: 'Pedro Reyes', email: 'pedro@example.com' }
];

export function useSubmissions() {
  const [filters, setFilters] = useState<SubmissionFilters>({
    search: '',
    status: [],
    governanceArea: [],
    assessor: []
  });

  const [loading] = useState(false);

  const filteredSubmissions = useMemo(() => {
    let filtered = [...mockSubmissions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(submission =>
        submission.barangayName.toLowerCase().includes(searchLower) ||
        submission.assignedAssessors.some(assessor =>
          assessor.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(submission =>
        filters.status.includes(submission.currentStatus)
      );
    }

    // Governance area filter
    if (filters.governanceArea.length > 0) {
      filtered = filtered.filter(submission =>
        filters.governanceArea.includes(submission.governanceArea)
      );
    }

    // Assessor filter
    if (filters.assessor.length > 0) {
      filtered = filtered.filter(submission =>
        submission.assignedAssessors.some(assessor =>
          filters.assessor.includes(assessor.id)
        )
      );
    }

    return filtered;
  }, [filters]);

  const updateFilters = (newFilters: Partial<SubmissionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: [],
      governanceArea: [],
      assessor: []
    });
  };

  return {
    submissions: filteredSubmissions,
    filters,
    updateFilters,
    resetFilters,
    loading,
    governanceAreas,
    assessors
  };
} 