"use client";
import { CSSProperties } from "react";
import { Table, Column, Row } from "@tanstack/react-table";

/** Global Filter */
export function customGlobalFilterFn<T extends object>(
  row: Row<T>,
  columnId: string,
  filterValue: string
): boolean {
  // 検索文字
  const _searchValue = filterValue.toLowerCase();

  const _cellValue = String(row.getValue(columnId)).toLowerCase();

  // アクセサーカラムの検索
  if (_cellValue !== undefined) {
    if (_cellValue.includes(_searchValue)) return true;
  }

  const _original = row.original;

  // ディスプレイカラムの検索
  if ("lastName" in _original && "firstName" in _original) {
    const _cellValue =
      `${_original.lastName} ${_original.firstName}`.toLowerCase();
    if (_cellValue.includes(_searchValue)) return true;
  }

  if ("lang" in _original && "arith" in _original && "science" in _original) {
    const _scores = [
      _original.lang,
      _original.arith,
      _original.science,
    ] as number[];

    const _total = _scores.reduce((sum, score) => sum + score, 0);
    const _average = Math.floor(_total / _scores.length);

    if (String(_total).includes(_searchValue)) return true;
    if (String(_average).includes(_searchValue)) return true;
  }

  return false;
}

/** Column Filter Value */
export function getColumnFilterValue<T>(column: Column<T> | undefined) {
  if (!column) return;
  const _filterValue = column.getFilterValue();
  return _filterValue != null ? String(_filterValue) : "";
}

/** Column Pinning */
export function getColumnPinningStyle<T>(
  column: Column<T>,
  tableRole: "column" | "row" = "column"
): CSSProperties {
  const _isColumnPinned = column.getIsPinned();

  if (!_isColumnPinned) return {};

  const _bgColor =
    tableRole === "column" ? "var(--primaryColor)" : "var(--secondaryColor)";

  return {
    backgroundColor: _bgColor,
    opacity: _isColumnPinned ? 0.92 : 1,
    width: column.getSize(),
    zIndex: _isColumnPinned ? 1 : 0,
    position: _isColumnPinned ? "sticky" : "relative",
    ...(_isColumnPinned === "left"
      ? { left: `${column.getStart("left")}px` }
      : {}),
    ...(_isColumnPinned === "right"
      ? { left: `${column.getAfter("right")}px` }
      : {}),
  };
}

/** Row Pinning */
export function getRowPinningStyle<T>(
  row: Row<T>,
  table: Table<T>,
  bgColor: string = "#fffce6",
  columnHeight: string = "var(--columnHeight)",
  rowHeight: string = "var(--rowHeight)"
): CSSProperties {
  const _isRowPinned = row.getIsPinned();

  if (!_isRowPinned) return {};

  const _style: CSSProperties = {
    position: "sticky",
    backgroundColor: bgColor,
    zIndex: 2,
  };

  if (_isRowPinned === "top") {
    _style.top = `calc(${row.getPinnedIndex()} * ${rowHeight} + ${columnHeight})`;
  } else if (_isRowPinned === "bottom") {
    _style.bottom = `calc((${
      table.getBottomRows().length - 1 - row.getPinnedIndex()
    }) * ${rowHeight})`;
  }
  return _style;
}
