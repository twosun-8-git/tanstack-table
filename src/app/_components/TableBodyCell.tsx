import { CSSProperties } from "react";
import { Cell, Column, Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Student } from "@/app/_rows/type";

type Props = {
  cell: Cell<Student, unknown>;
  style?: CSSProperties;
};

export function TableBodyCell({ cell, style }: Props) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const css: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...style,
  };
  return (
    <td style={css} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
}
