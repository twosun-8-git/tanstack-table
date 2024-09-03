"use client";

import { ColumnResizeMode } from "@tanstack/react-table";

type Props = {
  mode: ColumnResizeMode;
  changeMode: (value: ColumnResizeMode) => void;
};

export function ColumnResizeSetting({ mode, changeMode }: Props) {
  return (
    <div className="column-controller__inner">
      <p>カラムのリサイズモード</p>
      <ul>
        <li>
          <label>
            <span>モード</span>
            <select
              value={mode}
              onChange={(e) => changeMode(e.target.value as ColumnResizeMode)}
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
