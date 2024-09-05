import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";
import { Checkbox } from "@/app/_components";

const columnHelper = createColumnHelper<Student>();

const gteFilter: FilterFn<Student> = (row, columnId, filterValue) => {
  if (filterValue === "") return true;
  const _rowValue = row.getValue(columnId) as number;
  return _rowValue >= Number(filterValue);
};

/** Column Options（ 指定されていない場合はテーブルのオプションの値に従う ）
 * enableColumnFilter: カラムのフィルタリング（ default: true）
 * enableGlobalFilter: カラムのフグローバルフィルタリング（ default: true）
 * enableHiding: カラムの表示・非表示機能（ default: true）
 * enableSorting: カラムのソート（ default: true）
 * enableMultiSort: カラムのマルチソート（ default: true）
 * enablePinning: カラムのピン留め（ default: true）
 * enableResizing: カラムのリサイズ（ default: true）
 * enableGrouping: カラムのグルーピング（ default: true）
 */

/** Accessor Column だけが実データを扱っているので検索対象になる */

export const columns = [
  columnHelper.display({
    id: "expander",
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() && (
        <div className={`expander ${row.getIsExpanded() ? "is-active" : ""}`}>
          <button
            type="button"
            onClick={() => {
              row.getToggleExpandedHandler();
            }}
          >
            {row.getIsExpanded() ? "✖" : "+"}
          </button>
        </div>
      ),
    enableHiding: false,
    enableSorting: false,
    enablePinning: false,
    enableResizing: false,
    size: 48,
  }),
  columnHelper.display({
    id: "pin",
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
    enableSorting: false,
    enableResizing: false,
    size: 60,
  }),
  columnHelper.display({
    id: "checkbox",
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
    size: 50,
  }),
  columnHelper.accessor("no", {
    header: "No",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id.toUpperCase(),
    enableResizing: false,
    enablePinning: false,
    size: 60,
  }),
  columnHelper.display({
    id: "fullName",
    meta: "フルネーム",
    header: () => <b>Full Name</b>,
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return `${lastName} ${firstName}`;
    },
    footer: "フルネーム",
    size: 200,
    minSize: 100,
    maxSize: 300,
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
    size: 120,
    minSize: 100,
    maxSize: 120,
  }),
  columnHelper.accessor("grade", {
    header: "Grade",
    meta: "学年",
    cell: (info) => `${info.getValue()} 年`,
    footer: "学年",
    filterFn: "equals",
    size: 120,
    minSize: 100,
    maxSize: 120,
  }),
  columnHelper.accessor("class", {
    header: "Class",
    meta: "組",
    cell: (info) => `${info.getValue()} 組`,
    footer: "組",
    filterFn: "equals",
    enablePinning: false,
    size: 120,
    minSize: 100,
    maxSize: 120,
  }),
  columnHelper.accessor("lang", {
    header: "Language",
    meta: "国語",
    cell: (info) => `${info.getValue()} 点`,
    footer: "国語",
    filterFn: gteFilter,
    size: 150,
    minSize: 130,
    maxSize: 150,
  }),
  columnHelper.accessor("arith", {
    header: "Arithmetic",
    meta: "算数",
    cell: (info) => `${info.getValue()} 点`,
    footer: "算数",
    filterFn: gteFilter,
    size: 150,
    minSize: 130,
    maxSize: 150,
  }),
  columnHelper.accessor("science", {
    header: "Science",
    meta: "理科",
    cell: (info) => `${info.getValue()} 点`,
    footer: "理科",
    filterFn: gteFilter,
    size: 150,
    minSize: 130,
    maxSize: 150,
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
    size: 100,
    minSize: 80,
    maxSize: 120,
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
    size: 100,
    minSize: 80,
    maxSize: 120,
  }),
];
