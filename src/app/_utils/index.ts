"use client";
import { CSSProperties } from "react";
import { Table, Column, Row } from "@tanstack/react-table";

/** Join String */
export function joinString(...args: string[]) {
  return args.length === 0 ? "" : args.join(" ").toLowerCase();
}

/** Sum */
export function Sum(...args: number[]) {
  return args.length === 0 ? 0 : args.reduce((sum, score) => sum + score, 0);
}

/** Average */
export function Average(...args: number[]) {
  if (args.length === 0) {
    return 0;
  } else {
    const _total = args.reduce((sum, score) => sum + score, 0);
    const _average = Math.floor(_total / args.length);
    return _average;
  }
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
  tableRole: "header" | "body" = "header"
): CSSProperties {
  const _isColumnPinned = column.getIsPinned();

  if (!_isColumnPinned) return {};

  const _bgColor =
    tableRole === "header" ? "var(--primaryColor)" : "var(--secondaryColor)";

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
      ? { right: `${column.getAfter("right")}px` }
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
