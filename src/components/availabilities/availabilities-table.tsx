import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { days } from "@/lib/utils";
import AvailabilitiesTableRow from "./availabilities-table-row";
import { getAvailabilities } from "@/lib/server-actions/index";

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
