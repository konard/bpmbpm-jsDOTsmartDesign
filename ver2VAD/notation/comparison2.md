# Детальное сравнение VAD-образных нотаций

| Унифицированное понятие | ARIS VAD | BCD VAD | SILA Union VAD | Stormbpmn BCD | ArchiMate VAD-like |
| --- | --- | --- | --- | --- | --- |
| Основная работа | Function | Business capability | Process / operation | BPMN task | Business process |
| Событие | Event, вторичный элемент | Обычно не выделяется | Обычно не выделяется | BPMN event | Business event |
| Вход | Information object как вход функции | Resource способности | Document | Data object | Business object |
| Выход | Information object как результат функции | Product способности | Document | Data object | Business object |
| Ответственный | Organizational unit / Role | Owner | Role | Lane / participant | Business role |
| Система | Application system | Обычно вне ядра BCD | Information system | Может быть participant/service task | Application component |
| Комментарий | Comment / annotation | Comment | Comment | Text annotation | Meaning / representation |
| Последовательность | precedes / hasNext | dependency | precedes | sequence flow | triggering |
| Входная связь | is input for | consumes / is resource for | is used by | data input association | access |
| Выходная связь | creates | produces | produces document | data output association | access |
| Ответственность | performs | owns | performs | assigned lane | assignment |
| Поддержка системой | supports | нет базового элемента | supports | association или participant | serving |
| Связь с комментарием | has comment | has comment | has comment | association | association |

## Сопоставление с rdf-grapher ver9d и Рис. 9

В https://bpmbpm.github.io/rdf-grapher/ver9d/ и в Рис. 9 про Comindware Platform используется BCD-логика: центральный элемент описывает бизнес-способность, а окружение показывает продукты, ресурсы, ответственных и зависимости. Поэтому BCD VAD ближе к карте возможностей, чем к исполняемому процессу.

| Элемент BCD / Рис. 9 | Ближайший элемент в ver2VAD | Комментарий |
| --- | --- | --- |
| Способность | Business capability / activity | Основной прямоугольник BCD |
| Ресурс | Вход / Resource | В текущей таблице это колонка "Вход"; ресурс потребляется способностью |
| Продукт | Выход / Product | В текущей таблице это колонка "Выход"; продукт создается способностью |
| Ответственный | Owner / Role | Роль или подразделение, владеющее способностью |
| Зависимость | depends on | Связь между способностями |
| Комментарий | Comment | Пояснение к элементу или связи |

## Вывод по совместимости

ARIS VAD и SILA Union VAD удобны для верхнеуровочного описания процесса. BCD VAD и rdf-grapher ver9d лучше описывают устойчивые способности и их продукты. Stormbpmn BCD удобен, когда организация уже работает BPMN-инструментом, но смысл способности может смешиваться с исполняемой задачей. ArchiMate дает наиболее формальную архитектурную семантику, но требует отдельного профиля, чтобы выглядеть как VAD.
