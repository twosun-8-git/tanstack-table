"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Photo } from "./_type";
import { columns } from "./_columns";

export default function Page() {
  const [data, setData] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos`
      );
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable<Photo>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 4,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <main>
      <div className="current">
        <span>Virtualization</span>
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
          <div
            className="grid__body"
            ref={parentRef}
            style={{
              height: "480px",
              overflow: "auto",
              position: "relative",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualRows.map((virtualRow, index) => {
                const row = rows[virtualRow.index];
                return (
                  <div
                    data-index={virtualRow.index}
                    ref={(node) => rowVirtualizer.measureElement(node)}
                    key={row.id}
                    className="grid__row"
                    style={{
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
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
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "16px",
          fontSize: "12px",
          marginTop: "16px",
        }}
      >
        <p>Total rows: {rows.length}</p>
        <p>Virtualized rows: {virtualRows.length}</p>
        <p>First visible row: {virtualRows[0]?.index + 1 || "N/A"}</p>
        <p>
          Last visible row:{" "}
          {virtualRows[virtualRows.length - 1]?.index + 1 || "N/A"}
        </p>
      </div>
    </main>
  );
}
