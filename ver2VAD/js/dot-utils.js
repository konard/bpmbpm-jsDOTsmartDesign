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

export function graphHeader(name, label, rankdir = "LR") {
  return [
    `digraph ${name} {`,
    `  rankdir=${rankdir};`,
    '  graph [fontname="Arial", labelloc="t", fontsize=16];',
    '  node [fontname="Arial", fontsize=11];',
    '  edge [fontname="Arial", fontsize=10];',
    `  label="${dotLabel(label)}";`
  ];
}

export function technicalEventNode(id, label) {
  return `  ${id} [shape="point", fixedsize=true, height=0.06, width=0.06, label="", tooltip="${dotLabel(label)}"];`;
}
