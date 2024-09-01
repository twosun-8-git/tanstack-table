import React from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";

type Props = {
  header: Header<Student, unknown>;
  style?: React.CSSProperties;
};

export function GridTableFooterCell({ header, style }: Props) {
  return (
    <div
      className="grid-table__footer-cell"
      style={{
        ...style,
        gridColumn: `span ${header.colSpan}`,
      }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.footer, header.getContext())}
    </div>
  );
}
