"use client";

import { CSSProperties } from "react";
import { Row, RowSelectionState } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";

type Props<T extends Student> = {
  row: Row<T>;
  rowSelected: RowSelectionState;
  handleRowClick: (row: Row<T>) => void;
  style?: CSSProperties;
  children: React.ReactNode;
};

export function GridTableBodyRow<T extends Student>({
  row,
  rowSelected,
  handleRowClick,
  style,
  children,
}: Props<T>) {
  const { details } = row.original;

  return (
    <div
      className={`grid__row  ${rowSelected[row.index] ? "is-selected" : ""} ${
        row.getIsExpanded() ? "is-expanded" : ""
      }`}
      onClick={() => handleRowClick(row)}
      style={style}
    >
      <div className="grid__row-content">{children}</div>
      {details && (
        <div className="grid__row-sub">
          {details?.birthday && (
            <dl>
              <dt>誕生日</dt>
              <dd>{details?.birthday}</dd>
            </dl>
          )}
          {details?.bloodtype && (
            <dl>
              <dt>血液型</dt>
              <dd>{details?.bloodtype}</dd>
            </dl>
          )}
          {details?.club && (
            <dl>
              <dt>部活動</dt>
              <dd>{details?.club}</dd>
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
