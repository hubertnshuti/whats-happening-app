import { forwardRef, type InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-fg-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-12 w-full rounded-xl border bg-surface text-base text-fg",
              "placeholder:text-fg-muted transition",
              "focus:outline-none focus:ring-4 focus:ring-brand/15",
              error
                ? "border-danger focus:border-danger"
                : "border-line focus:border-brand",
              leftIcon ? "pl-11" : "pl-4",
              rightIcon ? "pr-11" : "pr-4",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-sm font-medium text-danger">{error}</p>
        ) : hint ? (
          <p className="text-sm text-fg-tertiary">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
