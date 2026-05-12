import { arisVad } from "./aris-vad.js";
import { bcdVad } from "./bcd-vad.js";
import { silaVad } from "./sila-vad.js";
import { stormbpmnBcd } from "./stormbpmn-bcd.js";
import { archimateVad } from "./archimate-vad.js";

export const notations = [arisVad, bcdVad, silaVad, stormbpmnBcd, archimateVad];

export const defaultRows = [
  ["event", "Потребность клиента", "", "", "Клиент", ""],
  ["activity", "Принять обращение", "Заявка клиента", "Зарегистрированная заявка", "Офис продаж", "CRM"],
  ["activity", "Выполнить услугу", "Зарегистрированная заявка", "Результат услуги", "Исполнитель", "ERP"],
  ["activity", "Закрыть обращение", "Результат услуги", "Закрытая заявка", "Офис продаж", "CRM"],
  ["event", "Ценность получена", "", "", "Клиент", ""]
];

export function buildGraphvizUrl(dot) {
  return `https://dreampuf.github.io/GraphvizOnline/?engine=dot#${dot.split("\n").map(encodeURIComponent).join("%0A")}`;
}

export function findNotation(id) {
  return notations.find((notation) => notation.id === id) || notations[0];
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
    columns: [
      { type: "dropdown", title: "Тип", width: 110, source: ["event", "activity"] },
      { type: "text", title: "Событие или работа", width: 270 },
      { type: "text", title: "Вход", width: 220 },
      { type: "text", title: "Выход", width: 220 },
      { type: "text", title: "Роль", width: 180 },
      { type: "text", title: "Система", width: 140 }
    ]
  });

  function getRows() {
    return table.getData().filter((row) => row.some((cell) => String(cell || "").trim()));
  }

  function renderDot() {
    const notation = findNotation(notationSelect.value);
    description.textContent = notation.description;
    const dot = notation.buildDot(getRows());
    dotOutput.value = dot;
    return dot;
  }

  notationSelect.addEventListener("change", renderDot);
  graphButton.addEventListener("click", () => window.open(buildGraphvizUrl(renderDot())));
  renderDot();
}
