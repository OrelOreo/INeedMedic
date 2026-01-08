import { getAvailabilities } from "@/lib/actions";

export type AvailabilitiesWithRelation = Awaited<
  ReturnType<typeof getAvailabilities>
>[0];
