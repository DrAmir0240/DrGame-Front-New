import type * as React from "react";
import type { OTPInputProps } from "input-otp";

export type InputOTPProps = OTPInputProps & {
  className?: string;
  containerClassName?: string;
};

export type InputOTPGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type InputOTPSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  index: number;
};

export type InputOTPSeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};
