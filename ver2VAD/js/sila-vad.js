import { collectArtifacts, dotLabel, graphHeader, nodeId, technicalEventNode } from "./dot-utils.js";

export const silaVad = {
  id: "sila-vad",
  name: "SILA Union VAD",
  supportsEvents: false,
  description: "VAD-представление SILA Union: операции, документы, роли и информационные системы.",
  buildDot(rows) {
    const lines = graphHeader("SilaVAD", "SILA Union VAD");
    collectArtifacts(rows, 2, 3).forEach((doc) => lines.push(`  ${nodeId(doc)} [shape="note", style="filled", fillcolor="#F5F5F5", label="${dotLabel(doc)}"];`));
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system] = row;
      const id = nodeId(`sila_${index}_${name}`);
      if (type === "event") lines.push(technicalEventNode(id, name));
      else {
        lines.push(`  ${id} [shape="component", style="filled", fillcolor="#E8F5E9", label="${dotLabel(name)}"];`);
        if (input) lines.push(`  ${nodeId(input)} -> ${id} [style="dashed", label="документ"];`);
        if (output) lines.push(`  ${id} -> ${nodeId(output)} [style="dashed", label="результат"];`);
        if (role) lines.push(`  ${id} -> ${nodeId(`${id}_${role}`)} [arrowhead=none, label="исполнитель"];`);
        if (role) lines.push(`  ${nodeId(`${id}_${role}`)} [shape="ellipse", style="filled", fillcolor="#FFF9C4", label="${dotLabel(role)}"];`);
        if (system) lines.push(`  ${nodeId(`${id}_${system}`)} [shape="box3d", style="filled", fillcolor="#BBDEFB", label="${dotLabel(system)}"];`);
      }
      if (index > 0) lines.push(`  ${nodeId(`sila_${index - 1}_${rows[index - 1][1]}`)} -> ${id} [weight=3];`);
    });
    lines.push("}");
    return lines.join("\n");
  }
};
