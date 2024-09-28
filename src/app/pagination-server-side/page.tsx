"use client";

import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";

import { Post } from "./_type";
import { columns } from "./_columns";
import { Pagination } from "./_components/Pagination";

export default function Page() {
  const [data, setData] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (page: number, limit: number) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${
          page + 1
        }&_limit=${limit}`
      );
      // データ
      const result = await response.json();
      setData(result);

      // データの総数
      const total = Number(response.headers.get("X-Total-Count"));
      setTotalCount(total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { pageIndex, pageSize } = pagination;

  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const table = useReactTable<Post>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: totalCount,
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  return (
    <main>
      <div className="current">
        <span>Server-side Pagination</span>
      </div>
      <div className="grid">
        <div className="grid__header">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="grid__row">
              <div className="grid__row-content">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="grid__cell"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {isLoading ? (
          <div className="loader">
            <div className="loading"></div>
          </div>
        ) : (
          <div className="grid__body">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="grid__row">
                <div className="grid__row-content">
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="grid__cell"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination table={table} />
    </main>
  );
}
