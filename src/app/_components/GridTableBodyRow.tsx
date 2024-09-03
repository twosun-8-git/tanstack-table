"use client";

import { CSSProperties } from "react";
import { Row, RowSelectionState } from "@tanstack/react-table";

type Props<T> = {
  row: Row<T>;
  rowSelected: RowSelectionState;
  handleRowClick?: (row: Row<T>) => void;
  style?: CSSProperties;
  isPinned?: "top" | "bottom" | false;
  children: React.ReactNode;
};

export function GridTableBodyRow<T>({
  row,
  rowSelected,
  handleRowClick,
  style,
  children,
}: Props<T>) {
  return (
    <div
      // className={`grid__row  ${
      //   row.getCanSelect() ? "selectable" : "no-selectable"
      // } ${rowSelected[row.index] ? "selected" : ""}`}

      // onClick={() => handleRowClick(row)}
      className="grid__row"
      style={style}
    >
      {children}
    </div>
  );
}
