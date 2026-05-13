import { collectArtifacts, dotLabel, graphHeader, nodeId, rankBlock, technicalEventNode } from "./dot-utils.js";

// ARIS VAD (Value-Added Chain Diagram).
// Источники:
//   - https://docs.aris.com/10.0.27.0/yay-method-reference/en/#/home/494393/en/1
//   - https://github.com/bpmbpm/rdf-grapher/blob/main/ver9d/
//
// Замечание из issue: ARIS VAD должен быть "вытянут" в горизонтальную
// линию процессов, реализующих добавленную стоимость. В ver3 это
// достигается комбинацией rankdir=LR и принудительным rank=same для
// рабочих узлов, что заставляет dot держать все cds-стрелки на одном
// уровне, а исполнителей выводить вторым параллельным рядом ниже.

export const arisVad = {
  id: "aris-vad",
  name: "ARIS VAD",
  description: "Классическая ARIS VAD: цепочка функций верхнего уровня, выстроенная горизонтально; исполнители и системы выводятся параллельным рядом ниже.",
  documentationFields: ["type", "name", "input", "output", "role", "system", "comment", "annotation"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("ArisVAD", "ARIS VAD: цепочка создания ценности (горизонтальная)");
    // 1. Документы (информационные объекты) - над линией процессов.
    for (const doc of collectArtifacts(rows, 2, 3)) {
      lines.push(`  ${nodeId(doc)} [shape="note", style="filled", fillcolor="WhiteSmoke", color="#9E9E9E", label="${dotLabel(doc)}"];`);
    }
    // 2. Сами рабочие узлы (Function в ARIS) и группы исполнителей.
    const workIds = [];
    const execIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system, comment] = row;
      const id = nodeId(`f_${index}_${name}`);
      if (type === "event") {
        // ARIS VAD не выделяет события как ключевой элемент: рисуем точку.
        lines.push(technicalEventNode(id, name));
        workIds.push(id);
      } else {
        // Функция: cds-стрелка с зелёной заливкой - повторяет стиль ver9d.
        lines.push(`  ${id} [shape="cds", width=1.6, height=0.8, style="filled", fillcolor="#C8E6C9", color="#1B5E20", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (input) {
          lines.push(`  ${nodeId(input)} -> ${id} [style="dashed", arrowhead=none, tailport=s, headport=n, weight=1];`);
        }
        if (output) {
          lines.push(`  ${id} -> ${nodeId(output)} [style="dashed", arrowhead=none, tailport=n, headport=s, weight=1];`);
        }
        if (role) {
          const rid = nodeId(`exec_${id}`);
          lines.push(`  ${rid} [shape="ellipse", style="filled", fillcolor="#FFFFCC", color="#B8860B", label="${dotLabel(role)}"];`);
          // Связь vad:hasExecutor по образцу ver9d.
          lines.push(`  ${id} -> ${rid} [color="#1565C0", penwidth=1, style="dashed", arrowhead=none, weight=10];`);
          execIds.push(rid);
        }
        if (system) {
          const sid = nodeId(`sys_${id}`);
          lines.push(`  ${sid} [shape="box3d", style="filled", fillcolor="lightblue", color="#0D47A1", label="${dotLabel(system)}"];`);
          lines.push(`  ${id} -> ${sid} [arrowhead=none, style="dotted"];`);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", fillcolor="#FFFDE7", color="#FBC02D", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`f_${index - 1}_${rows[index - 1][1]}`);
        // hasNext: видимое ребро между процессами в одном ранге.
        lines.push(`  ${prev}:e -> ${id}:w [color="#2E7D32", penwidth=1.4, arrowhead=vee, weight=3];`);
      }
    });
    // 3. Принудительное горизонтальное выравнивание.
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    const execRank = rankBlock(execIds);
    if (execRank) lines.push(execRank);
    lines.push("}");
    return lines.join("\n");
  }
};
