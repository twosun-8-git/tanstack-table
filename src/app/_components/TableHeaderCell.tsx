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

  const thStyle: CSSProperties = {
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

  const isSort = header.column.columnDef.enableSorting;

  /** クリックイベントの干渉を避けるため「DnDでのカラムの並び替え」と「ソート機能」のDOMは分ける */
  return (
    <th colSpan={header.colSpan} ref={setNodeRef} style={thStyle}>
      <div className="table__header-cell-inner">
        <div
          {...attributes}
          {...listeners}
          className="table__header-cell-content"
          style={contentStyle}
        >
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
      {header.column.getCanResize() && (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
    </th>
  );
}
