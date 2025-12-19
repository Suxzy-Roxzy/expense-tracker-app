import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

const SubmissionButton = ({
  isSubmitting,
  label,
  icon,
  className,
}: {
  isSubmitting: boolean;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <LoaderCircleIcon className="animate-spin size-4" />
      ) : null}
      {isSubmitting ? (
        "submitting..."
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </Button>
  );
};

export default SubmissionButton;
