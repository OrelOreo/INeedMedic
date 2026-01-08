"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertTitle } from "../ui/alert";
import { useActionState } from "react";
import {
  updateUserPassword,
  FormPasswordState,
} from "@/lib/server-actions/index";
import { Lock, AlertCircle as AlertCircleIcon } from "lucide-react";
import SubmitButtons from "../shared/submit-buttons";

export default function EditPasswordsForm() {
  const initialState: FormPasswordState = {
    message: null,
    errors: {},
  };
  const updateUserProfileWithId = async (
    prevState: FormPasswordState | undefined,
    formData: FormData
  ) => {
    return updateUserPassword(prevState ?? initialState, formData);
  };
  const [state, formAction] = useActionState(
    updateUserProfileWithId,
    initialState
  );

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 space-y-2 gap-6">
        <div className="space-y-2">
          <div className="flex gap-x-1 items-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              aria-describedby="currentPassword-error"
            />
          </div>
          {state.errors?.currentPassword &&
            state.errors.currentPassword.map((error: string) => (
              <p
                id="currentPassword-error"
                aria-live="polite"
                aria-atomic="true"
                className="mt-2 text-sm text-red-500"
                key={error}
              >
                {error}
              </p>
            ))}
        </div>

        <div className="space-y-2">
          <div className="flex gap-x-1 items-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              minLength={8}
              aria-describedby="newPassword-error"
            />
          </div>
          {state.errors?.newPassword &&
            state.errors.newPassword.map((error: string) => (
              <p
                id="newPassword-error"
                aria-live="polite"
                aria-atomic="true"
                className="mt-2 text-sm text-red-500"
                key={error}
              >
                {error}
              </p>
            ))}
        </div>

        <div className="space-y-2">
          <div className="flex gap-x-1 items-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              aria-describedby="confirmPassword-error"
            />
          </div>
          {state.errors?.confirmPassword &&
            state.errors.confirmPassword.map((error: string) => (
              <p
                id="confirmPassword-error"
                aria-live="polite"
                aria-atomic="true"
                className="mt-2 text-sm text-red-500"
                key={error}
              >
                {error}
              </p>
            ))}
        </div>
      </div>

      {state.errors?.globalErrors && state.message && (
        <Alert variant="destructive" className="my-6">
          <AlertCircleIcon />
          <AlertTitle>{state.message}</AlertTitle>
        </Alert>
      )}

      {Object.keys(state.errors || {}).length === 0 && state.message && (
        <Alert variant="default" className="my-6">
          <AlertCircleIcon />
          <AlertTitle>{state.message}</AlertTitle>
        </Alert>
      )}

      <Separator className="my-6" />

      <SubmitButtons />
    </form>
  );
}
