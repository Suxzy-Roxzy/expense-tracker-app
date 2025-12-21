"use client";

import { useId } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { OTPInput, SlotProps } from "input-otp";
// import { Slot } from "radix-ui";
// import {label} from "@components/ui/label"

interface InputOTPSpacedTypes {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

const InputOTPSpaced = ({
  value = "",
  disabled = false,
  maxLength = 6,
  onChange,
  className,
  label,
}: InputOTPSpacedTypes) => {
  const id = useId();

  return (
    <div className={cn("*:not-first:mt-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <OTPInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        containerClassName="flex items-center gap-3 has-disabled:opacity-50"
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md font-medium shadow-xs transition-[color, box-shadow]",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

export default InputOTPSpaced;
