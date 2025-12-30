import { Suspense } from "react";
import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex justify-center">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
