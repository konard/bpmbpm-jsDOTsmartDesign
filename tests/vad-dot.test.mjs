import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { notations, buildGraphvizUrl, tableColumns } from "../ver2VAD/js/vad-app.js";

const rows = [
  ["event", "Запрос клиента", "", "", "Клиент", ""],
  ["activity", "Принять заявку", "Заявка", "Проверенная заявка", "Офис", "CRM"],
  ["activity", "Выполнить услугу", "Проверенная заявка", "Результат", "Исполнитель", "ERP"],
  ["event", "Результат получен", "", "", "Клиент", ""]
];

test("all notation modules generate non-empty DOT with workflow edges", () => {
  for (const notation of notations) {
    const dot = notation.buildDot(rows);
    assert.match(dot, /^digraph /);
    assert.match(dot, /Принять/);
    assert.match(dot, /->/);
    assert.match(dot, /}/);
  }
});

test("notations without event semantics render events as technical points", () => {
  const withoutEvents = notations.filter((notation) => !notation.supportsEvents);
  assert.ok(withoutEvents.length > 0);

  for (const notation of withoutEvents) {
    const dot = notation.buildDot(rows);
    assert.match(dot, /shape="point"/);
  }
});

test("GraphvizOnline URL encodes DOT line by line", () => {
  const dot = notations[0].buildDot(rows);
  const url = buildGraphvizUrl(dot);
  assert.ok(url.startsWith("https://dreampuf.github.io/GraphvizOnline/?engine=dot#"));
  assert.ok(url.includes("%0A"));
  assert.doesNotMatch(url, /\n/);
});

test("VAD app exposes notation-aware table columns", () => {
  const titles = tableColumns.map((column) => column.title);
  assert.ok(titles.includes("Комментарий / Annotation / Comment"));
  assert.ok(titles.includes("Связь с комментарием / annotation"));
  assert.ok(titles.some((title) => title.includes("ARIS")));
  assert.ok(titles.some((title) => title.includes("BCD")));
  assert.ok(titles.some((title) => title.includes("ArchiMate")));
});

test("VAD app links to the detailed notation description", () => {
  const html = readFileSync(new URL("../ver2VAD/jsDOTsmartDesignVAD.html", import.meta.url), "utf8");
  assert.match(html, /notation\/all2\.md/);
});
