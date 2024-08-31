"use client";

import { useEffect, useState } from "react";
import {
  Column,
  Row,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnResizeMode,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

// DnD
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { columns } from "./_columns";
import { Student } from "@/app/_rows/type";
import { rows } from "@/app/_rows";
import {
  ColumnController,
  TableHeaderCell,
  TableBodyCell,
  TableFooterCell,
} from "@/app/_components";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  /** Column Filter */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // 確認用: Column Order
  useEffect(() => {
    console.group("🔴 columnFilters");
    console.log(columnFilters);
    console.groupEnd();
  }, [columnFilters]);

  /** Column Order */
  const nonDraggableColumns = ["select", "no"]; // 並び替え対象外カラムID
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    /**
     * Display Column: id 必須
     * Accessor Column: accessorKey 必須、id 任意
     * Columnタイプの混在を考慮し id と accessorKey 両方を取得
     */
    columns
      .map((col) => {
        if ("id" in col) return col.id as string;
        if ("accessorKey" in col) return col.accessorKey as string;
        return "";
      })
      .filter((id) => id !== "")
  );

  // 確認用: Column Order
  useEffect(() => {
    console.group("🟡 columnOrder");
    console.log(columnOrder);
    console.groupEnd();
  }, [columnOrder]);

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

  // 確認用: Column Pinning
  useEffect(() => {
    console.group("🟣 columnPinning");
    console.log(columnPinning);
    console.groupEnd();
  }, [columnPinning]);

  /** Column Resize */
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");

  // 確認用: Resize
  useEffect(() => {
    console.group("🟤 columnSizing");
    console.log(columnSizing);
    console.groupEnd();
    console.group("🟤 columnResizeMode");
    console.log(columnResizeMode);
    console.groupEnd();
  }, [columnSizing, columnResizeMode]);

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

  // 確認用: RowSelection
  useEffect(() => {
    console.group("🟢 rowSelection");
    console.log(rowSelection);
    console.groupEnd();
  }, [rowSelection]);

  /** Sort */
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortIcon = (column: Column<Student>) => {
    const sortDirection = column.getIsSorted();
    return sortDirection === "asc" ? "⬆" : "⬇";
  };

  // 確認用: Sort
  useEffect(() => {
    console.group("🟠 sorting");
    console.log(sorting);
    console.groupEnd();
  }, [sorting]);

  /** Visibility */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // 確認用: Sort
  useEffect(() => {
    console.group("🔵 columnVisibility");
    console.log(columnVisibility);
    console.groupEnd();
  }, [columnVisibility]);

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

    // Column Resize
    enableColumnResizing: true,
    columnResizeMode,
    onColumnSizingChange: setColumnSizing,

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
      columnSizing,
      columnVisibility,
      rowSelection,
      sorting,
    },
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over?.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
      collisionDetection={closestCenter}
    >
      <main>
        <div className="current">
          <span>custom</span>
        </div>
        <div className="container is-flex">
          <ColumnController
            table={table}
            mode={columnResizeMode}
            changeMode={setColumnResizeMode}
          />

          <div className="table-wrapper small">
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              <table
                className="table"
                style={{ width: table.getCenterTotalSize() }}
              >
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHeaderCell
                          key={header.id}
                          header={header}
                          style={getPinnedStyles(header.column)}
                          sortIcon={sortIcon(header.column)}
                          isDraggable={!nonDraggableColumns.includes(header.id)}
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
                        <TableBodyCell
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
                        <TableFooterCell key={header.id} header={header} />
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
