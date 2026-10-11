"use client";

import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage: string;
}

/** A submit button that shows a native confirmation dialog before letting the enclosing form submit. */
export function ConfirmSubmitButton({ confirmMessage, onClick, className, children, ...props }: Props) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
