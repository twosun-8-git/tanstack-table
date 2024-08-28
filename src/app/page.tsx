import Link from "next/link";
export default function Home() {
  return (
    <div className="nav">
      <dl>
        <dt>
          <Link href="./basic">/basic</Link>
        </dt>
        <dd>TanStack Table の基本的な使い方</dd>
      </dl>
      <dl>
        <dt>
          <Link href="./column-types">/column-types</Link>
        </dt>
        <dd>
          カラムの定義タイプ（Accessor Columns, Display Columns, Grouping
          Columns ）について
        </dd>
      </dl>
      <dl>
        <dt>
          <Link href="./custom">/custom</Link>
        </dt>
        <dd>TanStack Table の様々な機能を追加</dd>
      </dl>
    </div>
  );
}
