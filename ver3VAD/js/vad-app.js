import { arisVad } from "./aris-vad.js";
import { ver9dVad } from "./ver9d-vad.js";
import { bcdVad } from "./bcd-vad.js";
import { ospBcd } from "./osp-bcd.js";
import { comindwareBcd } from "./comindware-bcd.js";
import { silaVad } from "./sila-vad.js";
import { businessStudioVad } from "./businessstudio-vad.js";
import { stormbpmnBcd } from "./stormbpmn-bcd.js";
import { archimateVad } from "./archimate-vad.js";

// Порядок нотаций фиксирован: сначала "образцовая" ver9d, затем
// традиционные VAD (ARIS, SILA, BusinessStudio), затем BCD-семейство
// (OSP, Comindware), затем "квази-VAD" по другим методологиям
// (Stormbpmn-BPMN, ArchiMate). Такой порядок облегчает сравнение в
// notation/comparison3.md.
export const notations = [
  ver9dVad,
  arisVad,
  silaVad,
  businessStudioVad,
  bcdVad,
  ospBcd,
  comindwareBcd,
  stormbpmnBcd,
  archimateVad
];

export const defaultRows = [
  ["event", "Потребность клиента", "", "", "Клиент", "", "Триггер обращения", "Комментарий к старту"],
  ["activity", "Принять обращение", "Заявка клиента", "Зарегистрированная заявка", "Офис продаж", "CRM", "Комментарий поясняет SLA приема", "Комментарий к работе"],
  ["activity", "Выполнить услугу", "Зарегистрированная заявка", "Результат услуги", "Исполнитель", "ERP", "", ""],
  ["activity", "Закрыть обращение", "Результат услуги", "Закрытая заявка", "Офис продаж", "CRM", "", ""],
  ["event", "Ценность получена", "", "", "Клиент", "", "", ""]
];

// Названия колонок таблицы привязаны к ключам в documentationFields:
//   type, name, input, output, role, system, comment, annotation.
// Это позволяет подсвечивать только те колонки, которые
// используются выбранной нотацией.
export const tableColumns = [
  { key: "type", type: "dropdown", title: "Тип / Event-Function", width: 160, source: ["event", "activity"] },
  { key: "name", type: "text", title: "Работа / Function / Capability / Process", width: 240 },
  { key: "input", type: "text", title: "Вход / Information object / Resource", width: 220 },
  { key: "output", type: "text", title: "Выход / Output / Product", width: 220 },
  { key: "role", type: "text", title: "Роль / Org unit / Owner / Group", width: 200 },
  { key: "system", type: "text", title: "Система / Application system", width: 180 },
  { key: "comment", type: "text", title: "Комментарий / Annotation", width: 220 },
  { key: "annotation", type: "text", title: "Связь с комментарием", width: 200 }
];

export function buildGraphvizUrl(dot) {
  return `https://dreampuf.github.io/GraphvizOnline/?engine=dot#${dot.split("\n").map(encodeURIComponent).join("%0A")}`;
}

export function findNotation(id) {
  return notations.find((notation) => notation.id === id) || notations[0];
}

// Подсветка колонок таблицы для выбранной нотации.
// Алгоритм: проходим по всем th в шапке jexcel; если у соответствующей
// колонки есть ключ из documentationFields - помечаем класс is-used,
// иначе is-unused. CSS-стили заданы в HTML.
export function applyColumnHighlight(document, notation) {
  const headers = document.querySelectorAll("#spreadsheet1 table thead tr td");
  const used = new Set(notation.documentationFields || []);
  headers.forEach((cell, index) => {
    if (index === 0) return; // первая колонка - номер строки jexcel
    const column = tableColumns[index - 1];
    if (!column) return;
    cell.classList.remove("vad-col-used", "vad-col-unused");
    cell.classList.add(used.has(column.key) ? "vad-col-used" : "vad-col-unused");
  });
  // Подсвечиваем также сами ячейки данных, чтобы пользователь видел,
  // какой столбец участвует в построении схемы.
  const bodyRows = document.querySelectorAll("#spreadsheet1 table tbody tr");
  bodyRows.forEach((row) => {
    Array.from(row.children).forEach((cell, index) => {
      if (index === 0) return;
      const column = tableColumns[index - 1];
      if (!column) return;
      cell.classList.remove("vad-col-used", "vad-col-unused");
      cell.classList.add(used.has(column.key) ? "vad-col-used" : "vad-col-unused");
    });
  });
}

export function mountVadApp({ document, jexcel, window }) {
  const notationSelect = document.getElementById("notation");
  const description = document.getElementById("notation-description");
  const dotOutput = document.getElementById("dot-output");
  const graphButton = document.getElementById("graph-button");

  notations.forEach((notation) => {
    const option = document.createElement("option");
    option.value = notation.id;
    option.textContent = notation.name;
    notationSelect.appendChild(option);
  });

  const table = jexcel(document.getElementById("spreadsheet1"), {
    data: defaultRows,
    columns: tableColumns.map(({ key, ...rest }) => rest)
  });

  function getRows() {
    return table.getData().filter((row) => row.some((cell) => String(cell || "").trim()));
  }

  function renderDot() {
    const notation = findNotation(notationSelect.value);
    description.textContent = notation.description;
    applyColumnHighlight(document, notation);
    const dot = notation.buildDot(getRows());
    dotOutput.value = dot;
    return dot;
  }

  notationSelect.addEventListener("change", renderDot);
  graphButton.addEventListener("click", () => window.open(buildGraphvizUrl(renderDot())));
  // Перерисовываем подсветку после правок таблицы (jexcel дорисовывает строки).
  document.getElementById("spreadsheet1").addEventListener("input", () => {
    const notation = findNotation(notationSelect.value);
    applyColumnHighlight(document, notation);
  });
  renderDot();
}
