import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Student } from "@/app/_rows/type";

type Props = {
  header: Header<Student, unknown>;
  style?: CSSProperties;
  sortIcon?: React.ReactNode;
  isDraggable?: boolean;
};

export function TableHeaderCell({
  header,
  style,
  sortIcon,
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

  const css: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...style,
  };

  const isSort = header.column.columnDef.enableSorting;

  return (
    <th
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={css}
      {...attributes}
      {...listeners}
    >
      <div className="table__header-content">
        <div style={{ cursor: !isDraggable ? "default" : "grab" }}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>
        <div className="table__header-option">
          {isSort !== false && (
            <button
              type="button"
              className="sort"
              onClick={header.column.getToggleSortingHandler()}
            >
              {sortIcon}
            </button>
          )}
        </div>
      </div>
    </th>
  );
}
