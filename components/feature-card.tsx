import { Card, CardContent } from "./ui/card";
import type { FeatureCard as FeatureCardInterface } from "@/types/feature-card";

type FeatureCardProps = FeatureCardInterface;

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
