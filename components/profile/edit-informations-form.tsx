"use client";

import { FormInfosState, updateUserProfile } from "@/lib/actions";
import { User, Mail, AlertCircleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { Alert, AlertTitle } from "../ui/alert";
import { Prisma } from "@prisma/client";

import SubmitButtons from "../shared/submit-buttons";

type UserProfileProps = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
  };
}>;

export default function EditProfileForm({ user }: { user: UserProfileProps }) {
  const initialState: FormInfosState = {
    id: user.id,
    message: null,
    errors: {},
  };
  const updateUserProfileWithId = async (
    prevState: FormInfosState,
    formData: FormData
  ) => {
    return updateUserProfile(prevState, formData);
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
            <User className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="name">Nom complet</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="name"
              name="name"
              placeholder="Doe"
              defaultValue={user.name}
              aria-describedby="name-error"
            />
          </div>
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p
                id="name-error"
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
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              defaultValue={user.email}
              aria-describedby="email-error"
            />
          </div>
          {state.errors?.email &&
            state.errors.email.map((error: string) => (
              <p
                id="email-error"
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
