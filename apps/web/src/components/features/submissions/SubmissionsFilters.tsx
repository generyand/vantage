'use client';

import * as React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubmissionFilters, SubmissionStatus } from '@/types/submissions';

interface SubmissionsFiltersProps {
  filters: SubmissionFilters;
  onFiltersChange: (filters: Partial<SubmissionFilters>) => void;
  onReset: () => void;
  governanceAreas: string[];
  assessors: Array<{ id: string; name: string; email: string }>;
}

export function SubmissionsFilters({
  filters,
  onFiltersChange,
  onReset,
  governanceAreas,
  assessors,
}: SubmissionsFiltersProps) {
  const statusOptions: SubmissionStatus[] = [
    'Not Started',
    'In Progress',
    'Submitted for Review',
    'Needs Rework',
    'Validated',
    'Finalized',
  ];

  const hasActiveFilters = 
    filters.search ||
    filters.status.length > 0 ||
    filters.governanceArea.length > 0 ||
    filters.assessor.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Barangay Name..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <Select
            value={filters.status[0] || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ 
                status: value === 'all' ? [] : [value as SubmissionStatus] 
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Governance Area Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Governance Area
          </label>
          <Select
            value={filters.governanceArea[0] || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ 
                governanceArea: value === 'all' ? [] : [value] 
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {governanceAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assessor Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Assessor
          </label>
          <Select
            value={filters.assessor[0] || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ 
                assessor: value === 'all' ? [] : [value] 
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Assessors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assessors</SelectItem>
              {assessors.map((assessor) => (
                <SelectItem key={assessor.id} value={assessor.id}>
                  {assessor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: &quot;{filters.search}&quot;
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.status.map((status) => (
              <div key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Status: {status}
                <button
                  onClick={() => onFiltersChange({ 
                    status: filters.status.filter(s => s !== status) 
                  })}
                  className="ml-1 hover:text-yellow-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {filters.governanceArea.map((area) => (
              <div key={area} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Area: {area}
                <button
                  onClick={() => onFiltersChange({ 
                    governanceArea: filters.governanceArea.filter(a => a !== area) 
                  })}
                  className="ml-1 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {filters.assessor.map((assessorId) => {
              const assessor = assessors.find(a => a.id === assessorId);
              return (
                <div key={assessorId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Assessor: {assessor?.name}
                  <button
                    onClick={() => onFiltersChange({ 
                      assessor: filters.assessor.filter(a => a !== assessorId) 
                    })}
                    className="ml-1 hover:text-purple-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 