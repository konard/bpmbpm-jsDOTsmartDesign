import { collectArtifacts, dotLabel, graphHeader, nodeId, technicalEventNode } from "./dot-utils.js";

export const arisVad = {
  id: "aris-vad",
  name: "ARIS VAD",
  supportsEvents: false,
  description: "Классическая VAD: цепочка функций верхнего уровня, организационные единицы и информационные объекты.",
  buildDot(rows) {
    const lines = graphHeader("ArisVAD", "ARIS VAD: верхнеуровочная цепочка создания ценности");
    for (const doc of collectArtifacts(rows, 2, 3)) {
      lines.push(`  ${nodeId(doc)} [shape="note", style="filled", fillcolor="WhiteSmoke", label="${dotLabel(doc)}"];`);
    }
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system] = row;
      const id = nodeId(`${index}_${name}`);
      if (type === "event") {
        lines.push(technicalEventNode(id, name));
      } else {
        lines.push(`  ${id} [shape="cds", width=1.6, style="filled", fillcolor="#C8E6C9", color="#1B5E20", label="${dotLabel(name)}"];`);
        if (input) lines.push(`  ${nodeId(input)} -> ${id} [style="dashed", tailport=e, headport=n, weight=1];`);
        if (output) lines.push(`  ${id} -> ${nodeId(output)} [style="dashed", tailport=e, headport=w, weight=1];`);
        if (role) {
          const rid = nodeId(`${id}_${role}`);
          lines.push(`  ${rid} [shape="ellipse", style="filled", fillcolor="#FFFFCC", color="#B8860B", label="${dotLabel(role)}"];`);
          lines.push(`  ${id} -> ${rid} [arrowhead=none, style="solid", tailport=s, headport=n];`);
        }
        if (system) {
          const sid = nodeId(`${id}_${system}`);
          lines.push(`  ${sid} [shape="box3d", style="filled", fillcolor="lightblue", label="${dotLabel(system)}"];`);
          lines.push(`  ${id} -> ${sid} [arrowhead=none, style="dotted"];`);
        }
      }
      if (index > 0) lines.push(`  ${nodeId(`${index - 1}_${rows[index - 1][1]}`)} -> ${id} [color="#2E7D32", arrowhead=vee, weight=3];`);
    });
    lines.push("}");
    return lines.join("\n");
  }
};
