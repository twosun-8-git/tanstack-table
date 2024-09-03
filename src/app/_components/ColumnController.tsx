import { Table, ColumnResizeMode } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { ColumnVisibility } from "./ColumnVisibility";
import { ColumnFilter } from "./ColumnFilter";
import { ColumnPinned } from "./ColumnPinned";
import { ColumnResizeSetting } from "./ColumnResizeSetting";

type Props = {
  table: Table<Student>;
  mode: ColumnResizeMode;
  changeMode: (value: ColumnResizeMode) => void;
};
export function ColumnController({ table, mode, changeMode }: Props) {
  const {
    enableColumnFilters,
    enableColumnPinning,
    enableColumnResizing,
    enableHiding,
  } = table.options;

  return (
    <div className="column-controller">
      {enableHiding && <ColumnVisibility table={table} />}
      {enableColumnFilters && <ColumnFilter table={table} />}
      <ColumnPinned table={table} />
      <ColumnResizeSetting mode={mode} changeMode={changeMode} />
    </div>
  );
}
