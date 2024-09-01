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
    <main>
      <div className="grid">
        <div className="grid__header">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="grid__row">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="grid__cell"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="grid__body">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="grid__row">
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className="grid__cell"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="grid__footer">
          {table.getFooterGroups().map((footerGroup) => (
            <div key={footerGroup.id} className="grid__row">
              {footerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="grid__cell"
                  style={{ width: header.column.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
