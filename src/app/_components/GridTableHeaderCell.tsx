import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Student } from "@/app/_rows/type";

type Props = {
  header: Header<Student, unknown>;
  style?: CSSProperties;
  isDraggable?: boolean;
};

export function GridTableHeaderCell({
  header,
  style,
  isDraggable = true,
}: Props) {
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

  const cellStyle: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...style,
  };

  const contentStyle: CSSProperties = {
    cursor: isDraggable ? "grab" : "default",
  };

  const isSortedColumn = header.column.getIsSorted();

  return (
    <div ref={setNodeRef} style={cellStyle} className="grid-table__header-cell">
      <div className="grid-table__header-cell-inner">
        <div
          {...attributes}
          {...listeners}
          className="grid-table__header-cell-content"
          style={contentStyle}
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>
        <div className="grid-table__header-option">
          {header.column.getCanSort() && (
            <button
              type="button"
              className={`sort ${isSortedColumn ? "is-active" : ""}`}
              onClick={header.column.getToggleSortingHandler()}
            >
              {isSortedColumn === "asc" ? "⬆" : "⬇"}
            </button>
          )}
        </div>
      </div>
      {header.column.getCanResize() && (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${
            header.column.getIsResizing() && "is-resizing"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
    </div>
  );
}
