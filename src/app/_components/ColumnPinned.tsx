"use client";

import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

export function ColumnPinned<T>({ table }: Props<T>) {
  return (
    <div className="column-controller__inner pinned">
      <p>カラムのピン留め</p>
      <ul>
        {table
          .getAllColumns()
          .filter((column) => column.columnDef.enablePinning !== false)
          .map((column) => (
            <li key={column.id}>
              <span>{(column.columnDef.meta as string) || column.id}</span>
              <ul>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={column.getIsPinned() === "left"}
                      onChange={() =>
                        column.pin(
                          column.getIsPinned() === "left" ? false : "left"
                        )
                      }
                    />
                    Left
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={column.getIsPinned() === "right"}
                      onChange={() =>
                        column.pin(
                          column.getIsPinned() === "right" ? false : "right"
                        )
                      }
                    />
                    Right
                  </label>
                </li>
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
}
