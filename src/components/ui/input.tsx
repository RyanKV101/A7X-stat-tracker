import type { ComponentPropsWithRef } from "react";
import { controlClasses, describedBy, Field } from "./field";

export type InputProps = ComponentPropsWithRef<"input"> & {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ id, label, hint, error, className, ...props }: InputProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses}
        {...props}
      />
    </Field>
  );
}
