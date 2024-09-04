"use client";

import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

export function ColumnVisibility<T>({ table }: Props<T>) {
  const columns = table.getAllColumns();

  // enableHiding: true または未定義のカラムのみ
  const enableHidingColumns = columns.filter(
    (column) => column.columnDef.enableHiding !== false
  );

  // enableHiding: false カラムの存在チェック（ Allの表示制御 ）
  const hasNonEnableHidingColumn = columns.some(
    (column) => column.columnDef.enableHiding === false
  );

  return (
    <div className="column-controller__inner visibility">
      <p>カラムの表示</p>
      <ul>
        {!hasNonEnableHidingColumn && (
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
        )}
        {enableHidingColumns.map((column) => (
          <li key={column.id}>
            <label>
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              {(column.columnDef.meta as string) || column.id}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
