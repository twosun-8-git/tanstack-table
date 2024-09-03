"use client";

import { useEffect, useState } from "react";
import {
  Row,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnResizeMode,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  PaginationState,
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
  GridTableBodyCell,
  GridTableBodyRow,
  GridTableFooterCell,
  GridTableHeaderCell,
  Pagination,
} from "@/app/_components";

import { getColumnPinningStyle, getRowPinningStyle } from "@/app/_utils";

export default function Page() {
  const [data, _setData] = useState(() => [...rows]);

  /**
   * Column Filter
   **/
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // 確認用: Column Order
  useEffect(() => {
    console.info("🔴 Column Filters: ", columnFilters);
  }, [columnFilters]);

  /**
   * Column Order
   **/
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
    console.info("🟡 Column Order: ", columnOrder);
  }, [columnOrder]);

  /**
   * Column Pinning
   **/
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [], // カラムIDを指定
    right: [],
  });

  // 確認用: Column Pinning
  useEffect(() => {
    console.info("🟣 Column Pinning: ", columnPinning);
  }, [columnPinning]);

  /**
   * Column Resize
   **/
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");

  // 確認用: Resize
  useEffect(() => {
    console.info("🟤 ColumnSizing: ", columnSizing);
    console.info("🟤 Column ResizeMode: ", columnResizeMode);
  }, [columnSizing, columnResizeMode]);

  /**
   * Column Visibility
   **/
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // 確認用: Visibility
  useEffect(() => {
    console.info("🔵 Column Visibility: ", columnVisibility);
  }, [columnVisibility]);

  /**
   * Pagination
   **/
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // 確認用: Pagination
  useEffect(() => {
    console.info("🟠 Pagination: ", pagination);
  }, [pagination]);

  /**
   * Row Pinning
   **/
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  // 確認用: Pagination
  useEffect(() => {
    console.info("🔴 Row Pinning: ", rowPinning);
  }, [rowPinning]);

  /**
   * Row Selection
   **/
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
    console.info("🟢 Row Selection: ", rowSelection);
  }, [rowSelection]);

  /**
   * Sort
   **/
  const [sorting, setSorting] = useState<SortingState>([]);

  // 確認用: Sort
  useEffect(() => {
    console.info("🟠 Sorting: ", sorting);
  }, [sorting]);

  /**
   * Table 作成
   *
   * Table Options（ カラム個別の指定がある場合はそれが優先される ）
   * enableColumnFilters: カラムのフィルタリング UI の表示（ default: false ）
   * enableGlobalFilter: カラムのフグローバルィルタリング（ default: false ）
   * enableFilters: カラムのフィルタリング機能（ default: false ）
   * enableGrouping: カラムのグルーピング（ default: false ）
   * enableColumnResizing: カラムのリサイズ（ default: false ）
   * enableHiding: カラムの表示・非表示（ default: false ）
   * enableSorting: カラムのソート（ default: false ）
   * enableMultiSort: 複数のカラムのソート（ default: false ）
   * enableRowSelection: Row の選択（ default: false ）
   * enableMultiRowSelection: 複数の Row の選択（ default: true ）
   * enableSubRowSelection: カラムのソート（ default: true ）
   * enableExpanding: Row の展開機能（ default: false ）
   */

  const table = useReactTable<Student>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // Column Filter
    enableColumnFilters: true,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    // Column Pinning （矛盾）
    enableColumnPinning: false, // カラム左右固定のオンオフ (defalut: false)
    onColumnPinningChange: setColumnPinning,

    // Column Order（enableColumnOrderが存在しない）
    onColumnOrderChange: setColumnOrder,

    // Column Resize
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,

    // Pagination
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,

    // Row Pinning（矛盾）
    enableRowPinning: false,
    onRowPinningChange: setRowPinning,
    keepPinnedRows: true, // ピン留めされた行をページネーションやフィルタリング時に保持する

    // Row Selection
    enableRowSelection: false, // (row) => row.original.science >= 80 選択できる Rowの条件指定も可
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,

    // Sort
    enableSorting: true,
    enableMultiSort: true,
    sortDescFirst: true, // ソートの実行順序（default: true[ desc -> asc ], false[ asc -> desc ]）
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // Visibility
    enableHiding: false,
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      columnFilters,
      columnPinning,
      columnOrder,
      columnSizing,
      columnVisibility,
      pagination,
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
            <div className="contents">
              <div className={`grid ${isResizing ? "is-resizing" : ""}`}>
                <div className="grid__header">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="grid__row">
                      {headerGroup.headers.map((header) => (
                        <GridTableHeaderCell
                          key={header.id}
                          header={header}
                          style={getColumnPinningStyle(header.column)}
                          isDraggable={!nonDraggableColumns.includes(header.id)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="grid__body">
                  {table.getTopRows().map((row) => (
                    <GridTableBodyRow
                      key={row.id}
                      row={row}
                      rowSelected={rowSelected}
                      // handleRowClick={handleRowClick}
                      style={getRowPinningStyle(row, table)}
                      isPinned="top"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <GridTableBodyCell
                          key={cell.id}
                          cell={cell}
                          style={getColumnPinningStyle(cell.column, "row")}
                        />
                      ))}
                    </GridTableBodyRow>
                  ))}
                  {(table.options.enableRowPinning
                    ? table.getCenterRows()
                    : table.getRowModel().rows
                  ).map((row) => (
                    <GridTableBodyRow
                      key={row.id}
                      row={row}
                      rowSelected={rowSelected}
                      // handleRowClick={handleRowClick}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <GridTableBodyCell
                          key={cell.id}
                          cell={cell}
                          style={getColumnPinningStyle(cell.column, "row")}
                        />
                      ))}
                    </GridTableBodyRow>
                  ))}
                  {table.getBottomRows().map((row) => (
                    <GridTableBodyRow
                      key={row.id}
                      row={row}
                      rowSelected={rowSelected}
                      // handleRowClick={handleRowClick}
                      style={getRowPinningStyle(row, table)}
                      isPinned="bottom"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <GridTableBodyCell
                          key={cell.id}
                          cell={cell}
                          style={getColumnPinningStyle(cell.column, "row")}
                        />
                      ))}
                    </GridTableBodyRow>
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
              <Pagination table={table} />
            </div>
          </SortableContext>
        </div>
      </main>
    </DndContext>
  );
}
