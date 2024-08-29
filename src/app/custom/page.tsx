"use client";

import React, { useEffect, useState } from "react";
import {
  Column,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  ColumnPinningState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { columns } from "./_columns";
import { rows } from "@/app/_rows";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  /** Column Filter */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const getColumnFilterValue = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return "";
    return column.getFilterValue() as string;
  };

  const hanldeChangeColumnFilter = (columnId: string, value: string) => {
    const _column = table.getColumn(columnId);
    if (_column) {
      if (!value) {
        _column.setFilterValue(undefined);
      } else if (!isNaN(Number(value))) {
        _column.setFilterValue(Number(value));
      } else {
        _column.setFilterValue(value);
      }
    }
  };

  /** Column Pinning */
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select"], // カラムIDを指定
    right: [],
  });

  const getPinnedStyles = (column: Column<Student, unknown>) => {
    if (!column.getIsPinned()) {
      return {};
    }

    return {
      position: "sticky" as const,
      left: column.getIsPinned() === "left" ? `${column.getStart()}px` : "auto",
      right:
        column.getIsPinned() === "right" ? `${column.getAfter()}px` : "auto",
      zIndex: 1,
    };
  };

  /** Row Selection */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleRowClick = (row: Row<Student>, isCheck: boolean = true) => {
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

  const sortIcon = (column: Column<Student>) => {
    const sortDirection = column.getIsSorted();
    if (!sortDirection) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  /** Visibility */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // 確認用
  useEffect(() => {
    console.info("columnFilters: ", columnFilters);
  }, [columnFilters]);

  /** Table 作成 */
  const table = useReactTable<Student>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // Column Filter
    enableColumnFilters: true, // フィタリングのオンオフ
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    // Column Pinning
    enableColumnPinning: false, // カラム左右固定のオンオフ (defalut: false)
    onColumnPinningChange: setColumnPinning,

    // Row Selection
    enableMultiRowSelection: true, // Rowの複数選択 (defalut: true)
    // enableRowSelection: (row) => row.original.age >= 18, // Rowの選択条件 (defalut: true)
    onRowSelectionChange: setRowSelection, // Row 選択時（row index: boolean）

    // Sort
    enableSorting: true, // ソート機能 (defalut: true)
    enableMultiSort: true, // マルチソート（defalut: true）
    sortDescFirst: true, // ソートの実行順序（default: true[ desc -> asc ], false[ asc -> desc ]）
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // Visibility
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnPinning,
      rowSelection,
      sorting,
      columnVisibility,
    },
  });

  return (
    <main>
      <div className="current">
        <span>custom</span>
      </div>
      <div className="container is-flex">
        <div className="column-controller">
          <div className="column-controller__inner">
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
              {table
                .getAllLeafColumns()
                .filter((column) => column.columnDef.enableHiding !== false)
                .map((column) => (
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
          <div className="column-controller__inner">
            <p>カラムのフィルタリング</p>
            <ul>
              <li>
                <label>
                  <span>性別</span>
                  <select
                    value={getColumnFilterValue("gender")}
                    onChange={(e) =>
                      hanldeChangeColumnFilter("gender", e.target.value)
                    }
                  >
                    <option value="">全て</option>
                    <option value="男子">男子</option>
                    <option value="女子">女子</option>
                  </select>
                </label>
              </li>
              <li>
                <label>
                  <span>学年</span>
                  <select
                    value={getColumnFilterValue("grade")}
                    onChange={(e) =>
                      hanldeChangeColumnFilter("grade", e.target.value)
                    }
                  >
                    <option value="">全て</option>
                    {[1, 2, 3, 4, 5, 6].map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}年
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                <label>
                  <span>クラス</span>
                  <select
                    value={getColumnFilterValue("class")}
                    onChange={(e) =>
                      hanldeChangeColumnFilter("class", e.target.value)
                    }
                  >
                    <option value="">全て</option>
                    {[1, 2, 3, 4].map((classNum) => (
                      <option key={classNum} value={classNum}>
                        {classNum}組
                      </option>
                    ))}
                  </select>
                </label>
              </li>
              <li>
                <label>
                  <span>国語</span>
                  <select
                    value={getColumnFilterValue("lang")}
                    onChange={(e) =>
                      hanldeChangeColumnFilter("lang", e.target.value)
                    }
                  >
                    <option value="">全て</option>
                    <option value="50">50点以上</option>
                    <option value="80">80点以上</option>
                    <option value="90">90点以上</option>
                    <option value="100">100点</option>
                  </select>
                </label>
              </li>
              <li>
                <label>
                  <span>算数</span>
                  <select
                    value={getColumnFilterValue("arith")}
                    onChange={(e) =>
                      hanldeChangeColumnFilter("arith", e.target.value)
                    }
                  >
                    <option value="">全て</option>
                    <option value="50">50点以上</option>
                    <option value="80">80点以上</option>
                    <option value="90">90点以上</option>
                    <option value="100">100点</option>
                  </select>
                </label>
              </li>
              <li>
                <label>
                  <span>理科</span>
                  <select
                    value={getColumnFilterValue("science")}
                    onChange={(e) =>
                      hanldeChangeColumnFilter("science", e.target.value)
                    }
                  >
                    <option value="">全て</option>
                    <option value="50">50点以上</option>
                    <option value="80">80点以上</option>
                    <option value="90">90点以上</option>
                    <option value="100">100点</option>
                  </select>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div className="table-wrapper small">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      style={getPinnedStyles(header.column)}
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
                  className={`${
                    row.getCanSelect() ? "selectable" : "no-selectable"
                  } ${rowSelection[row.index] ? "selected" : ""}`}
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={getPinnedStyles(cell.column)}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
      </div>
    </main>
  );
}
