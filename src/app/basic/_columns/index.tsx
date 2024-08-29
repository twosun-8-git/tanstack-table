import { createColumnHelper } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";

const columnHelper = createColumnHelper<Student>();

export const columns = [
  columnHelper.accessor("no", {
    header: "No",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    cell: (info) => info.getValue(),
    footer: "苗字",
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    cell: (info) => info.getValue(),
    footer: "名前",
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue(),
    footer: "性別",
  }),
  columnHelper.accessor("grade", {
    header: "Grade",
    cell: (info) => info.getValue(),
    footer: "学年",
  }),
  columnHelper.accessor("class", {
    header: "Class",
    cell: (info) => info.getValue(),
    footer: "組",
  }),
  columnHelper.accessor("lang", {
    header: "Langage",
    cell: (info) => info.getValue(),
    footer: "国語",
  }),
  columnHelper.accessor("arith", {
    header: "Arithmetic",
    cell: (info) => info.getValue(),
    footer: "算数",
  }),
  columnHelper.accessor("science", {
    header: "Science",
    cell: (info) => info.getValue(),
    footer: "理科",
  }),
];
