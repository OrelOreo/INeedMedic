import LoginForm from "@/components/login-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
