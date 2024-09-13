"use client";

import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props<T> = {
  header: Header<T, unknown>;
  style?: CSSProperties;
  isDraggable?: boolean;
};

export function GridHeaderCell<T>({
  header,
  style,
  isDraggable = true,
}: Props<T>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
    disabled: !isDraggable,
  });

  const columnStyle: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...style,
  };

  const isPinned = header.column.getIsPinned();

  const isSorted = header.column.getIsSorted();

  const isResizing = header.column.getIsResizing();

  const contentStyle: CSSProperties = {
    cursor: isDraggable && !isPinned ? "grab" : "default",
  };

  return (
    <div
      id={header.column.id}
      className={`grid__cell ${isPinned ? "is-pinned" : ""}`}
      ref={setNodeRef}
      style={columnStyle}
    >
      <div className="grid__cell-inner">
        <div
          {...attributes}
          {...listeners}
          className="grid__cell-content"
          style={contentStyle}
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>
        <div className="grid__cell-option">
          {/** Accessor Column以外は getCanSort() = false になる */}
          {header.column.getCanSort() && (
            <button
              type="button"
              className={`sort ${isSorted ? "is-active" : ""}`}
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.column.getIsSorted() === "asc" ? "⬆" : "⬇"}
            </button>
          )}
        </div>
      </div>
      {header.column.getCanResize() && (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${isResizing ? "is-resizing" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}{" "}
    </div>
  );
}
