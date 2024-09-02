import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

export function ColumnVisibility<T>({ table }: Props<T>) {
  return (
    <div className="column-controller__inner visibility">
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
