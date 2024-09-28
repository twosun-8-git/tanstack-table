"use client";

import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props<T> = {
  footer: Header<T, unknown>;
  style?: CSSProperties;
};

export function GridFooterCell<T>({ footer, style }: Props<T>) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: footer.column.id,
  });

  const cellStyle: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    width: footer.getSize(),
    ...style,
  };

  return (
    <div className="grid__cell" ref={setNodeRef} style={cellStyle}>
      <div className="grid__cell-content">
        {footer.isPlaceholder
          ? null
          : flexRender(footer.column.columnDef.footer, footer.getContext())}
      </div>
    </div>
  );
}
