"use client";

import { Table } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";

import { ColumnVisibility } from "./ColumnVisibility";
import { ColumnFiltering } from "./ColumnFiltering";
import { ColumnPinning } from "./ColumnPinning";

type Props = {
  table: Table<Student>;
};

export function ColumnController({ table }: Props) {
  const { enableHiding, enableColumnFilters, enableColumnPinning } =
    table.options;

  return (
    <div className="column-controller">
      <div className="column-controller__group">
        {enableHiding && <ColumnVisibility table={table} />}
        {enableColumnFilters && <ColumnFiltering table={table} />}
      </div>
      <div className="column-controller__group">
        {enableColumnPinning && <ColumnPinning table={table} />}
      </div>
    </div>
  );
}
