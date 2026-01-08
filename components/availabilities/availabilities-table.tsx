import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DayOfWeek } from "@prisma/client";
import AvailabilitiesTableRow from "./availabilities-table-row";
import { getAvailabilities } from "@/lib/actions";

const days: { key: DayOfWeek; label: string }[] = [
  { key: "MONDAY", label: "Lundi" },
  { key: "TUESDAY", label: "Mardi" },
  { key: "WEDNESDAY", label: "Mercredi" },
  { key: "THURSDAY", label: "Jeudi" },
  { key: "FRIDAY", label: "Vendredi" },
  { key: "SATURDAY", label: "Samedi" },
  { key: "SUNDAY", label: "Dimanche" },
];

export default async function Availabilities() {
  const availabilities = await getAvailabilities();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-37.5">Jour</TableHead>
            <TableHead>Créneaux horaires</TableHead>
            <TableHead className="text-right w-37.5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map(({ key, label }) => (
            <AvailabilitiesTableRow
              key={key}
              dayKey={key}
              dayLabel={label}
              availabilities={availabilities}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
