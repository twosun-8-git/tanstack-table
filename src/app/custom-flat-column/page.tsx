"use client";

import { useEffect, useState, CSSProperties } from "react";
import {
  Table,
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
  RowPinningState,
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
  GridTableHeaderCell,
  GridTableBodyCell,
  GridTableFooterCell,
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
  const nonDraggableColumns: string[] = []; // 並び替え対象外カラムID
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

  function getColumnPinningStyle<T>(
    column: Column<T>,
    bgColor: string = "var(--secondaryColor)"
  ): CSSProperties {
    const isColumnPinned = column.getIsPinned();

    if (!isColumnPinned) return {};

    /** 左から1, 2番目などでCSSを分けたい場合は下記を利用 */
    // const isFirstLeftPinnedColumn =
    //   isPinned === "left" && column.getIsFirstColumn("left");
    // const isLastLeftPinnedColumn =
    //   isPinned === "left" && column.getIsLastColumn("left");
    // const isFirstRightPinnedColumn =
    //   isPinned === "right" && column.getIsFirstColumn("right");
    // const isLastRightPinnedColumn =
    //   isPinned === "right" && column.getIsLastColumn("right");

    return {
      ...(isColumnPinned ? { backgroundColor: bgColor } : {}),
      left:
        isColumnPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right:
        isColumnPinned === "right"
          ? `${column.getAfter("right")}px`
          : undefined,
      position: isColumnPinned ? "sticky" : "relative",
      opacity: isColumnPinned ? 0.92 : 1,
      width: column.getSize(),
      zIndex: isColumnPinned ? 1 : 0,
    };
  }

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

  /** Column Visibility */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // 確認用: Sort
  useEffect(() => {
    console.group("🔵 columnVisibility");
    console.log(columnVisibility);
    console.groupEnd();
  }, [columnVisibility]);

  /** Row Pinning */
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  function getRowPinningStyle<T>(
    row: Row<T>,
    table: Table<T>,
    bgColor: string = "var(--secondaryColor)"
  ): CSSProperties {
    const isRowPinned = row.getIsPinned();

    if (!isRowPinned) return {};

    const baseStyle: CSSProperties = {
      position: "sticky",
      backgroundColor: bgColor,
      zIndex: 1,
    };

    if (isRowPinned === "top") {
      baseStyle.top = `${row.getPinnedIndex() * 26 + 48}px`;
    } else if (isRowPinned === "bottom") {
      baseStyle.bottom = `${
        (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
      }px`;
    }

    return baseStyle;
  }
  /** Row Selection */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rowSelected, setRowSelected] = useState<RowSelectionState>({});

  function handleRowClick<T>(row: Row<T>, isCheck: boolean = true) {
    // enableRowSelection の条件にマッチしていない場合は何もしない
    if (!row.getCanSelect()) return;

    // Row クリックで Checkbox も連動するかを制御
    if (isCheck) {
      setRowSelection((prev) => ({
        ...prev,
        [row.id]: !prev[row.id],
      }));
    }

    // クリックした Row index をrowSelectedに格納(UI)
    setRowSelected((prev) => ({
      ...prev,
      [row.id]: !prev[row.id],
    }));

    // 選択した Row データ
    console.log(row.index);
  }

  // 確認用: RowSelection
  useEffect(() => {
    console.group("🟢 rowSelection");
    console.log(rowSelection);
    console.groupEnd();
  }, [rowSelection]);

  /** Sort */
  const [sorting, setSorting] = useState<SortingState>([]);

  // 確認用: Sort
  useEffect(() => {
    console.group("🟠 sorting");
    console.log(sorting);
    console.groupEnd();
  }, [sorting]);

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
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,

    // Row Pinned
    onRowPinningChange: setRowPinning,
    keepPinnedRows: true, // ピン留めされた行をページネーションやフィルタリング時に保持する

    // Row Selection
    enableMultiRowSelection: true, // Rowの複数選択 (defalut: true)
    // enableRowSelection: (row) => row.original.science >= 80, // Rowの選択条件 (defalut: true)
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
      rowPinning,
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
        distance: 8,
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

  const isResizing = table.getState().columnSizingInfo.isResizingColumn;

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
        <div className="container">
          <ColumnController
            table={table}
            mode={columnResizeMode}
            changeMode={setColumnResizeMode}
          />
          <SortableContext
            items={columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            <div className={`grid ${isResizing ? "is-resizing" : ""}`}>
              <div className="grid__header">
                {table.getHeaderGroups().map((headerGroup) => (
                  <div key={headerGroup.id} className="grid__row">
                    {headerGroup.headers.map((header) => (
                      <GridTableHeaderCell
                        key={header.id}
                        header={header}
                        style={getColumnPinningStyle(
                          header.column,
                          "var(--primaryColor)"
                        )}
                        isDraggable={!nonDraggableColumns.includes(header.id)}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="grid__body">
                {table.getTopRows().map((row) => (
                  <div
                    key={row.id}
                    className={`grid__row pinned-top ${
                      row.getCanSelect() ? "selectable" : "no-selectable"
                    } ${rowSelected[row.index] ? "selected" : ""}`}
                    onClick={() => handleRowClick(row)}
                    style={getRowPinningStyle(row, table)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <GridTableBodyCell
                        key={cell.id}
                        cell={cell}
                        style={getColumnPinningStyle(cell.column)}
                      />
                    ))}
                  </div>
                ))}
                {table.getCenterRows().map((row) => (
                  <div
                    key={row.id}
                    className={`grid__row ${
                      row.getCanSelect() ? "selectable" : "no-selectable"
                    } ${rowSelected[row.index] ? "selected" : ""}`}
                    onClick={() => handleRowClick(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <GridTableBodyCell
                        key={cell.id}
                        cell={cell}
                        style={getColumnPinningStyle(cell.column)}
                      />
                    ))}
                  </div>
                ))}
                {table.getBottomRows().map((row) => (
                  <div
                    key={row.id}
                    className={`grid__row pinned-bottom ${
                      row.getCanSelect() ? "selectable" : "no-selectable"
                    } ${rowSelected[row.index] ? "selected" : ""}`}
                    onClick={() => handleRowClick(row)}
                    style={getRowPinningStyle(row, table)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <GridTableBodyCell
                        key={cell.id}
                        cell={cell}
                        style={getColumnPinningStyle(cell.column)}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="grid__footer">
                {table.getFooterGroups().map((footerGroup) => (
                  <div key={footerGroup.id} className="grid__row">
                    {footerGroup.headers.map((header) => (
                      <GridTableFooterCell key={header.id} header={header} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </SortableContext>
        </div>
      </main>
    </DndContext>
  );
}
