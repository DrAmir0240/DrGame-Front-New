"use client";

import { useState } from "react";
import ReactOtpInput from "react-otp-input";
import type { CSSProperties } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  error?: string;
}

export default function OtpInput({ value, onChange, numInputs = 5, error }: OtpInputProps) {
  const [focusIdx, setFocusIdx] = useState(-1);
  const isComplete = value.length === numInputs && !error;

  function getStyle(idx: number): CSSProperties {
    const isFocused = focusIdx === idx;

    const borderColor = error
      ? "var(--color-error-500)"
      : isComplete
        ? "var(--color-success-500)"
        : isFocused
          ? "var(--color-secondary-600)"
          : "var(--color-neutral-300)";

    return {
      width: "100%",
      height: "100%",
      maxWidth: 50,
      minHeight: 50,
      margin: "0 5px",
      fontSize: 20,
      fontWeight: 600,
      borderRadius: 15,
      border: `2px solid ${borderColor}`,
      textAlign: "center",
      outline: "none",
      ...(isFocused && {
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
        backgroundColor: "var(--color-secondary-50)",
        transform: "scale(1.05)",
      }),
      transition: "all 0.2s ease-in-out",
    };
  }

  return (
    <div dir="ltr" className="mt-5 w-full mx-auto">
      <ReactOtpInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        shouldAutoFocus
        inputType="tel"
        otpType="number"
        skipDefaultStyles
        containerStyle={{ display: "flex", justifyContent: "center", direction: "ltr" }}
        renderInput={(inputProps, idx) => (
          <input
            {...inputProps}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            onFocus={(e) => { setFocusIdx(idx); inputProps.onFocus?.(e); }}
            onBlur={(e) => { setFocusIdx(-1); inputProps.onBlur?.(e); }}
            style={getStyle(idx)}
          />
        )}
      />
      {error && <p className="text-xs text-error-500 text-center mt-2">{error}</p>}
    </div>
  );
}
