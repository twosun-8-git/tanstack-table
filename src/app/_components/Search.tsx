type Props = {
  globalFilter: string | undefined;
  setGlobalFilter: (value: string) => void;
};

export function Search({ globalFilter, setGlobalFilter }: Props) {
  return (
    <div className="search">
      <label>
        <span>検索</span>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="キーワード"
        />
      </label>
      <button type="button" onClick={() => setGlobalFilter("")}>
        クリア
      </button>
    </div>
  );
}
