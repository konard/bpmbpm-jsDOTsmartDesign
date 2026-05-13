import { dotLabel, graphHeader, nodeId, rankBlock, technicalEventNode } from "./dot-utils.js";

// rdf-grapher ver9d (VAD basic ontology).
// Источник: https://github.com/bpmbpm/rdf-grapher/blob/main/ver9d/ontology/vad-basic-ontology.trig
// Семантика: TypeProcess - концепт процесса, ExecutorGroup - группа
// исполнителей, hasNext - порядок процессов, hasExecutor - связь
// процесса с группой исполнителей. Это VAD, ближайший к "образцовому"
// примеру из issue: горизонтальный поток cds-фигур с параллельным
// рядом эллипсов-исполнителей.

export const ver9dVad = {
  id: "ver9d-vad",
  name: "VAD ver9d (rdf-grapher)",
  description: "VAD по онтологии rdf-grapher/ver9d: TypeProcess, ExecutorGroup, предикаты hasNext и hasExecutor. Точный визуальный аналог 'Схемы t_p1' из ver9d.",
  documentationFields: ["type", "name", "role", "comment"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("Ver9dVAD", "VAD ver9d: цепочка TypeProcess + ExecutorGroup", { rankdir: "LR", nodesep: 0.8, ranksep: 0.3 });
    const workIds = [];
    const execIds = [];
    const colors = [
      { color: "#0D47A1", fill: "#64B5F6" },
      { color: "#1B5E20", fill: "#C8E6C9" },
      { color: "#0277BD", fill: "#81D4FA" },
      { color: "#33691E", fill: "#DCEDC8" }
    ];
    rows.forEach((row, index) => {
      const [type, name, , , role, , comment] = row;
      const id = nodeId(`vad_${index}_${name}`);
      if (type === "event") {
        // ver9d не работает с событиями: ставим технический маркер.
        lines.push(technicalEventNode(id, name));
        workIds.push(id);
      } else {
        const palette = colors[index % colors.length];
        // TypeProcess: cds-фигура, как vad_p1_1/vad_p1_2 в ver9d.
        lines.push(`  ${id} [shape="cds", height=0.8, width=1.5, style="filled", color="${palette.color}", fillcolor="${palette.fill}", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (role) {
          // ExecutorGroup: жёлто-золотой эллипс, vad:hasExecutor (dashed).
          const rid = nodeId(`exec_${id}`);
          lines.push(`  ${rid} [shape="ellipse", style="filled", color="#B8860B", fillcolor="#FFFFCC", label="${dotLabel(role)}"];`);
          lines.push(`  ${id} -> ${rid} [color="#1565C0", penwidth=1, style="dashed", arrowhead=none, weight=10];`);
          execIds.push(rid);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", color="#FBC02D", fillcolor="#FFFDE7", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`vad_${index - 1}_${rows[index - 1][1]}`);
        // vad:hasNext: горизонтальный поток East -> West.
        lines.push(`  ${prev}:e -> ${id}:w [color="#2E7D32", penwidth=1, style="solid", arrowhead=vee];`);
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
