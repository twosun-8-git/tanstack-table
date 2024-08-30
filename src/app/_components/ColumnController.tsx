import { Table, ColumnResizeMode } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { ColumnVisibility } from "./ColumnVisibility";
import { ColumnFilter } from "./ColumnFilter";
import { ColumnResizeSetting } from "./ColumnResizeSetting";

type Props = {
  table: Table<Student>;
  mode: ColumnResizeMode;
  changeMode: (value: ColumnResizeMode) => void;
};
export function ColumnController({ table, mode, changeMode }: Props) {
  return (
    <div className="column-controller">
      <ColumnVisibility table={table} />
      <ColumnFilter table={table} />
      <ColumnResizeSetting mode={mode} changeMode={changeMode} />
    </div>
  );
}
