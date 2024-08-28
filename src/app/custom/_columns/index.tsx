import { createColumnHelper } from "@tanstack/react-table";

import { Checkbox } from "@/app/_components/";

export type RowData = {
  no: number;
  lastName: string;
  firstName: string;
  age: number;
  score: number;
  gender: string;
};

const columnHelper = createColumnHelper<RowData>();

export const columns = [
  columnHelper.display({
    id: "select",
    enableHiding: false,
    // All Check
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      );
    },
    // Per Cell Check
    cell: ({ row }) => {
      // ここでrow.originalを使用する場合、RowDataの型チェックが適用される
      // const age = row.original.age; // OK: ageはRowDataに存在する
      // const invalid = row.original.invalid; // エラー: invalidはRowDataに存在しない
      return (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      );
    },
  }),
  columnHelper.accessor("no", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    cell: (info) => info.getValue(),
    footer: "苗字",
    enableSorting: false,
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    cell: (info) => info.getValue(),
    footer: "名前",
    enableSorting: false,
  }),
  columnHelper.accessor("age", {
    header: "Age",
    cell: (info) => <i>{info.getValue()} 歳</i>,
    footer: "年齢",
  }),

  columnHelper.accessor("score", {
    header: "Score",
    cell: (info) => <i>{info.getValue()} 点</i>,
    footer: "点数",
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => {
      const _value = info.getValue();
      const _className =
        _value === "男性" ? "male" : _value === "女性" ? "female" : "";
      return <span className={_className}>{_value}</span>;
    },
    footer: "性別",
  }),
];
