import { Card } from "@/components/ui/card";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-svh flex justify-center items-center overflow-hidden">
      <Card className="p-4 shadow-lg w-[800px]">
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
