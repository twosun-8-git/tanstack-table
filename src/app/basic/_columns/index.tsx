import { createColumnHelper } from "@tanstack/react-table";

import { Checkbox } from "@/app/_components/";

type Table = {
  no: number;
  lastName: string;
  firstName: string;
  age: number;
  score: number;
  gender: string;
};

const columnHelper = createColumnHelper<Table>();

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
  columnHelper.accessor("age", {
    header: "Age",
    cell: (info) => info.getValue(),
    footer: "年齢",
  }),

  columnHelper.accessor("score", {
    header: "Score",
    cell: (info) => info.getValue(),
    footer: "点数",
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue(),
    footer: "性別",
  }),

  // {
  //   accessorKey: "birth",
  //   header: "誕生日",
  //   cell: (info: any) => info.getValue(),
  // },
  // {
  //   accessorKey: "delete",
  //   header: "削除",
  //   cell: (info:any) => info.getValue(),
  //   enableHiding: true // カラムの表示/非表示をユーザーが切替できるか
  // },
];
