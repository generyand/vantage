/**
 * Types for dynamic form schema
 */

export interface FormField {
  type: "string" | "number" | "boolean";
  title?: string;
  description?: string;
  required?: boolean;
  enum?: string[];
}

export interface FormSchema {
  properties: Record<string, FormField>;
}
