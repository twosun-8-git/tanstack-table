import type { Metadata } from "next";
import Link from "next/link";

import "./style.css";

export const metadata: Metadata = {
  title: "My TanStack Table",
  description: "TanStack Tableの使い方",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="wrapper">
          <header>
            <h1>
              <Link href="/">My TanStack Table</Link>
            </h1>
            <p>
              Headless UI &nbsp;
              <a href="https://tanstack.com/table/latest" target="_blank">
                &quot;TanStack Table&quot;
              </a>
              &nbsp;のサンプルです。
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
