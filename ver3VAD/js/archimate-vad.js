import { dotLabel, graphHeader, nodeId, rankBlock } from "./dot-utils.js";

// VAD-подобный профиль ArchiMate.
// Источник: https://pubs.opengroup.org/architecture/archimate3-doc/
// В ver3 мы выводим только подмножество концептов, нужных для
// "верхнеуровневой цепочки": Business event, Business process,
// Business role, Business object, Application component, Meaning.

export const archimateVad = {
  id: "archimate-vad",
  name: "ArchiMate VAD-like",
  description: "VAD-подобный профиль ArchiMate: бизнес-события, бизнес-процессы, роли, бизнес-объекты и прикладные компоненты с триггерами и доступом.",
  documentationFields: ["type", "name", "input", "output", "role", "system", "comment", "annotation"],
  supportsEvents: true,
  buildDot(rows) {
    const lines = graphHeader("ArchiMateVAD", "ArchiMate VAD-like: верхнеуровневая модель");
    const workIds = [];
    const roleIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system, comment] = row;
      const id = nodeId(`arch_${index}_${name}`);
      if (type === "event") {
        lines.push(`  ${id} [shape="hexagon", style="filled", fillcolor="#FCE4EC", color="#AD1457", label="${dotLabel(name)}"];`);
        workIds.push(id);
      } else {
        lines.push(`  ${id} [shape="box", style="rounded,filled", fillcolor="#DCEDC8", color="#33691E", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (role) {
          const rid = nodeId(`role_${id}`);
          lines.push(`  ${rid} [shape="box", style="filled", fillcolor="#FFF9C4", color="#B8860B", label="${dotLabel(role)}"];`);
          lines.push(`  ${rid} -> ${id} [label="assignment", arrowhead=none, style="dashed"];`);
          roleIds.push(rid);
        }
        if (system) {
          const sid = nodeId(`app_${id}`);
          lines.push(`  ${sid} [shape="box3d", style="filled", fillcolor="#B3E5FC", color="#0277BD", label="${dotLabel(system)}"];`);
          lines.push(`  ${sid} -> ${id} [label="serving", style="dashed"];`);
        }
        if (input) {
          lines.push(`  ${nodeId(input)} [shape="note", style="filled", fillcolor="#F5F5F5", color="#9E9E9E", label="${dotLabel(input)}"];`);
          lines.push(`  ${nodeId(input)} -> ${id} [label="access", arrowhead=vee];`);
        }
        if (output) {
          lines.push(`  ${nodeId(output)} [shape="note", style="filled", fillcolor="#F5F5F5", color="#9E9E9E", label="${dotLabel(output)}"];`);
          lines.push(`  ${id} -> ${nodeId(output)} [label="access", arrowhead=vee];`);
        }
        if (comment) {
          const cid = nodeId(`mean_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", fillcolor="#FFFDE7", color="#FBC02D", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [label="association", arrowhead=none, style="dotted"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`arch_${index - 1}_${rows[index - 1][1]}`);
        lines.push(`  ${prev}:e -> ${id}:w [label="triggering", arrowhead=vee];`);
      }
    });
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    const roleRank = rankBlock(roleIds);
    if (roleRank) lines.push(roleRank);
    lines.push("}");
    return lines.join("\n");
  }
};
