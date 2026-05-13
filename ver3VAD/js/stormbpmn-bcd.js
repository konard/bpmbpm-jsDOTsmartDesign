import { dotLabel, graphHeader, nodeId, rankBlock } from "./dot-utils.js";

// Stormbpmn BCD через BPMN.
// Источник: https://helpdesk.stormbpmn.com/hc/docs/articles/1749580250-
// BPMN-палитра используется как замена нативной BCD-палитре. Семантика
// смешанная: BPMN-задача показывает Capability, а sequence flow
// фактически кодирует зависимость. Подсвечиваем это в комментариях
// диаграммы и в analysis3.md.

export const stormbpmnBcd = {
  id: "stormbpmn-bcd",
  name: "Stormbpmn BCD (на палитре BPMN)",
  description: "BCD-подобная схема через BPMN-палитру Stormbpmn: события, задачи-способности, артефакты данных и дорожки ответственности.",
  documentationFields: ["type", "name", "input", "output", "role", "comment", "annotation"],
  supportsEvents: true,
  buildDot(rows) {
    const lines = graphHeader("StormBpmnBCD", "BCD на палитре BPMN (Stormbpmn)");
    const workIds = [];
    const laneIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, , comment] = row;
      const id = nodeId(`bpmn_${index}_${name}`);
      if (type === "event") {
        lines.push(`  ${id} [shape="circle", style="filled", fillcolor="#FFFFFF", color="#424242", label="${dotLabel(name)}"];`);
        workIds.push(id);
      } else {
        lines.push(`  ${id} [shape="box", style="rounded,filled", fillcolor="#E3F2FD", color="#0D47A1", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (role) {
          const lid = nodeId(`lane_${id}`);
          lines.push(`  ${lid} [shape="box", style="rounded,filled,dashed", fillcolor="#FFFDE7", color="#B8860B", label="${dotLabel(role)}"];`);
          lines.push(`  ${lid} -> ${id} [style="dashed", arrowhead=none, label="lane"];`);
          laneIds.push(lid);
        }
        if (input) {
          lines.push(`  ${nodeId(input)} [shape="note", style="filled", fillcolor="#FAFAFA", color="#9E9E9E", label="${dotLabel(input)}"];`);
          lines.push(`  ${nodeId(input)} -> ${id} [style="dotted", label="data input"];`);
        }
        if (output) {
          lines.push(`  ${nodeId(output)} [shape="note", style="filled", fillcolor="#FAFAFA", color="#9E9E9E", label="${dotLabel(output)}"];`);
          lines.push(`  ${id} -> ${nodeId(output)} [style="dotted", label="data output"];`);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", fillcolor="#FFFDE7", color="#FBC02D", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`bpmn_${index - 1}_${rows[index - 1][1]}`);
        // sequence flow: основная связь BPMN.
        lines.push(`  ${prev}:e -> ${id}:w [arrowhead=vee, label="sequence flow"];`);
      }
    });
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    const laneRank = rankBlock(laneIds);
    if (laneRank) lines.push(laneRank);
    lines.push("}");
    return lines.join("\n");
  }
};
