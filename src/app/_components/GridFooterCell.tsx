"use client";

import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props<T> = {
  header: Header<T, unknown>;
  style?: CSSProperties;
};

export function GridFooterCell<T>({ header, style }: Props<T>) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: header.column.id,
  });

  const dragAlongStyle: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    width: header.getSize(),
    ...style,
  };

  return (
    <div className="grid__cell" ref={setNodeRef} style={dragAlongStyle}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.footer, header.getContext())}
    </div>
  );
}
