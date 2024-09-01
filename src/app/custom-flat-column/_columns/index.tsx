import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";
import { Checkbox } from "@/app/_components";

const columnHelper = createColumnHelper<Student>();

const gteFilter: FilterFn<Student> = (row, columnId, filterValue) => {
  if (filterValue === "") return true;
  const _rowValue = row.getValue(columnId) as number;
  return _rowValue >= Number(filterValue);
};

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
  }),
  columnHelper.accessor("no", {
    header: "No",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id.toUpperCase(),
    enableHiding: false,
    enableResizing: false,
  }),
  columnHelper.display({
    id: "fullName",
    meta: "名前",
    footer: "名前",
    header: () => <b>Full Name</b>,
    cell: (info) => {
      const { firstName, lastName } = info.row.original;
      return `${lastName} ${firstName}`;
    },
    enableSorting: false,
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    meta: "性別",
    cell: (info) => (
      <span className={info.getValue() === "男子" ? "male" : "female"}>
        {info.getValue()}
      </span>
    ),
    footer: "性別",
    filterFn: "equals",
    enableSorting: false,
  }),
  columnHelper.accessor("grade", {
    header: "Grade",
    meta: "学年",
    cell: (info) => `${info.getValue()} 年`,
    footer: "学年",
    filterFn: "equals",
  }),
  columnHelper.accessor("class", {
    header: "Class",
    meta: "組",
    cell: (info) => `${info.getValue()} 組`,
    footer: "組",
    filterFn: "equals",
  }),
  columnHelper.accessor("lang", {
    header: "Language",
    meta: "国語",
    cell: (info) => `${info.getValue()} 点`,
    footer: "国語",
    filterFn: gteFilter,
  }),
  columnHelper.accessor("arith", {
    header: "Arithmetic",
    meta: "算数",
    cell: (info) => `${info.getValue()} 点`,
    footer: "算数",
    filterFn: gteFilter,
  }),
  columnHelper.accessor("science", {
    header: "Science",
    meta: "理科",
    cell: (info) => `${info.getValue()} 点`,
    footer: "理科",
    filterFn: gteFilter,
  }),
  columnHelper.display({
    id: "total",
    header: "Total",
    meta: "合計",
    cell: (info) => {
      const { lang, arith, science } = info.row.original;
      const _sum = lang + arith + science;
      return <b>{_sum} 点</b>;
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
      return <i>{_average} 点</i>;
    },
    footer: "平均",
  }),
];
