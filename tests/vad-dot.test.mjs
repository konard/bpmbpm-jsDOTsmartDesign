import test from "node:test";
import assert from "node:assert/strict";

import { notations, buildGraphvizUrl } from "../ver2VAD/js/vad-app.js";

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
