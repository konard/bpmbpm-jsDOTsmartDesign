import { dotLabel, graphHeader, nodeId, rankBlock } from "./dot-utils.js";

// OSP BCD - Business Capability Diagram по статье "Открытых систем"
// (osp.ru/os/2026/02/13060742). В отличие от обобщённой bcd-vad.js,
// здесь палитра строго ограничена тремя сущностями статьи:
//   1. Бизнес-способность (rectangle).
//   2. Группа бизнес-способностей (rounded rectangle, играет роль
//      контейнера; в линейном табличном вводе мы выводим её как
//      отдельный узел-агрегат, если строка содержит роль "Группа").
//   3. Ресурс/Продукт (folder) - входной или выходной поток.
// Связи в статье:
//   - "consumes" (пунктир) - ресурс на входе способности.
//   - "produces" (пунктир) - продукт на выходе способности.
//   - "is-part-of" (сплошная) - принадлежность способности к группе.
// Поток времени между способностями НЕ моделируется. В отличие от
// VAD-нотаций здесь нет hasNext/sequence flow: BCD - это статическая
// карта, и две способности рядом не означают временной последовательности.
//
// В таблице наша строка может представлять либо способность (type=activity),
// либо событийный маркер (type=event). Для последнего используем
// "точку входа/выхода" - нейтральный узел, потому что в нотации OSP
// событий нет, и помечать строку как принадлежащую BCD некорректно.

export const ospBcd = {
  id: "osp-bcd",
  name: "OSP BCD (osp.ru, статья 2026)",
  description: "BCD по статье 'Открытые системы' (osp.ru/os/2026/02): минималистичная палитра из трёх элементов - способность, группа способностей и ресурс/продукт. Время и события не моделируются.",
  documentationFields: ["type", "name", "input", "output", "role", "comment"],
  supportsEvents: false,
  buildDot(rows) {
    const lines = graphHeader("OspBCD", "OSP BCD: карта бизнес-способностей", { rankdir: "LR", nodesep: 0.7, ranksep: 0.6 });
    const groupNodes = new Map();
    const workIds = [];
    rows.forEach((row, index) => {
      const [type, name, input, output, role, , comment] = row;
      const id = nodeId(`cap_${index}_${name}`);
      if (type === "event") {
        // В OSP BCD событий нет: помечаем неприменимым узлом.
        lines.push(`  ${id} [shape="plaintext", label="${dotLabel(name + " (вне BCD)")}"];`);
        workIds.push(id);
      } else {
        // Capability: строгий прямоугольник.
        lines.push(`  ${id} [shape="rect", style="filled", color="#0D47A1", fillcolor="#BBDEFB", label="${dotLabel(name)}"];`);
        workIds.push(id);
        if (input) {
          const iid = nodeId(input);
          lines.push(`  ${iid} [shape="folder", style="filled", color="#90A4AE", fillcolor="#ECEFF1", label="${dotLabel(input)}"];`);
          lines.push(`  ${iid} -> ${id} [style="dashed", arrowhead=vee, label="consumes"];`);
        }
        if (output) {
          const oid = nodeId(output);
          lines.push(`  ${oid} [shape="folder", style="filled", color="#90A4AE", fillcolor="#ECEFF1", label="${dotLabel(output)}"];`);
          lines.push(`  ${id} -> ${oid} [style="dashed", arrowhead=vee, label="produces"];`);
        }
        if (role) {
          // Роль здесь интерпретируется как имя группы способностей.
          if (!groupNodes.has(role)) {
            const gid = nodeId(`grp_${role}`);
            groupNodes.set(role, gid);
            lines.push(`  ${gid} [shape="box", style="rounded,filled,dashed", color="#1A237E", fillcolor="#E8EAF6", label="${dotLabel(role)}"];`);
          }
          lines.push(`  ${id} -> ${groupNodes.get(role)} [arrowhead=none, style="solid", label="is-part-of"];`);
        }
        if (comment) {
          const cid = nodeId(`com_${id}`);
          lines.push(`  ${cid} [shape="note", style="filled", color="#FBC02D", fillcolor="#FFFDE7", label="${dotLabel(comment)}"];`);
          lines.push(`  ${id} -> ${cid} [arrowhead=none, style="dotted", color="#FBC02D"];`);
        }
      }
    });
    // Важно: между способностями НЕТ hasNext. Если бы был, это уже
    // была бы VAD, а не BCD.
    const workRank = rankBlock(workIds);
    if (workRank) lines.push(workRank);
    lines.push("}");
    return lines.join("\n");
  }
};
