import SignupForm from "@/components/auth/SignupForm";
import React from "react";

export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
}
