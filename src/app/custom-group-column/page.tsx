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

// DnD
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { columns } from "./_columns/flat";
import { Student } from "@/app/_rows/type";
import { rows } from "@/app/_rows";
import {
  ColumnController,
  DraggableTableHeader,
  DragAlongCell,
} from "@/app/_components";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  /** Column Filter */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  /** Column Order */
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns
      .map((col) => {
        if ("id" in col) return col.id as string;
        if ("accessorKey" in col) return col.accessorKey as string;
        return "";
      })
      .filter(Boolean)
  );

  /** Column Pinning */
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [], // カラムIDを指定
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

    // Column Order
    onColumnOrderChange: setColumnOrder,

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
      columnOrder,
      rowSelection,
      sorting,
      columnVisibility,
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over?.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <main>
        <div className="current">
          <span>custom</span>
        </div>
        <div className="container is-flex">
          <ColumnController table={table} />
          <div className="table-wrapper small">
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              <table className="table">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <DraggableTableHeader
                          key={header.id}
                          header={header}
                          style={getPinnedStyles(header.column)}
                          icon={sortIcon(header.column)}
                        />
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
                        <DragAlongCell
                          key={cell.id}
                          cell={cell}
                          style={getPinnedStyles(cell.column)}
                        />
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
            </SortableContext>
          </div>
        </div>
      </main>
    </DndContext>
  );
}
