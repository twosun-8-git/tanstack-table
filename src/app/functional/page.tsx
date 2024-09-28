"use client";
import React, { useEffect, useState } from "react";

import {
  Row,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  RowPinningState,
  RowSelectionState,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  VisibilityState,
  SortingState,
  PaginationState,
  useReactTable,
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
import { columns } from "./_columns";
import { rows } from "@/app/_rows";

import {
  getColumnPinningStyle,
  getRowPinningStyle,
  joinString,
  Sum,
  Average,
} from "@/app/_utils";

import {
  GridHeaderCell,
  GridFooterCell,
  GridBodyRow,
  GridBodyCell,
  ColumnController,
  Pagination,
  Search,
} from "@/app/_components";

/** Custom Global Filter */
function customGlobalFilterFn(
  row: Row<Student>,
  columnId: string,
  filterValue: string
): boolean {
  const _searchValue = filterValue.toLowerCase();

  // Accessor Column の検索
  const cellValue = String(row.getValue(columnId)).toLowerCase();
  if (cellValue.includes(_searchValue)) return true;

  // FullName の検索
  const { lastName, firstName } = row.original;
  if (joinString(lastName, firstName).includes(_searchValue)) return true;

  // TotalとAverage の検索
  const { lang, arith, science } = row.original;
  const _total = Sum(lang, arith, science);
  const _average = Average(lang, arith, science);

  if (
    String(_total).includes(_searchValue) ||
    String(_average).includes(_searchValue)
  ) {
    return true;
  }

  return false;
}

export default function Page() {
  /** Expanding */
  const [expanded, setExpanded] = useState({});

  // 確認用: expanded
  useEffect(() => {
    console.info("🟤 Expanded: ", expanded);
  }, [expanded]);

  /** Global Filtering */
  const [globalFilter, setGlobalFilter] = useState("");

  // 確認用: Global Filtering
  useEffect(() => {
    console.info("🟢 Global Filtering: ", globalFilter);
  }, [globalFilter]);

  /** Column Visibility */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // 確認用: Column Visibility
  useEffect(() => {
    console.info("🔵 Column Visibility: ", columnVisibility);
  }, [columnVisibility]);

  /** Column Filter */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 確認用: Column Filter
  useEffect(() => {
    console.info("🔴 Column Filters: ", columnFilters);
  }, [columnFilters]);

  /** Column Pinning */
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [], // カラムIDを指定
    right: [],
  });

  // 確認用: Column Pinning
  useEffect(() => {
    console.info("🟣 Column Pinning: ", columnPinning);
  }, [columnPinning]);

  /** Column Order */
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
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

  /** Column Sizing */
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // 確認用: Column Sizing
  useEffect(() => {
    console.info("🟤 ColumnSizing: ", columnSizing);
  }, [columnSizing]);

  /** Row Pinning */
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [], // 初めからピン留めしておきたい場合はRow Index を Stringで指定する。["0", "1", "4"]など
    bottom: [],
  });

  // 確認用: Row Pinning
  useEffect(() => {
    console.info("🔴 Row Pinning: ", rowPinning);
  }, [rowPinning]);

  /** Row Selection */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // 確認用: RowSelection
  useEffect(() => {
    console.info("🟢 Row Selection: ", rowSelection);
  }, [rowSelection]);

  /** Sorting */
  const [sorting, setSorting] = useState<SortingState>([]);

  // 確認用: Sorting
  useEffect(() => {
    console.info("🟠 Sorting: ", sorting);
  }, [sorting]);

  /** Pagination */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // 確認用: Pagination
  useEffect(() => {
    console.info("🟠 Pagination: ", pagination);
  }, [pagination]);

  /** 機能とUIを合わせる */
  const isEnables = [
    { enableExpanding: false, id: "expander" },
    { enableRowPinning: true, id: "pin" },
    { enableRowSelection: true, id: "checkbox" },
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

  const table = useReactTable<Student>({
    data: rows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),

    // Expanding
    enableExpanding: !isEnables.some((obj) => obj.enableExpanding === false),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) => row.original.details != null,

    // Column Visibility
    enableHiding: true,
    onColumnVisibilityChange: setColumnVisibility,

    // Column Filter
    enableColumnFilters: true,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,

    // Column Pinning
    enableColumnPinning: true,
    onColumnPinningChange: setColumnPinning,

    // Column Order
    onColumnOrderChange: setColumnOrder,

    // Column Sizing
    enableColumnResizing: true,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: "onChange",

    // Row Pinning
    enableRowPinning: !isEnables.some((obj) => obj.enableRowPinning === false), // Rowのピン留め（上下）（ default: false ）
    onRowPinningChange: setRowPinning,

    // Row Selection
    enableRowSelection: !isEnables.some(
      (obj) => obj.enableRowSelection === false
    ),
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,

    // Sorting
    enableSorting: true,
    enableMultiSort: true,
    sortDescFirst: true,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    // Pagination
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,

    // Global Filter
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilterFn,

    state: {
      expanded,
      rowPinning,
      rowSelection,
      columnFilters,
      columnPinning,
      columnOrder,
      columnSizing,
      columnVisibility,
      sorting,
      pagination,
      globalFilter,
    },
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
        <Search globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <div className="container">
          <ColumnController table={table} />
          {!table.getRowModel().rows.length ? (
            <div className="contents no-data">
              <div className="grid">
                <p className="no-data__title">No Data</p>
                <p className="no-data__message">
                  申し訳ございません。表示できるデータありませんでした。
                </p>
              </div>
            </div>
          ) : (
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
                            <GridHeaderCell
                              key={header.id}
                              header={header}
                              style={getColumnPinningStyle(header.column)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid__body">
                    {enableRowPinning &&
                      table.getTopRows().map((row) => (
                        <GridBodyRow
                          key={row.id}
                          row={row}
                          style={getRowPinningStyle(row, table)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <GridBodyCell
                              key={cell.id}
                              cell={cell}
                              style={getColumnPinningStyle(cell.column, "body")}
                            />
                          ))}
                        </GridBodyRow>
                      ))}
                    {(enableRowPinning
                      ? table.getCenterRows()
                      : table.getRowModel().rows
                    ).map((row) => (
                      <GridBodyRow
                        key={row.id}
                        row={row}
                        style={getRowPinningStyle(row, table)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <GridBodyCell
                            key={cell.id}
                            cell={cell}
                            style={getColumnPinningStyle(cell.column, "body")}
                          />
                        ))}
                      </GridBodyRow>
                    ))}
                    {enableRowPinning &&
                      table.getBottomRows().map((row) => (
                        <GridBodyRow
                          key={row.id}
                          row={row}
                          style={getRowPinningStyle(row, table)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <GridBodyCell
                              key={cell.id}
                              cell={cell}
                              style={getColumnPinningStyle(cell.column, "body")}
                            />
                          ))}
                        </GridBodyRow>
                      ))}
                  </div>
                  <div className="grid__footer">
                    {table.getFooterGroups().map((footerGroup) => (
                      <div key={footerGroup.id} className="grid__row">
                        <div className="grid__row-content">
                          {footerGroup.headers.map((footer) => (
                            <GridFooterCell key={footer.id} footer={footer} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Pagination table={table} />
              </div>
            </SortableContext>
          )}
        </div>
      </main>
    </DndContext>
  );
}
