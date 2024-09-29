# How to use Jotai

このリポジトリは Zenn の本（有料） **[「現場で使える TanStack Table」](https://zenn.dev/cocomina/books/tanstack-table)**
と連動したリポジトリです。

## 🛠️ 開発環境

- Node.js（ 18.20.4 ）
- React（ ^18 ）
- Next（ 14.2.7 ）
- @tanstack/react-table（ ^8.20.5 ）
- @tanstack/react-virtual ( ^3.10.0 )
- @dnd-kit/core: ( ^6.1.0" ),
- @dnd-kit/modifiers: ( ^7.0.0 ),
- @dnd-kit/sortable: ( ^8.0.0 ),
- @dnd-kit/utilities": ( ^3.2.2 ),

## 📁 ディレクトリ構成

| ディレクトリ名          | 説明                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- |
| /basic                  | TanStack Table の基本的な使い方                                                    |
| /column-types           | カラムの定義タイプ（Accessor Columns, Display Columns, Grouping Columns ）について |
| /functional             | TanStack Table の様々な機能を追加。カラム構造はフラット。                          |
| /pagination-server-side | サーバーサイドページネーションを実装したテーブル                                   |
| /pagination-server-side | 仮想化を実装したテーブル                                                           |

## 🛹 動作方法

#### 1. リポジトリをクローン

```
git clone https://github.com/twosun-8-git/tanstack-table
```

#### 2. モジュールをインストール

```
npm i
```

#### 3. 開発環境を起動

```
npm run dev
```

#### 4. http://localhost:3000 にアクセス
