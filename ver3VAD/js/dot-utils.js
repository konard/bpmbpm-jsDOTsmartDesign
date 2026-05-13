// Общие утилиты построения DOT для всех ver3VAD-нотаций.
// Версия ver3 опирается на горизонтальный стиль "цепочки ценности" из
// https://github.com/bpmbpm/rdf-grapher/blob/main/ver9d/.
// Особенности относительно ver2VAD:
//   - rankdir = LR по умолчанию (ARIS VAD "вытянут" в горизонтальную линию);
//   - блок процессов выстраивается в один rank (rank=same), что убирает
//     многоэтажный лесенчатый layout, который автоматически выбирал dot;
//   - роли (ExecutorGroup) выстраиваются вторым горизонтальным рядом и
//     соединяются с процессами тонкими пунктирными линиями;
//   - артефакты (входы/выходы) рендерятся над основной цепочкой
//     процессов через невидимые рёбра, чтобы не ломать выравнивание.

export function nodeId(value, fallback = "node") {
  const source = String(value || fallback).trim() || fallback;
  return source
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/giu, "_")
    .replace(/^_+|_+$/g, "") || fallback;
}

export function dotLabel(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\s+/g, "\\n");
}

export function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function collectArtifacts(rows, inputIndex, outputIndex) {
  return unique(rows.flatMap((row) => [row[inputIndex], row[outputIndex]]));
}

export function graphHeader(name, label, options = {}) {
  const {
    rankdir = "LR",
    splines = "spline",
    nodesep = 0.6,
    ranksep = 0.5
  } = options;
  return [
    `digraph ${name} {`,
    `  rankdir=${rankdir};`,
    `  splines=${splines};`,
    `  nodesep=${nodesep};`,
    `  ranksep=${ranksep};`,
    '  graph [fontname="Arial", labelloc="t", fontsize=16];',
    '  node [fontname="Arial", fontsize=11];',
    '  edge [fontname="Arial", fontsize=10];',
    `  label="${dotLabel(label)}";`
  ];
}

export function technicalEventNode(id, label) {
  return `  ${id} [shape="point", fixedsize=true, height=0.08, width=0.08, label="", tooltip="${dotLabel(label)}"];`;
}

// Возвращает блок DOT с инструкциями rank=same. Используется, чтобы все
// рабочие узлы выстроились в одну горизонтальную линию, а группы
// исполнителей - в параллельный ряд ниже.
export function rankBlock(ids) {
  if (!ids || !ids.length) return null;
  return `  { rank=same; ${ids.join("; ")}; }`;
}
