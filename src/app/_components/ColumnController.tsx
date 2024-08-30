import { Table, ColumnResizeMode } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { ColumnVisibility } from "./ColumnVisibility";
import { ColumnFilter } from "./ColumnFilter";
import { ColumnResizeAction } from "./ColumnResizeAction";

type Props = {
  table: Table<Student>;
  columnResizeMode: ColumnResizeMode;
  changeColumnResizeMode: (mode: ColumnResizeMode) => void;
};
export function ColumnController({
  table,
  columnResizeMode,
  changeColumnResizeMode,
}: Props) {
  return (
    <div className="column-controller">
      <ColumnVisibility table={table} />
      <ColumnFilter table={table} />
      <ColumnResizeAction
        columnResizeMode={columnResizeMode}
        changeColumnResizeMode={changeColumnResizeMode}
      />
    </div>
  );
}
