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
      return (
        <div className="checkbox">
          <input type="checkbox" />
        </div>
      );
    },
    enableHiding: false,
  }),
  columnHelper.accessor("no", {
    header: "No",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id.toUpperCase(),
    enableHiding: false,
  }),
  columnHelper.group({
    header: "Person",
    footer: "生徒",
    columns: [
      columnHelper.display({
        id: "fullName",
        meta: "名前",
        header: () => <b>Full Name</b>,
        cell: (info) => {
          const { firstName, lastName } = info.row.original;
          return `${lastName} ${firstName}`;
        },
      }),
      columnHelper.accessor("gender", {
        header: "Gender",
        meta: "性別",
        cell: (info) => {
          const _toggleClassName =
            info.getValue() === "男子" ? "male" : "female";
          return <span className={_toggleClassName}>{info.getValue()}</span>;
        },
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
        meta: "学年",
        cell: (info) => `${info.getValue()} 年`,
        footer: "学年",
      }),
      columnHelper.accessor("class", {
        header: "Class",
        meta: "組",
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
        meta: "国語",
        cell: (info) => {
          const _className = info.getValue() <= 80 ? "red" : "";
          return <i className={_className}>{info.getValue()} 点</i>;
        },
        footer: "国語",
      }),
      columnHelper.accessor("arith", {
        header: "Arithmetic",
        meta: "算数",
        cell: (info) => {
          const _className = info.getValue() <= 80 ? "red" : "";
          return <i className={_className}>{info.getValue()} 点</i>;
        },
        footer: "算数",
      }),
      columnHelper.accessor("science", {
        header: "Science",
        meta: "理科",
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
    meta: "合計",
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
    meta: "平均",
    cell: (info) => {
      const { lang, arith, science } = info.row.original;
      const _average = Math.floor((lang + arith + science) / 3);
      return `${_average} 点`;
    },
    footer: "平均",
  }),
];
