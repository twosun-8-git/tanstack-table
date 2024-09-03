import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

export function ColumnFilter<T>({ table }: Props<T>) {
  const getColumnFilterValue = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return "";
    return column.getFilterValue() as string;
  };

  const hanldeChangeColumnFilter = (
    e: React.ChangeEvent<HTMLSelectElement>,
    columnId: string
  ) => {
    const _value = e.target.value;
    const _column = table.getColumn(columnId);
    if (_column) {
      if (!_value) {
        _column.setFilterValue(undefined);
      } else if (!isNaN(Number(_value))) {
        _column.setFilterValue(Number(_value));
      } else {
        _column.setFilterValue(_value);
      }
    }
  };
  return (
    <div className="column-controller__inner">
      <p>カラムのフィルタリング</p>
      <ul>
        <li>
          <label>
            <span>性別</span>
            <select
              value={getColumnFilterValue("gender")}
              onChange={(e) => hanldeChangeColumnFilter(e, "gender")}
            >
              <option value="">全て</option>
              <option value="男子">男子</option>
              <option value="女子">女子</option>
            </select>
          </label>
        </li>
        <li>
          <label>
            <span>学年</span>
            <select
              value={getColumnFilterValue("grade")}
              onChange={(e) => hanldeChangeColumnFilter(e, "grade")}
            >
              <option value="">全て</option>
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}年
                </option>
              ))}
            </select>
          </label>
        </li>
        <li>
          <label>
            <span>クラス</span>
            <select
              value={getColumnFilterValue("class")}
              onChange={(e) => hanldeChangeColumnFilter(e, "class")}
            >
              <option value="">全て</option>
              {[1, 2, 3, 4].map((classNum) => (
                <option key={classNum} value={classNum}>
                  {classNum}組
                </option>
              ))}
            </select>
          </label>
        </li>
        <li>
          <label>
            <span>国語</span>
            <select
              value={getColumnFilterValue("lang")}
              onChange={(e) => hanldeChangeColumnFilter(e, "lang")}
            >
              <option value="">全て</option>
              <option value="50">50点以上</option>
              <option value="80">80点以上</option>
              <option value="90">90点以上</option>
              <option value="100">100点</option>
            </select>
          </label>
        </li>
        <li>
          <label>
            <span>算数</span>
            <select
              value={getColumnFilterValue("arith")}
              onChange={(e) => hanldeChangeColumnFilter(e, "arith")}
            >
              <option value="">全て</option>
              <option value="50">50点以上</option>
              <option value="80">80点以上</option>
              <option value="90">90点以上</option>
              <option value="100">100点</option>
            </select>
          </label>
        </li>
        <li>
          <label>
            <span>理科</span>
            <select
              value={getColumnFilterValue("science")}
              onChange={(e) => hanldeChangeColumnFilter(e, "science")}
            >
              <option value="">全て</option>
              <option value="50">50点以上</option>
              <option value="80">80点以上</option>
              <option value="90">90点以上</option>
              <option value="100">100点</option>
            </select>
          </label>
        </li>
      </ul>
    </div>
  );
}
