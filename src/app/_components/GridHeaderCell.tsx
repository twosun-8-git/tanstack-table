"use client";

import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props<T> = {
  header: Header<T, unknown>;
  style?: CSSProperties;
};

export function GridHeaderCell<T>({ header, style }: Props<T>) {
  const { draggable } = header.column.columnDef.meta as {
    draggable?: boolean;
  };

  const isDraggable = draggable !== false;

  const isPinned = header.column.getIsPinned();

  const isResizing = header.column.getIsResizing();

  const isSorted = header.column.getIsSorted();

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
    disabled: !isDraggable || !!isPinned,
  });

  const cellStyle: CSSProperties = {
    width: header.getSize(),
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    ...style,
  };

  const contentStyle: CSSProperties = {
    cursor: isDraggable && !isPinned ? "grab" : "default",
  };

  return (
    <div className="grid__cell" ref={setNodeRef} style={cellStyle}>
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
          className={`resizer ${isResizing ? "is-resizing" : ""}`}
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
    </div>
  );
}
