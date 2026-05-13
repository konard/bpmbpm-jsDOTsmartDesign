import { dotLabel, graphHeader, nodeId, rankBlock } from "./dot-utils.js";

// Comindware Platform BCD.
// Источник: https://kb.comindware.ru/ (раздел "Моделирование. Бизнес-способности").
// Особенности палитры Comindware:
//   - Способность (Capability) - прямоугольник с тремя уровнями вложенности
//     (L1, L2, L3). В DOT мы эмулируем это через style="filled" с разной
//     заливкой по индексу строки таблицы.
//   - Ответственный (Owner) - не самостоятельный узел, а атрибут
//     способности, выводится подписью внутри блока ("owner: ...").
//   - Связи между способностями - сплошная стрелка decomposition (часть-целое).
//   - В отличие от OSP BCD здесь нет ресурсов/продуктов как отдельных
//     узлов; вход/выход просто перечислены в комментарии способности.
// Это сознательное упрощение Comindware: BCD-карта рассматривается
// как иерархия способностей предприятия без потоков и времени.

const LEVEL_PALETTE = [
  { color: "#1A237E", fill: "#C5CAE9" },
  { color: "#283593", fill: "#9FA8DA" },
  { color: "#3949AB", fill: "#7986CB" },
  { color: "#5C6BC0", fill: "#9FA8DA" }
];

export const comindwareBcd = {
  id: "comindware-bcd",
  name: "Comindware BCD",
  description: "BCD по Comindware Platform: иерархия бизнес-способностей с ответственным внутри блока и сплошными стрелками декомпозиции. Ресурсы и продукты в палитре Comindware не предусмотрены - только структура способностей.",
  documentationFields: ["type", "name", "role", "comment"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("ComindwareBCD", "Comindware BCD: иерархия способностей", { rankdir: "LR", nodesep: 0.7, ranksep: 0.6 });
    const workIds = [];
    rows.forEach((row, index) => {
      const [type, name, , , role, , comment] = row;
      const id = nodeId(`cap_${index}_${name}`);
      if (type === "event") {
        // События в Comindware BCD не моделируются; помечаем как заметку.
        lines.push(`  ${id} [shape="note", style="filled", fillcolor="#FAFAFA", color="#9E9E9E", label="${dotLabel(name + " (вне BCD)")}"];`);
        workIds.push(id);
      } else {
        const palette = LEVEL_PALETTE[index % LEVEL_PALETTE.length];
        const labelParts = [name];
        if (role) labelParts.push(`Ответственный: ${role}`);
        if (comment) labelParts.push(`Прим.: ${comment}`);
        const compoundLabel = labelParts.join("\\n");
        lines.push(`  ${id} [shape="box", style="rounded,filled", color="${palette.color}", fillcolor="${palette.fill}", label="${dotLabel(compoundLabel)}"];`);
        workIds.push(id);
      }
      if (index > 0) {
        const prev = nodeId(`cap_${index - 1}_${rows[index - 1][1]}`);
        // decomposition: сплошная стрелка между уровнями способностей.
        lines.push(`  ${prev}:e -> ${id}:w [arrowhead=normal, label="decomposition", color="#1A237E"];`);
      }
    });
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    lines.push("}");
    return lines.join("\n");
  }
};
