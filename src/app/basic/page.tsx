"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { columns } from "./_columns";
import { rows } from "@/app/_rows";

export default function Page() {
  const table = useReactTable<Student>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main>
      <div className="current">
        <span>basic</span>
      </div>
      <div className="grid">
        <div className="grid__header">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="grid__row">
              <div className="grid__row-content">
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
            </div>
          ))}
        </div>
        <div className="grid__body">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="grid__row">
              <div className="grid__row-content">
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
            </div>
          ))}
        </div>
        <div className="grid__footer">
          {table.getFooterGroups().map((footerGroup) => (
            <div key={footerGroup.id} className="grid__row">
              <div className="grid__row-content">
                {footerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="grid__cell"
                    style={{ width: header.getSize() }}
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
