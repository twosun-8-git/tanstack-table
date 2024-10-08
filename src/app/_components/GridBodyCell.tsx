"use client";

import { CSSProperties } from "react";
import { Cell, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props<T> = {
  cell: Cell<T, unknown>;
  style?: CSSProperties;
};

export function GridBodyCell<T>({ cell, style }: Props<T>) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const cellStyle: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    width: cell.column.getSize(),
    ...style,
  };

  return (
    <div
      key={cell.id}
      ref={setNodeRef}
      className="grid__cell"
      style={cellStyle}
    >
      <div className="grid__cell-content">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </div>
  );
}
