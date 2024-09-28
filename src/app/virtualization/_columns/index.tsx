import { createColumnHelper } from "@tanstack/react-table";

import { Photo } from "../_type";

const columnHelper = createColumnHelper<Photo>();

export const columns = [
  columnHelper.accessor("albumId", {
    header: "albumId",
    cell: (info) => info.getValue(),
    size: 88,
  }),
  columnHelper.accessor("id", {
    header: "id",
    cell: (info) => info.getValue(),
    size: 58,
  }),
  columnHelper.accessor("title", {
    header: "title",
    cell: (info) => info.getValue(),
    size: 446,
  }),
  columnHelper.accessor("url", {
    header: "url",
    cell: (info) => info.getValue(),
    size: 360,
  }),
  columnHelper.accessor("thumbnailUrl", {
    header: "thumbnailUrl",
    cell: (info) => (
      <img src={info.getValue()} width="40" height="40" alt="thumbnail" />
    ),
    size: 128,
  }),
];
