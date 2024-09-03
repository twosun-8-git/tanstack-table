"use client";

import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

export function Pagination<T>({ table }: Props<T>) {
  const pageCount = table.getPageCount();
  const rowLength = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="pagination">
      <div className="pagination__block status">
        <div>
          <span>
            <b>
              {pageIndex + 1} /&nbsp;
              {pageCount}&nbsp;
            </b>
            ページ
          </span>
        </div>
        <div>
          <span>
            （&nbsp;{rowLength} 件中&nbsp;
            {pageIndex * pageSize + 1}
            &nbsp;-&nbsp;
            {Math.min((pageIndex + 1) * pageSize, rowLength)}
            &nbsp;件を表示&nbsp;）
          </span>
        </div>
      </div>
      <div className="pagination__block">
        <span>ページ移動</span>
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            if (page >= 0 && page < pageCount) {
              table.setPageIndex(page);
            }
          }}
          min={1}
          max={pageCount}
        />
      </div>
      <div className="pagination__block">
        <span>表示件数</span>
        <select
          value={pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 15, 20, 25].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <ul className="pagination__list">
        <li>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            &lt;&lt;
          </button>
        </li>
        <li>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lt;
          </button>
        </li>
        <li>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            &gt;
          </button>
        </li>
        <li>
          <button
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            &gt;&gt;
          </button>
        </li>
      </ul>
    </div>
  );
}
