"use client";
import { CSSProperties } from "react";
import { Table, Column, Row } from "@tanstack/react-table";

/** Column Pinning */
export function getColumnPinningStyle<T>(
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
      isColumnPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isColumnPinned ? "sticky" : "relative",
    opacity: isColumnPinned ? 0.92 : 1,
    width: column.getSize(),
    zIndex: isColumnPinned ? 1 : 0,
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
  const isRowPinned = row.getIsPinned();

  if (!isRowPinned) return {};

  const style: CSSProperties = {
    position: "sticky",
    backgroundColor: bgColor,
    zIndex: 2,
  };

  if (isRowPinned === "top") {
    style.top = `calc(${row.getPinnedIndex()} * ${rowHeight} + ${columnHeight})`;
  } else if (isRowPinned === "bottom") {
    style.bottom = `calc((${
      table.getBottomRows().length - 1 - row.getPinnedIndex()
    }) * ${rowHeight})`;
  }
  return style;
}
