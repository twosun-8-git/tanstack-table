import { Table } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { ColumnVisibility } from "./ColumnVisibility";
import { ColumnFilter } from "./ColumnFilter";

type Props = {
  table: Table<Student>;
};
export function ColumnController({ table }: Props) {
  return (
    <div className="column-controller">
      <ColumnVisibility table={table} />
      <ColumnFilter table={table} />
    </div>
  );
}
