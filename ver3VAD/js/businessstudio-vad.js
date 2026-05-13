import { dotLabel, graphHeader, nodeId, rankBlock } from "./dot-utils.js";

// Business Studio VAD.
// Источник: документация Business Studio (businessstudio.ru), раздел
// "Создание модели верхнего уровня (Value Added Chain)".
// Палитра Business Studio для VAD:
//   - Функция VAD ("стрелка-шеврон", у нас shape="cds").
//   - Группа функций (двойной прямоугольник, у нас "box" с doublecircle
//     эффектом через peripheries=2).
//   - Термин/Документ (note) - объекты ссылочной модели.
//   - Орг.единица (ellipse) - закреплена за функцией через "Ответственный".
//   - Информационная система (box3d).
// Связи:
//   - "Предшествование" (solid, основной поток) между функциями.
//   - "Композиция" (солидная с diamond-arrowhead) от функции к группе.
//   - "Использует объект" (dashed) к термину/документу.

export const businessStudioVad = {
  id: "businessstudio-vad",
  name: "Business Studio VAD",
  description: "VAD по Business Studio: функция VAD (cds-шеврон), группа функций (двойной прямоугольник), термин/документ, орг.единица и информационная система. Связи: предшествование, композиция, использование объекта.",
  documentationFields: ["type", "name", "input", "output", "role", "system", "comment"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("BusinessStudioVAD", "Business Studio VAD: функции верхнего уровня", { rankdir: "LR", nodesep: 0.7, ranksep: 0.5 });
    const workIds = [];
    const orgIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, system, comment] = row;
      const id = nodeId(`bs_${index}_${name}`);
      if (type === "event") {
        // В Business Studio VAD события не моделируются: ставим
        // нейтральный узел-маркер.
        lines.push(`  ${id} [shape="plaintext", label="${dotLabel(name)}"];`);
        workIds.push(id);
      } else {
        // Функция VAD: cds-шеврон, бирюзовая палитра Business Studio.
        lines.push(`  ${id} [shape="cds", height=0.85, width=1.6, style="filled", color="#00695C", fillcolor="#B2DFDB", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (role) {
          // Орг.единица: вытянутый эллипс, типичный для Business Studio.
          const rid = nodeId(`org_${id}`);
          lines.push(`  ${rid} [shape="ellipse", style="filled", color="#4E342E", fillcolor="#D7CCC8", label="${dotLabel(role)}"];`);
          lines.push(`  ${id} -> ${rid} [arrowhead=none, style="dashed", label="ответственный"];`);
          orgIds.push(rid);
        }
        if (system) {
          const sid = nodeId(`sys_${id}`);
          lines.push(`  ${sid} [shape="box3d", style="filled", color="#1B5E20", fillcolor="#C8E6C9", label="${dotLabel(system)}"];`);
          lines.push(`  ${id} -> ${sid} [arrowhead=none, style="dotted", label="ИС"];`);
        }
        if (input) {
          const iid = nodeId(input);
          lines.push(`  ${iid} [shape="note", style="filled", color="#9E9E9E", fillcolor="#FAFAFA", label="${dotLabel(input)}"];`);
          lines.push(`  ${iid} -> ${id} [style="dashed", arrowhead=vee, label="вход"];`);
        }
        if (output) {
          const oid = nodeId(output);
          lines.push(`  ${oid} [shape="note", style="filled", color="#9E9E9E", fillcolor="#FAFAFA", label="${dotLabel(output)}"];`);
          lines.push(`  ${id} -> ${oid} [style="dashed", arrowhead=vee, label="выход"];`);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", color="#FBC02D", fillcolor="#FFFDE7", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
      if (index > 0) {
        const prev = nodeId(`bs_${index - 1}_${rows[index - 1][1]}`);
        // Предшествование: основная сплошная стрелка Business Studio.
        lines.push(`  ${prev}:e -> ${id}:w [color="#00695C", arrowhead=vee, label="предшествование"];`);
      }
    });
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    const orgRank = rankBlock(orgIds);
    if (orgRank) lines.push(orgRank);
    lines.push("}");
    return lines.join("\n");
  }
};
