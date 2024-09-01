import { CSSProperties } from "react";
import { Cell, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Student } from "@/app/_rows/type";

type Props = {
  cell: Cell<Student, unknown>;
  style?: CSSProperties;
};

export function GridTableBodyCell({ cell, style }: Props) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const cellStyle: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    ...style,
  };

  return (
    <div style={cellStyle} ref={setNodeRef} className="grid-table__body-cell">
      <div className="grid-table__cell-inner">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </div>
  );
}
