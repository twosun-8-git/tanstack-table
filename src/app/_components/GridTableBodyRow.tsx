"use client";

import { CSSProperties } from "react";
import { Row, RowData } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";

type Props<T extends Student> = {
  row: Row<T>;
  rowSelected: Student[];
  handleRowClick: (row: any) => void;
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
  const { no, details } = row.original;

  const isSelected = rowSelected.some((r) => r.no === no);

  return (
    <div
      className={`grid__row ${isSelected ? "is-selected" : ""} ${
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
