type Props = {
  value: string;
  handleChange: (value: string) => void;
};

export function Search({ value, handleChange }: Props) {
  return (
    <div className="search">
      <label>
        <span>グローバル検索</span>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="キーワード"
        />
      </label>
      <button type="button" onClick={() => handleChange("")}>
        クリア
      </button>
    </div>
  );
}
