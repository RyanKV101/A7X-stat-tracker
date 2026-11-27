"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Buttons, shown bottom-right. */
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/**
 * Built on the native <dialog>: focus trap, Escape to close and the inert
 * background come from the browser. Clicking the backdrop also closes it.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  className,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "border-border bg-surface text-foreground shadow-raised m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border p-0",
        "backdrop:bg-black/75 backdrop:backdrop-blur-sm",
        "open:animate-[modal-in_200ms_var(--ease-out-soft)]",
        className,
      )}
    >
      <div className="divider-ornament" />
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} className="text-h3 text-foreground">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-muted text-sm">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-subtle hover:bg-surface-raised hover:text-foreground -mt-1 -mr-2 cursor-pointer rounded-sm p-2 transition-colors"
        >
          <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
      {children && <div className="text-muted p-6 text-sm">{children}</div>}
      {footer && (
        <div className="border-border flex justify-end gap-3 border-t px-6 py-4">{footer}</div>
      )}
    </dialog>
  );
}
