"use client";

import React, { useEffect, useState } from "react";
import {
  Row,
  RowData,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
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

import { Student } from "@/app/_rows/type";
import { rows } from "@/app/_rows";
import { columns } from "./_columns";

import {
  ColumnController,
  GridTableBodyCell,
  GridTableBodyRow,
  GridTableFooterCell,
  GridTableHeaderCell,
  Pagination,
  Search,
} from "@/app/_components";

import { getColumnPinningStyle, getRowPinningStyle } from "@/app/_utils";

/** Custom Global Filter */
function customGlobalFilterFn(
  row: Row<Student>,
  columnId: string,
  filterValue: string
): boolean {
  const _searchValue = filterValue.toLowerCase();

  // アクセサーカラムの検索
  const cellValue = String(row.getValue(columnId)).toLowerCase();
  if (cellValue.includes(_searchValue)) return true;

  const { lastName, firstName, lang, arith, science } = row.original;

  // フルネームの検索
  const _fullName = `${lastName} ${firstName}`.toLowerCase();
  if (_fullName.includes(_searchValue)) return true;

  // スコアの検索
  const _scores = [lang, arith, science];
  const _total = _scores.reduce((sum, score) => sum + score, 0);
  const _average = Math.floor(_total / _scores.length);

  if (
    String(_total).includes(_searchValue) ||
    String(_average).includes(_searchValue) ||
    _scores.some((score) => String(score).includes(_searchValue))
  ) {
    return true;
  }

  return false;
}

export default function Page() {
  /**
   * Global Filter
   **/
  const [globalFilter, setGlobalFilter] = useState("");

  // 確認用: Global Filter
  useEffect(() => {
    console.info("🟢 Global Filters: ", globalFilter);
  }, [globalFilter]);

  /**
   * Expanding
   **/
  const [expanded, setExpanded] = useState({});

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
    console.info("🟤 Column ResizeMode: ", `"${columnResizeMode}"`);
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
    pageSize: 20,
  });

  // 確認用: Pagination
  useEffect(() => {
    console.info("🟠 Pagination: ", pagination);
  }, [pagination]);

  /**
   * Row Pinning
   **/
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [], // Row Index を String 指定
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
  const [rowSelected, setRowSelected] = useState<RowData[]>([]);

  const handleRowClick = <T extends Student>(
    row: Row<T>,
    isCheck: boolean = false,
    isExpander: boolean = true
  ) => {
    // enableRowSelection の条件にマッチしていない場合は何もしない
    if (!row.getCanSelect()) return;

    // Checkbox も連動するかを制御
    if (isCheck) {
      setRowSelection((prev) => ({
        ...prev,
        [row.id]: !prev[row.id],
      }));
    }

    // Expender も連動するかを制御
    if (isExpander) {
      row.getCanExpand() && row.toggleExpanded();
    }

    // クリックした Row index をrowSelectedに格納(UI)

    // const _rowIndex = row.index;
    // const _rowData = row.original;
    // setRowSelected((prev: RowData[]) => {
    //   const _index = prev.findIndex((r: any) => r.no === _rowData.no);
    //   if (_index > -1) {
    //     return prev.filter((_, i) => i !== _index);
    //   } else {
    //     return [...prev, { ..._rowData, index: _rowIndex }];
    //   }
    // });
  };

  // 確認用: RowSelection, RowSelected
  useEffect(() => {
    console.info("🟢 Row Selection: ", rowSelection);
  }, [rowSelection]);

  useEffect(() => {
    console.info("🟣 Row Selected: ", rowSelected);
  }, [rowSelected]);

  /**
   * Sort
   **/
  const [sorting, setSorting] = useState<SortingState>([]);

  // 確認用: Sort
  useEffect(() => {
    console.info("🟠 Sorting: ", sorting);
  }, [sorting]);

  /** Column Init: 機能とUIを合わせる */
  const isEnables = [
    { enableExpanding: true, id: "expander" },
    { enableRowSelection: true, id: "checkbox" },
    { enableRowPinning: true, id: "pin" },
  ];
  const defaultColumns = columns.filter((column) => {
    // すべてのフィルタ条件をチェック
    return !isEnables.some((obj) => {
      // フィルタの条件が false で、かつ column.id が一致する場合、
      // そのカラムを除外する（false を返す）
      return Object.entries(obj).every(([key, value]) => {
        if (key === "id") return column.id === value;
        return value === false;
      });
    });
  });

  /** Table Init */
  const table = useReactTable<Student>({
    data: rows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),

    // Expanding
    enableExpanding: !isEnables.some((obj) => obj.enableExpanding === false),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) => row.original.details != null,

    // Global Filter
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilterFn,

    // Column Filter
    enableColumnFilters: true,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,

    // Column Pinning
    enableColumnPinning: true,
    onColumnPinningChange: setColumnPinning,

    // Column Order（enableColumnOrderが存在しない）
    onColumnOrderChange: setColumnOrder,

    // Column Resize
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,

    // Pagination
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,

    // Row Pinning（矛盾）
    enableRowPinning: !isEnables.some((obj) => obj.enableRowPinning === false), // Rowのピン留め（上下）（ default: false ）
    onRowPinningChange: setRowPinning,
    keepPinnedRows: true,

    // Row Selection
    enableRowSelection: !isEnables.some(
      (obj) => obj.enableRowSelection === false
    ),
    // enableRowSelection: (row) => row.original.science >= 80, // 選択できる Rowの条件指定も可
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,

    // Sort
    enableSorting: true,
    enableMultiSort: true,
    sortDescFirst: true,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    // Visibility
    enableHiding: true,
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      expanded,
      globalFilter,
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

  const { enableRowPinning } = table.options;

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
        <Search value={globalFilter} handleChange={setGlobalFilter} />
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
                      <div className="grid__row-content">
                        {headerGroup.headers.map((header) => (
                          <GridTableHeaderCell
                            key={header.id}
                            header={header}
                            style={getColumnPinningStyle(header.column)}
                            isDraggable={
                              !nonDraggableColumns.includes(header.id)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid__body">
                  {enableRowPinning &&
                    table.getTopRows().map((row) => (
                      <GridTableBodyRow
                        key={row.id}
                        row={row}
                        // rowSelected={rowSelected}
                        handleRowClick={handleRowClick}
                        style={getRowPinningStyle(row, table)}
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
                  {(enableRowPinning
                    ? table.getCenterRows()
                    : table.getRowModel().rows
                  ).map((row) => (
                    <GridTableBodyRow
                      key={row.id}
                      row={row}
                      // rowSelected={rowSelected}
                      handleRowClick={handleRowClick}
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
                  {enableRowPinning &&
                    table.getBottomRows().map((row) => (
                      <GridTableBodyRow
                        key={row.id}
                        row={row}
                        // rowSelected={rowSelected}
                        handleRowClick={handleRowClick}
                        style={getRowPinningStyle(row, table)}
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
                      <div className="grid__row-content">
                        {footerGroup.headers.map((header) => (
                          <GridTableFooterCell
                            key={header.id}
                            header={header}
                          />
                        ))}
                      </div>
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
