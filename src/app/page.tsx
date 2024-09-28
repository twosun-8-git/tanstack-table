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
          <Link href="./functional">/functional</Link>
        </dt>
        <dd>TanStack Table の様々な機能を追加。カラム構造はフラット。</dd>
      </dl>
      <dl>
        <dt>
          <Link href="./pagination-server-side">/pagination-server-side</Link>
        </dt>
        <dd>サーバーサイドページネーションを実装したテーブル</dd>
      </dl>
      <dl>
        <dt>
          <Link href="./virtualization">/virtualization</Link>
        </dt>
        <dd>仮想化を実装したテーブル</dd>
      </dl>
    </div>
  );
}
