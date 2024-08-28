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

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  /** 確認用 */
  useEffect(() => {
    console.info("rowSelection: ", rowSelection);
  }, [rowSelection]);

  const handleRowClick = (row: Row<RowData>, isCheck: boolean = true) => {
    // enableRowSelectionの条件にマッチしていない場合は何もしない
    if (!row.getCanSelect()) return;

    // 選択したRowのidを格納
    setSelectedRows((prev) => {
      const _newSet = new Set(prev);
      _newSet.has(row.id) ? _newSet.delete(row.id) : _newSet.add(row.id);
      return _newSet;
    });

    // RowクリックでCheckboxもToggle連動するかを制御
    if (isCheck) {
      setRowSelection((prev) => ({
        ...prev,
        [row.id]: !prev[row.id],
      }));
    }

    // クリックしたRowのオリジナルデータを表示
    console.info("Index: ", row.index);
    console.info("Original: ", row.original);
    console.info("rowSelection: ", rowSelection);
    console.info("selectedRows: ", Array.from(selectedRows));
  };

  /** Table 作成 */
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Row Selection
    enableRowSelection: (row) =>
      row.original.age >= 18 && row.original.score > 5, // / Rowの選択条件 (defalut: true)
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
                className={`
                  ${selectedRows.has(row.id) ? "selected" : ""}
                  ${row.getCanSelect() ? "selectable" : "no-selectable"}
                `}
                onClick={() => handleRowClick(row)}
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
