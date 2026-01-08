import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type SubmitButtonsProps = {
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
};

export default function SubmitButtons({
  submitButtonTitle = "Enregistrer les modifications",
  cancelButtonTitle = "Annuler",
}: SubmitButtonsProps) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col md:flex-row justify-end gap-3">
      <Button variant="outline" disabled={pending} className="cursor-pointer">
        {cancelButtonTitle}
      </Button>
      <Button disabled={pending} className="cursor-pointer">
        {pending && <Spinner />}
        {submitButtonTitle}
      </Button>
    </div>
  );
}
