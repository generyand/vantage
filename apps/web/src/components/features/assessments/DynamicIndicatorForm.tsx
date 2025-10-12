"use client";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface DynamicIndicatorFormProps {
  formSchema: any; // We'll type this properly once we have the actual schema structure
  initialData?: any;
  onSubmit?: (data: any) => void;
  onChange?: (data: any) => void;
  isDisabled?: boolean;
}

export function DynamicIndicatorForm({
  formSchema,
  initialData,
  onSubmit,
  onChange,
  isDisabled = false,
}: DynamicIndicatorFormProps) {
  // Create a dynamic Zod schema based on the form schema
  const zodSchema = React.useMemo(() => {
    const schemaObj: Record<string, any> = {};

    // Convert form schema fields to Zod validations
    Object.entries(formSchema.properties || {}).forEach(
      ([key, field]: [string, any]) => {
        switch (field.type) {
          case "string":
            schemaObj[key] = field.required
              ? z.string().min(1, { message: "This field is required" })
              : z.string().optional();
            break;
          case "number":
            schemaObj[key] = field.required
              ? z.number()
              : z.number().optional();
            break;
          case "boolean":
            schemaObj[key] = field.required
              ? z.boolean()
              : z.boolean().optional();
            break;
          // Add more field types as needed
        }
      }
    );

    return z.object(schemaObj);
  }, [formSchema]);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData || {},
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    form.reset(initialData || {});
  }, [form, initialData]);

  // Handle form changes
  React.useEffect(() => {
    if (onChange) {
      const subscription = form.watch((value) => {
        onChange(value);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  // Render form fields based on schema
  const renderField = (name: string, field: any) => {
    switch (field.type) {
      case "string":
        if (field.enum) {
          return (
            <div className="space-y-3 mt-4" key={name}>
              <Label className="text-sm font-semibold text-[var(--foreground)]">
                {field.title || name}
              </Label>
              <RadioGroup
                onValueChange={(value) => form.setValue(name, value)}
                defaultValue={form.getValues(name)}
                disabled={isDisabled}
                className="space-y-3"
              >
                {field.enum.map((option: string) => (
                  <div className="flex items-center space-x-2" key={option}>
                    <RadioGroupItem value={option} id={`${name}-${option}`} />
                    <Label
                      htmlFor={`${name}-${option}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        }
        return (
          <div className="space-y-3 mt-4" key={name}>
            <Label
              htmlFor={name}
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              {field.title || name}
            </Label>
            <Input
              {...form.register(name)}
              id={name}
              placeholder={field.description}
              disabled={isDisabled}
              className="p-3 border-[var(--border)] focus:border-[var(--cityscape-yellow)] focus:ring-1 focus:ring-[var(--cityscape-yellow)] transition-colors duration-200"
            />
          </div>
        );
      // Add more field types as needed
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit || (() => {}))}
        className="space-y-6 bg-[var(--card)] p-6 rounded-lg border border-[var(--border)] shadow-sm"
      >
        {Object.entries(formSchema.properties || {}).map(
          ([name, field]: [string, any]) => renderField(name, field)
        )}
      </form>
    </Form>
  );
}
