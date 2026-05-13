import { dotLabel, graphHeader, nodeId, rankBlock, technicalEventNode } from "./dot-utils.js";

// BCD VAD (Business Capability Diagram), общая семантика.
// Базовая статья: https://www.osp.ru/os/2026/02/13060742
// Палитра минимальная: способность (capability), группа способностей,
// ресурс. Стрелки пунктирные (создание/потребление ресурса).
// Замечание: BCD - не временной поток, а карта устойчивых способностей.
// Поэтому здесь оставляем горизонтальный layout как у ver9d, но связь
// между способностями показывается как dependency, а не как hasNext.

export const bcdVad = {
  id: "bcd-vad",
  name: "BCD VAD (OSP / общая)",
  description: "Диаграмма бизнес-способностей по статье Открытые системы (osp.ru, 2026/02): акцент на устойчивых способностях, ресурсах-входах и продуктах-выходах. Стрелки потребления и создания - пунктирные.",
  documentationFields: ["type", "name", "input", "output", "role", "comment", "annotation"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("BcdVAD", "BCD VAD: карта бизнес-способностей (OSP)", { rankdir: "LR" });
    const workIds = [];
    const ownerIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, , comment] = row;
      const id = nodeId(`cap_${index}_${name}`);
      if (type === "event") {
        lines.push(technicalEventNode(id, name));
        workIds.push(id);
      } else {
        // Capability: скруглённый прямоугольник, синяя палитра.
        lines.push(`  ${id} [shape="rect", style="rounded,filled", fillcolor="#D7ECFF", color="#0D47A1", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (input) {
          // Ресурс на входе: пунктирная стрелка от ресурса к способности.
          lines.push(`  ${nodeId(input)} [shape="folder", style="filled", fillcolor="#ECEFF1", color="#90A4AE", label="${dotLabel(input)}"];`);
          lines.push(`  ${nodeId(input)} -> ${id} [style="dashed", arrowhead=vee, label="consumes"];`);
        }
        if (output) {
          // Продукт на выходе: пунктирная стрелка от способности к продукту.
          lines.push(`  ${nodeId(output)} [shape="folder", style="filled", fillcolor="#ECEFF1", color="#90A4AE", label="${dotLabel(output)}"];`);
          lines.push(`  ${id} -> ${nodeId(output)} [style="dashed", arrowhead=vee, label="produces"];`);
        }
        if (role) {
          const oid = nodeId(`owner_${id}`);
          lines.push(`  ${oid} [shape="ellipse", style="filled", fillcolor="#FFF8E1", color="#B8860B", label="${dotLabel(role)}"];`);
          lines.push(`  ${id} -> ${oid} [style="dashed", arrowhead=none, label="owns"];`);
          ownerIds.push(oid);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", fillcolor="#FFFDE7", color="#FBC02D", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`cap_${index - 1}_${rows[index - 1][1]}`);
        // dependsOn: зависимость между способностями.
        lines.push(`  ${prev} -> ${id} [arrowhead=vee, label="depends on", color="#1A237E"];`);
      }
    });
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    const ownerRank = rankBlock(ownerIds);
    if (ownerRank) lines.push(ownerRank);
    lines.push("}");
    return lines.join("\n");
  }
};
