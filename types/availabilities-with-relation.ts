import { getAvailabilities } from "@/lib/server-actions/index";

export type AvailabilitiesWithRelation = Awaited<
  ReturnType<typeof getAvailabilities>
>[0];
