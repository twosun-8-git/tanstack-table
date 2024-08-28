import { createColumnHelper } from "@tanstack/react-table";

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
    // All Check
    header: ({ table }) => {
      return (
        <div className="checkbox">
          <input type="checkbox" />
        </div>
      );
    },
    // Per Cell Check
    cell: ({ row }) => {
      // ここでrow.originalを使用する場合、RowDataの型チェックが適用される
      // const age = row.original.age; // OK: ageはRowDataに存在する
      // const invalid = row.original.invalid; // エラー: invalidはRowDataに存在しない
      return (
        <div className="checkbox">
          <input type="checkbox" />
        </div>
      );
    },
  }),
  columnHelper.accessor("no", {
    header: "No",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id.toUpperCase(),
  }),
  columnHelper.group({
    header: "Name Group",
    footer: "Name Group",
    columns: [
      columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => info.getValue(),
        footer: "名前",
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => info.getValue(),
        footer: "苗字",
      }),
      columnHelper.display({
        id: "formattedName",
        header: () => <b>Formatted Name</b>,
        cell: (info) => {
          const { firstName, lastName, gender } = info.row.original;
          const title =
            gender === "男性" ? "Mr." : gender === "女性" ? "Ms." : "";
          return `${title} ${lastName} ${firstName}`;
        },
      }),
    ],
  }),
  columnHelper.group({
    header: "Info Group",
    footer: "Info Group",
    columns: [
      columnHelper.accessor("age", {
        header: "Age",
        cell: (info) => info.getValue(),
        footer: "年齢",
      }),
      columnHelper.accessor("score", {
        header: "Score",
        cell: (info) => <i>{info.getValue()} 点</i>,
        footer: "点数",
      }),
      columnHelper.accessor("gender", {
        header: "Gender",
        cell: (info) => info.getValue(),
        footer: "性別",
      }),
    ],
  }),
];
