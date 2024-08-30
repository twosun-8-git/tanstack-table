import { CSSProperties } from "react";
import { Column, Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Student } from "@/app/_rows/type";

type Props = {
  header: Header<Student, unknown>;
  style?: CSSProperties;
  icon?: React.ReactNode;
};

export function DraggableTableHeader({ header, style, icon }: Props) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const css: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...style,
  };

  return (
    <th
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={css}
      onClick={header.column.getToggleSortingHandler()}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {icon}
    </th>
  );
}
