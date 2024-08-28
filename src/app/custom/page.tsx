"use client";

import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  Row,
} from "@tanstack/react-table";

import { columns, RowData } from "./_columns";
import { rows } from "@/app/_rows";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  // Row Selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /** 確認用 */
  useEffect(() => {
    console.info("rowSelection: ", rowSelection);
  }, [rowSelection]);

  const handleRowClick = (row: Row<RowData>, isCheck: boolean = false) => {
    // RowクリックでCheckboxもToggle連動するかを制御
    if (isCheck) {
      row.toggleSelected();
    }

    // クリックしたRowのオリジナルデータを表示
    console.info("Index: ", row.index);
    console.info("Original: ", row.original);
    console.info("rowSelection: ", rowSelection);
  };

  /** Table 作成 */
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection, // Row 選択時（row index: boolean）
    enableMultiRowSelection: true, // Rowの複数選択 (defalut: true)
    state: {
      rowSelection,
    },
  });

  return (
    <main>
      <div className="current">
        <span>custom</span>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={row.getIsSelected() ? "selected" : undefined}
                onClick={() => handleRowClick(row, true)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <td key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </main>
  );
}
