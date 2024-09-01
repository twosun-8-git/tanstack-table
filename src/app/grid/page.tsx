"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { columns } from "./_columns";
import { rows } from "@/app/_rows";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <div className="grid-table">
        <div className="grid-header-group">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="grid-header-row">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="grid-header-cell"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? "sortable" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="sort-indicator">
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="resizer"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="grid-body">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="grid-row">
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className="grid-cell"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
