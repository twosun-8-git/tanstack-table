"use client";

import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

export function ColumnVisibility<T>({ table }: Props<T>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  return (
    <div className="column-controller__inner visibility">
      <p>カラムの表示</p>
      <ul>
        <li>
          <label>
            <input
              type="checkbox"
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />
            All
          </label>
        </li>
        {columns.map((column) => (
          <li key={column.id}>
            <label>
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              {(column.columnDef.meta as { label?: string })?.label ||
                column.id}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
