import { dotLabel, graphHeader, nodeId, technicalEventNode } from "./dot-utils.js";

export const bcdVad = {
  id: "bcd-vad",
  name: "BCD VAD",
  supportsEvents: false,
  description: "Диаграмма бизнес-способностей: вместо процесса акцентирует устойчивые способности организации и их зависимости.",
  buildDot(rows) {
    const lines = graphHeader("BcdVAD", "BCD VAD: диаграмма бизнес-способностей", "TB");
    rows.forEach((row, index) => {
      const [type, name, input, output, role] = row;
      const id = nodeId(`cap_${index}_${name}`);
      if (type === "event") {
        lines.push(technicalEventNode(id, name));
      } else {
        lines.push(`  ${id} [shape="rect", style="rounded,filled", fillcolor="#D7ECFF", color="#0D47A1", label="${dotLabel(name)}"];`);
        if (role) lines.push(`  ${nodeId(`${id}_${role}`)} [shape="ellipse", style="filled", fillcolor="#FFF8E1", label="${dotLabel(role)}"];`);
        if (role) lines.push(`  ${id} -> ${nodeId(`${id}_${role}`)} [style="dashed", arrowhead=none, label="ответственность"];`);
        if (input) lines.push(`  ${nodeId(input)} [shape="folder", style="filled", fillcolor="#ECEFF1", label="${dotLabel(input)}"];`);
        if (input) lines.push(`  ${nodeId(input)} -> ${id} [style="dotted", label="вход"];`);
        if (output) lines.push(`  ${nodeId(output)} [shape="folder", style="filled", fillcolor="#ECEFF1", label="${dotLabel(output)}"];`);
        if (output) lines.push(`  ${id} -> ${nodeId(output)} [style="dotted", label="выход"];`);
      }
      if (index > 0) lines.push(`  ${nodeId(`cap_${index - 1}_${rows[index - 1][1]}`)} -> ${id} [arrowhead=vee, label="зависимость"];`);
    });
    lines.push("}");
    return lines.join("\n");
  }
};
