import { dotLabel, graphHeader, nodeId } from "./dot-utils.js";

export const archimateVad = {
  id: "archimate-vad",
  name: "ArchiMate VAD-like",
  supportsEvents: true,
  description: "VAD-подобная модель на ArchiMate: бизнес-события, процессы, роли, данные и прикладные компоненты.",
  buildDot(rows) {
    const lines = graphHeader("ArchiMateVAD", "VAD-подобная ArchiMate-модель");
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system] = row;
      const id = nodeId(`arch_${index}_${name}`);
      if (type === "event") lines.push(`  ${id} [shape="hexagon", style="filled", fillcolor="#FCE4EC", label="${dotLabel(name)}"];`);
      else {
        lines.push(`  ${id} [shape="box", style="rounded,filled", fillcolor="#DCEDC8", label="${dotLabel(name)}"];`);
        if (role) lines.push(`  ${nodeId(`${id}_${role}`)} [shape="box", style="filled", fillcolor="#FFF9C4", label="${dotLabel(role)}"];`);
        if (role) lines.push(`  ${nodeId(`${id}_${role}`)} -> ${id} [label="assignment", arrowhead=none];`);
        if (system) lines.push(`  ${nodeId(`${id}_${system}`)} [shape="box3d", style="filled", fillcolor="#B3E5FC", label="${dotLabel(system)}"];`);
        if (system) lines.push(`  ${nodeId(`${id}_${system}`)} -> ${id} [label="serving", style="dashed"];`);
        if (input) lines.push(`  ${nodeId(input)} [shape="note", style="filled", fillcolor="#F5F5F5", label="${dotLabel(input)}"];`);
        if (input) lines.push(`  ${nodeId(input)} -> ${id} [label="access"];`);
        if (output) lines.push(`  ${nodeId(output)} [shape="note", style="filled", fillcolor="#F5F5F5", label="${dotLabel(output)}"];`);
        if (output) lines.push(`  ${id} -> ${nodeId(output)} [label="create"];`);
      }
      if (index > 0) lines.push(`  ${nodeId(`arch_${index - 1}_${rows[index - 1][1]}`)} -> ${id} [label="triggering"];`);
    });
    lines.push("}");
    return lines.join("\n");
  }
};
