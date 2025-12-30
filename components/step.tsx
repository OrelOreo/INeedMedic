import type { Step as StepInterface } from "@/types/step";

type StepProps = StepInterface;

export default function Step({ number, title }: StepProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <p className="font-medium">{title}</p>
    </div>
  );
}
