import { createColumnHelper, FilterFn } from "@tanstack/react-table";

import { Student } from "@/app/_rows/type";
import { Checkbox } from "@/app/_components";
import { joinString, Sum, Average } from "@/app/_utils";

const columnHelper = createColumnHelper<Student>();

const gteFilter: FilterFn<Student> = (row, columnId, filterValue) => {
  if (filterValue === "") return true;
  const _rowValue = row.getValue(columnId) as number;
  return _rowValue >= Number(filterValue);
};

export const columns = [
  columnHelper.display({
    id: "expander",
    meta: {
      label: "展開ボタン",
    },
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() && (
        <div className={`expander ${row.getIsExpanded() ? "is-active" : ""}`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
          >
            {row.getIsExpanded() ? "✖" : "+"}
          </button>
        </div>
      ),
    size: 50,
  }),
  columnHelper.display({
    id: "pin",
    meta: {
      label: "ピンボタン",
      draggable: false,
    },
    header: "Pin",
    cell: ({ row }) =>
      row.getIsPinned() ? (
        <div className="pin">
          <button
            className="pin__reset"
            onClick={(e) => {
              e.stopPropagation();
              row.pin(false);
            }}
          >
            ✖
          </button>
        </div>
      ) : (
        <div className="pin">
          <button
            className="pin__top"
            onClick={(e) => {
              e.stopPropagation();
              row.pin("top");
            }}
          >
            ⬆️
          </button>
          <button
            className="pin__bottom"
            onClick={(e) => {
              e.stopPropagation();
              row.pin("bottom");
            }}
          >
            ⬇️
          </button>
        </div>
      ),
    enableHiding: false,
    size: 60,
  }),
  columnHelper.display({
    id: "checkbox",
    meta: {
      label: "チェックボックス",
    },
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
    size: 50,
  }),
  columnHelper.accessor("no", {
    meta: {
      label: "番号",
      draggable: false,
    },
    header: "No",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id.toUpperCase(),
    enableSorting: false,
    enablePinning: false,
    size: 80,
  }),
  columnHelper.display({
    id: "fullName",
    meta: {
      label: "フルネーム",
    },
    header: () => <b>Full Name</b>,
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return joinString(lastName, firstName);
    },
    footer: "フルネーム",
    enableResizing: false,
    enableGlobalFilter: true,
    size: 200,
    minSize: 100,
    maxSize: 300,
  }),
  columnHelper.accessor("gender", {
    meta: {
      label: "性別",
    },
    header: "Gender",
    cell: (info) => (
      <span className={info.getValue() === "男子" ? "male" : "female"}>
        {info.getValue()}
      </span>
    ),
    footer: "性別",
    filterFn: "equals",
    size: 120,
  }),
  columnHelper.accessor("grade", {
    meta: {
      label: "学年",
    },
    header: "Grade",
    cell: (info) => `${info.getValue()} 年`,
    footer: "学年",
    filterFn: "equals",
    size: 120,
  }),
  columnHelper.accessor("class", {
    meta: {
      label: "組",
    },
    header: "Class",
    cell: (info) => `${info.getValue()} 組`,
    footer: "組",
    filterFn: "equals",
    size: 100,
  }),
  columnHelper.accessor("lang", {
    meta: {
      label: "国語",
    },
    header: "Language",
    cell: (info) => `${info.getValue()} 点`,
    footer: "国語",
    filterFn: gteFilter,
    size: 150,
  }),
  columnHelper.accessor("arith", {
    meta: {
      label: "算数",
    },
    header: "Arithmetic",
    cell: (info) => `${info.getValue()} 点`,
    footer: "算数",
    filterFn: gteFilter,
    size: 150,
  }),
  columnHelper.accessor("science", {
    meta: {
      label: "理科",
    },
    header: "Science",
    cell: (info) => `${info.getValue()} 点`,
    footer: "理科",
    filterFn: gteFilter,
    size: 150,
  }),
  columnHelper.display({
    id: "total",
    meta: {
      label: "合計",
    },
    header: "Total",
    cell: (info) => {
      const { lang, arith, science } = info.row.original;
      return <b>{Sum(lang, arith, science)} 点</b>;
    },
    footer: "合計",
    size: 100,
  }),
  columnHelper.display({
    id: "average",
    meta: {
      label: "平均",
    },
    header: "Average",
    cell: (info) => {
      const { lang, arith, science } = info.row.original;
      return <i>{Average(lang, arith, science)} 点</i>;
    },
    footer: "平均",
    size: 100,
  }),
];
