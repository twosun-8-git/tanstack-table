"use client";

import { useEffect, useState } from "react";
import {
  Column,
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { columns, RowData } from "./_columns";
import { rows } from "@/app/_rows";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  /** Row Selection */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // 確認用
  useEffect(() => {
    console.info("rowSelection: ", rowSelection);
  }, [rowSelection]);

  const handleRowClick = (row: Row<RowData>, isCheck: boolean = true) => {
    // enableRowSelectionの条件にマッチしていない場合は何もしない
    if (!row.getCanSelect()) return;

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
  };

  /** Sort */
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortIcon = (column: Column<RowData>) => {
    const sortDirection = column.getIsSorted();
    if (!sortDirection) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  /** Visibility */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  /** Table 作成 */
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // Row Selection
    // enableRowSelection: (row) => row.original.age >= 18, // Rowの選択条件 (defalut: true)
    onRowSelectionChange: setRowSelection, // Row 選択時（row index: boolean）
    enableMultiRowSelection: true, // Rowの複数選択 (defalut: true)

    // Sort
    enableSorting: true, // ソート機能 (defalut: true)
    enableMultiSort: true, // マルチソート（defalut: true）
    sortDescFirst: true, // ソートの実行順序（default: true[ desc -> asc ], false[ asc -> desc ]）
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // Visibility
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      sorting,
      columnVisibility,
    },
  });

  const getColumnHeaderText = (column: ColumnDef<RowData>) => {
    if (typeof column.header === "string") {
      return column.header;
    } else if (typeof column.header === "function") {
      // 関数の場合、実行結果を文字列として返す
      const result = column.header({} as any); // 簡易的な実装
      return typeof result === "string" ? result : column.id;
    } else {
      return column.id; // フォールバックとしてidを使用
    }
  };

  return (
    <main>
      <div className="current">
        <span>custom</span>
      </div>
      <div className="column-visibility">
        <p>Column Visibility</p>
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
          {table
            .getAllColumns()
            .filter((column) => column.columnDef.enableHiding !== false)
            .map((column) => {
              console.log(typeof column.columnDef.header);
              return (
                <li key={column.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                    {column.id}
                  </label>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {sortIcon(header.column)}
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
                  ${rowSelection[row.index] ? "selected" : ""}
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
