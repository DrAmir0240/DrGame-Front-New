declare module "react-otp-input" {
  import type { CSSProperties, ReactNode } from "react";

  interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    numInputs?: number;
    separator?: ReactNode;
    renderSeparator?: (index: number) => ReactNode;
    renderInput?: (inputProps: Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> & { style?: CSSProperties }, index: number) => ReactNode;
    containerStyle?: CSSProperties | string;
    inputStyle?: CSSProperties | string;
    focusStyle?: CSSProperties | string;
    isDisabled?: boolean;
    disabledStyle?: CSSProperties | string;
    shouldAutoFocus?: boolean;
    placeholder?: string;
    inputType?: "number" | "text" | "tel";
    otpType?: "number" | "text" | "tel";
    skipDefaultStyles?: boolean;
  }

  export default function OtpInput(props: OtpInputProps): JSX.Element;
}
