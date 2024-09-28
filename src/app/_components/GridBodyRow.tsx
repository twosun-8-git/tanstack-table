"use client";

import { CSSProperties } from "react";
import { Row } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";

type Props<T extends Student> = {
  row: Row<T>;
  style?: CSSProperties;
  children: React.ReactNode;
};

export function GridBodyRow<T extends Student>({
  row,
  style,
  children,
}: Props<T>) {
  const { details } = row.original;

  const isSelected = row.getIsSelected() ? "is-selected" : "";
  const isExpanded = row.getIsExpanded() ? "is-expanded" : "";
  const bgColor = !row.getCanSelect() ? "#f1f1f1" : "transparent";

  const handleRowClick = () => {
    row.toggleSelected();
  };

  const rowStyle: CSSProperties = {
    backgroundColor: bgColor,
    ...style,
  };

  return (
    <div
      className={`grid__row ${isSelected} ${isExpanded}`}
      onClick={handleRowClick}
      style={rowStyle}
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
