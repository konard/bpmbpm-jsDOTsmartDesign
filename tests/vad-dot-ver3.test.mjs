import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  notations,
  defaultRows,
  buildGraphvizUrl,
  tableColumns,
  findNotation,
  applyColumnHighlight
} from "../ver3VAD/js/vad-app.js";

// Тестовые данные повторяют структуру колонок tableColumns:
// [type, name, input, output, role, system, comment, annotation].
const rows = [
  ["event", "Запрос клиента", "", "", "Клиент", "", "Триггер", ""],
  ["activity", "Принять заявку", "Заявка", "Проверенная заявка", "Офис", "CRM", "SLA приёма", ""],
  ["activity", "Выполнить услугу", "Проверенная заявка", "Результат", "Исполнитель", "ERP", "", ""],
  ["event", "Результат получен", "", "", "Клиент", "", "", ""]
];

test("ver3 exposes nine notations in expected order", () => {
  const ids = notations.map((notation) => notation.id);
  assert.equal(ids.length, 9);
  assert.deepEqual(ids, [
    "ver9d-vad",
    "aris-vad",
    "sila-vad",
    "businessstudio-vad",
    "bcd-vad",
    "osp-bcd",
    "comindware-bcd",
    "stormbpmn-bcd",
    "archimate-vad"
  ]);
});

test("every notation declares documentationFields and builds non-empty DOT", () => {
  for (const notation of notations) {
    assert.ok(Array.isArray(notation.documentationFields), `${notation.id}: documentationFields missing`);
    assert.ok(notation.documentationFields.length > 0, `${notation.id}: documentationFields empty`);
    const dot = notation.buildDot(rows);
    assert.match(dot, /^digraph /, `${notation.id}: missing digraph header`);
    assert.match(dot, /Принять/, `${notation.id}: missing process label`);
    assert.match(dot, /}$/, `${notation.id}: missing closing brace`);
  }
});

test("VAD chevron family uses cds (ver9d, ARIS, BusinessStudio); SILA uses component", () => {
  // По issue образец - cds-стрелки ver9d. ARIS и BusinessStudio следуют тому же
  // визуальному стилю. SILA Union сохраняет историческое отображение
  // операций через UML-компонент (shape="component") - см. analysis3.md.
  for (const id of ["ver9d-vad", "aris-vad", "businessstudio-vad"]) {
    const dot = findNotation(id).buildDot(rows);
    assert.match(dot, /shape="cds"/, `${id}: expected cds shape`);
  }
  const sila = findNotation("sila-vad").buildDot(rows);
  assert.match(sila, /shape="component"/, "sila-vad: expected component shape");
});

test("VAD-family notations enforce horizontal layout via rank=same", () => {
  // Ровно те нотации, что выстраивают процессы в один ряд:
  // ver9d, ARIS, SILA, BusinessStudio, Stormbpmn, ArchiMate (квази-VAD) и
  // даже BCD-варианты тоже используют rankdir=LR для устойчивого визуала.
  for (const notation of notations) {
    const dot = notation.buildDot(rows);
    assert.match(dot, /rankdir=LR/, `${notation.id}: expected rankdir=LR`);
  }
  for (const id of ["ver9d-vad", "aris-vad", "sila-vad", "businessstudio-vad"]) {
    const dot = findNotation(id).buildDot(rows);
    assert.match(dot, /rank=same/, `${id}: expected rank=same block`);
  }
});

test("OSP BCD never emits an inter-capability sequence/hasNext edge", () => {
  // Формальная подпись OSP BCD: только consumes / produces / is-part-of.
  const dot = findNotation("osp-bcd").buildDot(rows);
  assert.doesNotMatch(dot, /label="hasNext"/);
  assert.doesNotMatch(dot, /label="sequence flow"/);
  assert.doesNotMatch(dot, /label="depends on"/);
  // Прямой связи cap_*_* -> cap_*_* нет: между способностями только
  // consumes/produces (через папку) и is-part-of (к группе).
  assert.match(dot, /label="consumes"/);
  assert.match(dot, /label="produces"/);
  assert.match(dot, /label="is-part-of"/);
});

test("BCD-family notations declare events as out-of-scope (no event semantics)", () => {
  for (const id of ["bcd-vad", "osp-bcd", "comindware-bcd"]) {
    const notation = findNotation(id);
    assert.equal(notation.supportsEvents, false, `${id}: supportsEvents must be false`);
  }
});

test("BPMN-based Stormbpmn keeps sequence flow (this is the documented semantic conflict)", () => {
  // В analysis3.md этот пункт прямо отмечен как смысловой конфликт между
  // BPMN-палитрой и BCD-семантикой - тест фиксирует, что мы не пытаемся
  // скрыть это поведение.
  const dot = findNotation("stormbpmn-bcd").buildDot(rows);
  assert.match(dot, /label="sequence flow"/);
});

test("notations without event semantics render events as technical markers", () => {
  // Допустимы две формы: shape="point" (ver9d/aris/sila/bcd) или
  // shape="plaintext" (osp/businessstudio/comindware).
  const eventless = notations.filter((n) => !n.supportsEvents);
  assert.ok(eventless.length >= 7);
  for (const notation of eventless) {
    const dot = notation.buildDot(rows);
    assert.match(
      dot,
      /shape="point"|shape="plaintext"|shape="note"/,
      `${notation.id}: events must be rendered as technical marker`
    );
  }
});

test("GraphvizOnline URL is single-line and per-line encoded", () => {
  const dot = notations[0].buildDot(rows);
  const url = buildGraphvizUrl(dot);
  assert.ok(url.startsWith("https://dreampuf.github.io/GraphvizOnline/?engine=dot#"));
  assert.ok(url.includes("%0A"));
  assert.doesNotMatch(url, /\n/);
});

test("tableColumns expose key field used by column highlighting", () => {
  const keys = tableColumns.map((column) => column.key);
  assert.deepEqual(keys, [
    "type", "name", "input", "output", "role", "system", "comment", "annotation"
  ]);
  // Все ключи из documentationFields должны существовать как колонки.
  const allowed = new Set(keys);
  for (const notation of notations) {
    for (const field of notation.documentationFields) {
      assert.ok(allowed.has(field), `${notation.id}: unknown documentation field ${field}`);
    }
  }
});

test("applyColumnHighlight tags th/td cells with used/unused classes", () => {
  // Минимальный DOM-мок: спереди добавляем пустую "номерную" ячейку,
  // как это делает jexcel.
  const headerCells = ["#"].concat(tableColumns.map((c) => c.title)).map(makeCell);
  const bodyCells = ["1"].concat(tableColumns.map(() => "")).map(makeCell);
  const document = {
    querySelectorAll(selector) {
      if (selector.includes("thead")) return headerCells;
      if (selector.includes("tbody tr")) return [{ children: bodyCells }];
      return [];
    }
  };
  // OSP BCD не использует колонки system и annotation.
  applyColumnHighlight(document, findNotation("osp-bcd"));
  // Первая - номерная, её не трогаем.
  assert.equal(headerCells[0].classList.has("vad-col-used"), false);
  assert.equal(headerCells[0].classList.has("vad-col-unused"), false);
  // type / name / input / output / role / comment -> used.
  for (const idx of [1, 2, 3, 4, 5, 7]) {
    assert.ok(headerCells[idx].classList.has("vad-col-used"), `header[${idx}] should be used`);
  }
  // system (6) и annotation (8) -> unused.
  for (const idx of [6, 8]) {
    assert.ok(headerCells[idx].classList.has("vad-col-unused"), `header[${idx}] should be unused`);
  }
});

test("HTML entry points to ver3 documentation and legends", () => {
  const html = readFileSync(new URL("../ver3VAD/jsDOTsmartDesignVAD.html", import.meta.url), "utf8");
  assert.match(html, /notation\/all3\.md/);
  assert.match(html, /notation\/comparison3\.md/);
  assert.match(html, /notation\/analysis3\.md/);
  assert.match(html, /\.\/legends\//);
  assert.match(html, /vad-col-used/);
  assert.match(html, /vad-col-unused/);
});

test("defaultRows match the column layout (8 cells per row)", () => {
  for (const row of defaultRows) {
    assert.equal(row.length, tableColumns.length);
  }
});

function makeCell(value) {
  const classes = new Set();
  return {
    textContent: value,
    classList: {
      add(...names) { names.forEach((n) => classes.add(n)); },
      remove(...names) { names.forEach((n) => classes.delete(n)); },
      has(name) { return classes.has(name); }
    }
  };
}
