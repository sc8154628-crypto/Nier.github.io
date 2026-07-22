# NierZooM v3 — 進度說明與可優化清單

_檢視日期：2026-07-22　範圍：`NierZooM-v3/` 資料夾內全部檔案_

## 2026-07-22 更新

- 新增原生 `LineSidebar` 全站主導覽，整合 Works／About／Contact，包含游標接近效果、目前頁面狀態與行動版底部導覽。
- 既有右側作品／章節索引改為可鍵盤操作的 `<button>`，並補上全站 `:focus-visible`。
- 首頁與 About 頁補上 description、Open Graph 與 Twitter Card 基礎中繼資料。
- 補上圖片載入失敗的 placeholder，並針對動態插入內容加入 HTML 跳脫與外部網址協定檢查。
- About 數據改由 `portfolio-data.js` 自動計算，避免作品數、分類數與網站作品數失去同步。
- 新增 `prefers-reduced-motion` 樣式與平滑捲動降級，無 GSAP 時 header 捲動狀態仍可正常運作。
- 驗證完成：所有 JavaScript 通過 `node --check`，兩頁無重複 ID 或失效頁內錨點。
- 全站 `8–14 px` 的小型介面文字提高 `2 px`，涵蓋導覽、標籤、年份、按鈕與頁尾資訊。
- 非 SEO 優化持續進行：移除常駐 `will-change`、改用原生區段觀察器追蹤右側索引、改善 reduced-motion 與字型交換載入。

---

## 一、目前進度說明

這是一個 **lokasasmita 風格的個人作品集網站**，深色極簡、編號式陳列、GSAP 捲動動畫。整體完成度已相當高，屬於「可上線但仍有細節待補」的階段。

### 檔案結構

| 檔案 | 行數 | 角色 |
|---|---|---|
| `index.html` | 88 | 首頁（作品陳列）骨架 |
| `about.html` | 334 | 關於頁（Hero／介紹／數據／能力／歷程／聯絡） |
| `styles.css` | 789 | 共用樣式（變數、header、footer、作品區、LineSidebar） |
| `about.css` | 512 | 關於頁專屬樣式 |
| `app.js` | 384 | 首頁邏輯：資料合併、DOM 生成、GSAP 動畫 |
| `about.js` | 253 | 關於頁邏輯：動態數據、數字滾動、側欄、捲動動畫 |
| `line-sidebar.js` | 86 | 全站左側主導覽接近效果與目前頁面狀態 |
| `src/data/portfolio-data.js` | 578 | 資料來源：14 筆 Behance + 3 筆網站作品 |

### 已完成、且做得不錯的部分

- **資料驅動的首頁**：`app.js` 從 `portfolio-data.js` 讀取 17 筆作品自動生成區塊、側欄與 hero 計數，新增作品只需改資料檔。
- **動畫降級處理完整**：兩支 JS 都有 `prefers-reduced-motion` 與「無 GSAP」的 fallback，會直接把元素設為可見，不會因動畫失效而空白。
- **中英標題轉換**：`toEnglishTitle()` 用對照表 + 正則，把中文混合標題轉成乾淨英文標題。
- **視覺細節**：依主色亮度自動壓暗色塊（`luminance > 0.72`）、圖片視差、浮水印編號、捲動 header 縮放，質感一致。
- **響應式**：860px／540px 兩段斷點，行動版隱藏側欄、重排作品卡。
- **圖片效能**：`loading="lazy"` + `decoding="async"`，本地圖使用 `.webp`。

### 資料現況

- Behance 作品 14 筆，年份 2021–2025，涵蓋 Graphic / Web / Brand / Packaging / Photography / Visual。
- 網站作品 3 筆（Greattop、Matsuo、Hikariro），皆 2026。
- Hero 計數與 About 頁「17 Projects」一致。

---

## 二、需要注意的問題（建議先處理）

### 1. 外部依賴不在此資料夾內 — 需確認路徑
`index.html` / `about.html` 都引用了上一層目錄的檔案：

```
../vendor/gsap.min.js
../vendor/ScrollTrigger.min.js
../assets/images/behance/...
../assets/images/web-works/...
```

此資料夾（`NierZooM-v3`）內**沒有** `vendor/` 或 `assets/`，它們預期位於 `Website/vendor` 與 `Website/assets`。請確認這兩個資料夾實際存在，否則整站會「無圖 + 無動畫」。建議：把此網站當作獨立可部署單位時，將 `vendor` 與 `assets` 複製進 `NierZooM-v3/`，改成相對本頁的路徑，避免上線後破圖。

### 2. 側欄無鍵盤／無障礙支援
側欄項目是 `<li>` + JS `click`，無 `tabindex`、非 `<button>`，鍵盤與螢幕閱讀器都無法操作。全站也**完全沒有 `:focus` 樣式**（`grep` 結果為 0）。鍵盤使用者看不到目前焦點位置。

### 3. 缺 SEO / 分享 meta
兩頁都**沒有** `meta description`、Open Graph、Twitter Card、favicon、canonical。作品集分享到社群時不會有預覽圖與描述，Google 也抓不到摘要。

### 4. `.proj-img-placeholder` 有引用但無樣式
`app.js` 在無圖時會插入 `<div class="proj-img-placeholder">`，但 CSS 未定義此 class。目前所有作品都有封面故不會觸發，但屬於「隱藏的破口」。

### 5. 首頁與關於頁的「Contact」行為不一致
`index.html` 的 Contact 連到 `mailto:`，`about.html` 的 Contact 連到 `#v3-contact`（頁內錨點）。首頁沒有聯絡區塊，體驗略不一致。

---

## 三、可優化部分（依效益排序）

### 高效益

1. **補上 SEO / OG meta 與 favicon**：每頁加 description、og:title/description/image、favicon。成本低、對外曝光效益大。
2. **側欄改為 `<button>` 並加 `:focus-visible` 樣式**：一次解決鍵盤操作與焦點可見性，符合基本無障礙。
3. **確認並收斂資源路徑**：把 `vendor`、`assets` 納入本專案或明確固定相對路徑，讓 `NierZooM-v3` 可獨立部署。

### 中效益

4. **About 頁數字改為資料驅動**：`17 Projects`、`3 Web`、`6 Categories` 目前寫死在 HTML。可由 `portfolio-data.js` 計算（實際不重複類別為 8 種，與寫死的「6」不符）。避免日後改資料忘了同步。
5. **共用程式碼抽離**：`prefersReducedMotion`、`hasGsap`、header 捲動、側欄邏輯在兩支 JS 重複。可抽成 `common.js` 減少維護成本。
6. **innerHTML 生成改為安全建構**：`buildProjects()` 以字串拼接 `title`、`linkUrl` 等注入 `innerHTML`。目前資料來源可信風險低，但改用 `textContent` / `createElement` 更穩健。
7. **圖片加 `width`/`height` 或 `aspect-ratio`**：避免載入時版面位移（CLS），提升 Core Web Vitals。

### 低效益（打磨）

8. **字型權重精簡**：Barlow 目前載入多個字重（200/300/400/700/900 + italic）。移除實際未用的可省下載量。
9. **資料清理**：`portfolio-data.js` 每筆都殘留 Behance 的 `details`（Privacy/Community/Cookie… 導覽字串），並未使用，可刪除縮小檔案。Matsuo、Hikariro 的 `pageTitle` 為 `"Home -"`，屬抓取殘料。
10. **`will-change` 使用節制**：多處長駐 `will-change` 會佔記憶體，動畫結束後可移除。
11. **首頁補一個聯絡區塊**，與 About 頁行為一致。

---

## 四、建議的下一步（若要繼續推進）

1. 先確認 `vendor` / `assets` 路徑可用（否則其他都是空談）。
2. 補 SEO meta + favicon（30 分鐘內可完成）。
3. 修無障礙：側欄按鈕化 + 全站 focus 樣式。
4. About 數字改為動態計算。
5. 清理 `portfolio-data.js` 的殘留 `details`。

需要的話，我可以直接動手做其中任何一項（例如先補 SEO meta 或修無障礙）。
