import { createColumnHelper } from "@tanstack/react-table";

import { Post } from "../_type";

const columnHelper = createColumnHelper<Post>();

export const columns = [
  columnHelper.accessor("userId", {
    header: "userId",
    cell: (info) => info.getValue(),
    size: 72,
  }),
  columnHelper.accessor("id", {
    header: "id",
    cell: (info) => info.getValue(),
    size: 58,
  }),
  columnHelper.accessor("title", {
    header: "title",
    cell: (info) => info.getValue(),
    size: 300,
  }),
  columnHelper.accessor("body", {
    header: "body",
    cell: (info) => info.getValue(),
    size: 650,
  }),
];
