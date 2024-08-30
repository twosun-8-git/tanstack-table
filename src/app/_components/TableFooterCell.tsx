import { Header, flexRender } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";

type Props = {
  header: Header<Student, unknown>;
};

export function TableFooterCell({ header }: Props) {
  return (
    <td colSpan={header.colSpan}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.footer, header.getContext())}
    </td>
  );
}
