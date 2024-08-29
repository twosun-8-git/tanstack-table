import { createColumnHelper } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";

const columnHelper = createColumnHelper<Student>();

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
    header: "Person",
    footer: "生徒",
    columns: [
      columnHelper.display({
        id: "fullName",
        header: () => <b>Full Name</b>,
        cell: (info) => {
          const { firstName, lastName } = info.row.original;
          return `${lastName} ${firstName}`;
        },
      }),
      columnHelper.accessor("gender", {
        header: "Gender",
        cell: (info) => info.getValue(),
        footer: "性別",
      }),
    ],
  }),
  columnHelper.group({
    header: "Class",
    footer: "学年と組",
    columns: [
      columnHelper.accessor("grade", {
        header: "Grade",
        cell: (info) => `${info.getValue()} 年`,
        footer: "学年",
      }),
      columnHelper.accessor("class", {
        header: "Class",
        cell: (info) => `${info.getValue()} 組`,
        footer: "組",
      }),
    ],
  }),
  columnHelper.group({
    header: "Test",
    footer: "テスト",
    columns: [
      columnHelper.accessor("lang", {
        header: "Langage",
        cell: (info) => {
          const _className = info.getValue() <= 80 ? "red" : "";
          return <i className={_className}>{info.getValue()} 点</i>;
        },
        footer: "国語",
      }),
      columnHelper.accessor("arith", {
        header: "Arithmetic",
        cell: (info) => {
          const _className = info.getValue() <= 80 ? "red" : "";
          return <i className={_className}>{info.getValue()} 点</i>;
        },
        footer: "算数",
      }),
      columnHelper.accessor("science", {
        header: "Science",
        cell: (info) => {
          const _className = info.getValue() <= 80 ? "red" : "";
          return <i className={_className}>{info.getValue()} 点</i>;
        },
        footer: "理科",
      }),
    ],
  }),
  columnHelper.display({
    id: "total",
    header: "Total",
    cell: (info) => {
      const { lang, arith, science } = info.row.original;
      const _sum = lang + arith + science;
      return `${_sum} 点`;
    },
    footer: "合計",
  }),
  columnHelper.display({
    id: "average",
    header: "Average",
    cell: (info) => {
      const { lang, arith, science } = info.row.original;
      const _average = Math.floor((lang + arith + science) / 3);
      return `${_average} 点`;
    },
    footer: "平均",
  }),
];
