import { dotLabel, graphHeader, nodeId, technicalEventNode } from "./dot-utils.js";

export const stormbpmnBcd = {
  id: "stormbpmn-bcd",
  name: "Stormbpmn BCD через BPMN",
  supportsEvents: true,
  description: "BCD-подобная схема, собранная из палитры BPMN: события, задачи, дорожки ответственности и артефакты.",
  buildDot(rows) {
    const lines = graphHeader("StormBpmnBCD", "BCD на палитре BPMN");
    rows.forEach((row, index) => {
      const [type, name, input, output, role] = row;
      const id = nodeId(`bpmn_${index}_${name}`);
      if (type === "event") lines.push(`  ${id} [shape="circle", style="filled", fillcolor="#FFFFFF", color="#424242", label="${dotLabel(name)}"];`);
      else {
        lines.push(`  ${id} [shape="box", style="rounded,filled", fillcolor="#E3F2FD", label="${dotLabel(name)}"];`);
        if (role) lines.push(`  ${nodeId(`${id}_${role}`)} [shape="box", style="rounded,filled,dashed", fillcolor="#FFFDE7", label="${dotLabel(role)}"];`);
        if (role) lines.push(`  ${nodeId(`${id}_${role}`)} -> ${id} [style="dashed", arrowhead=none];`);
        if (input) lines.push(`  ${nodeId(input)} [shape="note", label="${dotLabel(input)}"];`);
        if (input) lines.push(`  ${nodeId(input)} -> ${id} [style="dotted"];`);
        if (output) lines.push(`  ${nodeId(output)} [shape="note", label="${dotLabel(output)}"];`);
        if (output) lines.push(`  ${id} -> ${nodeId(output)} [style="dotted"];`);
      }
      if (index > 0) lines.push(`  ${nodeId(`bpmn_${index - 1}_${rows[index - 1][1]}`)} -> ${id} [arrowhead=vee];`);
    });
    lines.push("}");
    return lines.join("\n");
  }
};
