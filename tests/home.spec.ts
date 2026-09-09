// specification(仕様)
// home.spec.ts
// 最初のページのテスト

// playwrightをインポートしている。
import { test, expect } from "@playwright/test";

// 第一引数にテスト名を指定している。
test("最初のページにアクセスする", async ({ page }) => {
  // ページにアクセスする。
  await page.goto("/");
  // ページのタイトルを確認する。
  await expect(page).toHaveTitle("最初のページ");
  // ページの見出しを確認する。
  await expect(page.getByRole("button", { name: "操作ボタン" })).toBeVisible();
});

/// これをCIに組み込むってことはコマンドを
// npx playwright test --ui を入れればいいってことかな？
