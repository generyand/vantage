"use client";

import { useState } from "react";

interface FormData {
  situationalAwareness: number;
  riskAssessment: number;
  communicationClarity: number;
  decisionMaking: number;
  leadership: number;
  teamwork: number;
  adaptability: number;
  ethics: number;
  conflictResolution: number;
  notes: string;
}

interface PeaceAndOrderFormProps {
  onSubmit?: (data: FormData) => void;
  initialData?: Partial<FormData>;
  isLoading?: boolean;
}

export default function PeaceAndOrderForm({
  onSubmit,
  initialData,
  isLoading = false,
}: PeaceAndOrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    situationalAwareness: initialData?.situationalAwareness || 1,
    riskAssessment: initialData?.riskAssessment || 1,
    communicationClarity: initialData?.communicationClarity || 1,
    decisionMaking: initialData?.decisionMaking || 1,
    leadership: initialData?.leadership || 1,
    teamwork: initialData?.teamwork || 1,
    adaptability: initialData?.adaptability || 1,
    ethics: initialData?.ethics || 1,
    conflictResolution: initialData?.conflictResolution || 1,
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleRatingChange = (field: keyof FormData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const RatingScale = ({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    description: string;
  }) => (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">Poor</span>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
              value === rating
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
            }`}
          >
            {rating}
          </button>
        ))}
        <span className="text-xs text-gray-500">Excellent</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Peace and Order Assessment
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Evaluate leadership performance in maintaining peace and order during
          critical situations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <RatingScale
            label="Situational Awareness"
            value={formData.situationalAwareness}
            onChange={(value) =>
              handleRatingChange("situationalAwareness", value)
            }
            description="Ability to understand and assess the current situation quickly and accurately"
          />

          <RatingScale
            label="Risk Assessment"
            value={formData.riskAssessment}
            onChange={(value) => handleRatingChange("riskAssessment", value)}
            description="Capacity to identify potential threats and evaluate their severity"
          />

          <RatingScale
            label="Communication Clarity"
            value={formData.communicationClarity}
            onChange={(value) =>
              handleRatingChange("communicationClarity", value)
            }
            description="Effectiveness in communicating instructions and information under pressure"
          />

          <RatingScale
            label="Decision Making"
            value={formData.decisionMaking}
            onChange={(value) => handleRatingChange("decisionMaking", value)}
            description="Quality and speed of critical decisions made during tense situations"
          />

          <RatingScale
            label="Conflict Resolution"
            value={formData.conflictResolution}
            onChange={(value) =>
              handleRatingChange("conflictResolution", value)
            }
            description="Ability to de-escalate tensions and find peaceful solutions"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes
          </label>
          <div className="mt-1">
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Any additional observations or comments about the assessment..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Overall Score:{" "}
            <span className="font-medium">
              {Math.round(
                (Object.values(formData)
                  .slice(0, 5)
                  .reduce((a, b) => a + b, 0) /
                  5) *
                  20
              )}
              %
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Assessment...
              </>
            ) : (
              "Save Assessment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
