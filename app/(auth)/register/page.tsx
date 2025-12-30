import { Suspense } from "react";
import RegisterForm from "@/components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="flex justify-center">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
