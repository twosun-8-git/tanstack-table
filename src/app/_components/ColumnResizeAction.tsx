import { ColumnResizeMode } from "@tanstack/react-table";

type Props = {
  columnResizeMode: ColumnResizeMode;
  changeColumnResizeMode: (mode: ColumnResizeMode) => void;
};

export function ColumnResizeAction({
  columnResizeMode,
  changeColumnResizeMode,
}: Props) {
  return (
    <div className="column-controller__inner">
      <p>カラムのリサイズモード</p>
      <ul>
        <li>
          <label>
            <span>モード</span>
            <select
              value={columnResizeMode}
              onChange={(e) =>
                changeColumnResizeMode(e.target.value as ColumnResizeMode)
              }
            >
              <option value="onChange">onChange</option>
              <option value="onEnd">On End</option>
            </select>
          </label>
        </li>
      </ul>
    </div>
  );
}
