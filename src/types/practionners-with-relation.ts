import { searchPractionnersByLocationAndSpeciality } from "@/lib/server-actions/index";

export type PractionnersWithRelation = Awaited<
  ReturnType<typeof searchPractionnersByLocationAndSpeciality>
>[0];
