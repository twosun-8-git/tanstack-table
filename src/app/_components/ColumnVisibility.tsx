import { Table } from "@tanstack/react-table";
import { Student } from "@/app/_rows/type";

type Props = {
  table: Table<Student>;
};

export function ColumnVisibility({ table }: Props) {
  return (
    <div className="column-controller__inner">
      <p>カラムの表示</p>
      <ul>
        <li>
          <label>
            <input
              type="checkbox"
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />
            All
          </label>
        </li>
        {table
          .getAllColumns()
          .filter((column) => column.columnDef.enableHiding !== false)
          .map((column) => (
            <li key={column.id}>
              <label>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {(column.columnDef.meta as string) || column.id}
              </label>
            </li>
          ))}
      </ul>
    </div>
  );
}
