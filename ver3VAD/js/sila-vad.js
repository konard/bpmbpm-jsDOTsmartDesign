import { collectArtifacts, dotLabel, graphHeader, nodeId, rankBlock, technicalEventNode } from "./dot-utils.js";

// SILA Union VAD.
// Источник: https://bpm3.ru/articles/modelirovanie-protsessov-v-notatsii-vad-v-sila-union/
// Похожа на классическую ARIS VAD, но регламентируется конкретной
// платформой: операция, документ, роль и информационная система.
// Используем тот же горизонтальный layout, что и для ARIS VAD, чтобы
// диаграмма читалась как поток операций "слева направо".

export const silaVad = {
  id: "sila-vad",
  name: "SILA Union VAD",
  description: "VAD по платформе SILA Union: операции, документы, роли и информационные системы, выстроенные в одну горизонтальную линию.",
  documentationFields: ["type", "name", "input", "output", "role", "system", "comment", "annotation"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("SilaVAD", "SILA Union VAD: цепочка операций");
    for (const doc of collectArtifacts(rows, 2, 3)) {
      lines.push(`  ${nodeId(doc)} [shape="note", style="filled", fillcolor="#F5F5F5", color="#9E9E9E", label="${dotLabel(doc)}"];`);
    }
    const workIds = [];
    const execIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system, comment] = row;
      const id = nodeId(`sila_${index}_${name}`);
      if (type === "event") {
        lines.push(technicalEventNode(id, name));
        workIds.push(id);
      } else {
        lines.push(`  ${id} [shape="component", style="filled", fillcolor="#E8F5E9", color="#2E7D32", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (input) lines.push(`  ${nodeId(input)} -> ${id} [style="dashed", arrowhead=vee, label="документ"];`);
        if (output) lines.push(`  ${id} -> ${nodeId(output)} [style="dashed", arrowhead=vee, label="результат"];`);
        if (role) {
          const rid = nodeId(`exec_${id}`);
          lines.push(`  ${rid} [shape="ellipse", style="filled", fillcolor="#FFF9C4", color="#B8860B", label="${dotLabel(role)}"];`);
          lines.push(`  ${id} -> ${rid} [arrowhead=none, label="исполнитель", style="dashed"];`);
          execIds.push(rid);
        }
        if (system) {
          const sid = nodeId(`sys_${id}`);
          lines.push(`  ${sid} [shape="box3d", style="filled", fillcolor="#BBDEFB", color="#0D47A1", label="${dotLabel(system)}"];`);
          lines.push(`  ${id} -> ${sid} [arrowhead=none, style="dotted", label="ИС"];`);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", fillcolor="#FFFDE7", color="#FBC02D", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`sila_${index - 1}_${rows[index - 1][1]}`);
        lines.push(`  ${prev}:e -> ${id}:w [weight=3, arrowhead=vee, color="#2E7D32"];`);
      }
    });
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    const execRank = rankBlock(execIds);
    if (execRank) lines.push(execRank);
    lines.push("}");
    return lines.join("\n");
  }
};
