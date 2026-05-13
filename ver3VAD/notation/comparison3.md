# Детальное сравнение VAD/BCD нотаций (ver3)

В `ver3VAD` рассматривается **девять** нотаций, разбитых на три семейства:

- **VAD-семья** (есть `hasNext` или его аналог): rdf-grapher ver9d, ARIS VAD, SILA Union VAD, Business Studio VAD, ArchiMate VAD-like.
- **BCD-семья** (нет последовательности времени): BCD-обобщённая, OSP BCD, Comindware BCD.
- **Гибрид** (BPMN-палитра, но позиционируется как BCD): Stormbpmn BCD.

## Свод по унифицированным концептам

| Унифицированное понятие   | ver9d         | ARIS VAD     | SILA VAD   | Business Studio VAD | BCD (общ.)  | OSP BCD       | Comindware BCD | Stormbpmn BCD | ArchiMate VAD |
| ------------------------- | ------------- | ------------ | ---------- | ------------------- | ----------- | ------------- | -------------- | ------------- | ------------- |
| Основная работа           | TypeProcess   | Function     | Operation  | VAD function        | Capability  | Capability    | Capability     | BPMN task     | Business process |
| Событие                   | -             | Event (техн.) | -         | -                   | -           | -             | -              | BPMN event    | Business event |
| Вход                      | -             | Inf. obj. (in) | Document (in) | Term (in)      | Resource    | Resource      | -              | Data obj. (in)| Business obj. |
| Выход                     | -             | Inf. obj. (out) | Document (out) | Term (out)  | Product     | Resource      | -              | Data obj. (out)| Business obj. |
| Ответственный             | ExecutorGroup | Role         | Role       | Org unit            | Owner       | Cap. group    | Owner (атрибут)| Lane          | Business role |
| Система                   | -             | App. system  | IS         | Information system  | -           | -             | -              | -             | App. component |
| Комментарий               | -             | Comment      | Comment    | Comment             | Comment     | Comment       | Comment (атрибут)| Text annotation| Meaning |
| Связь "следующее"         | hasNext       | precedes     | precedes   | precedes            | -           | -             | -              | sequenceFlow  | triggering    |
| Связь "вход"              | -             | isInputFor   | isUsedBy   | isInputFor          | consumes    | consumes      | -              | dataInputAssoc| access        |
| Связь "выход"             | -             | creates      | producesDoc| produces            | produces    | produces      | -              | dataOutputAssoc| access       |
| Связь "ответственность"   | hasExecutor   | performs     | performs   | responsibleFor      | owns        | isPartOf      | -              | assignedLane  | assignment    |
| Связь с системой          | -             | supports     | supports   | supports            | -           | -             | -              | -             | serving       |

## Что общего у всех нотаций

1. **Центральный узел "работа"** - присутствует везде, отличаются названия.
2. **Возможность поставить комментарий** - есть везде, кроме ver9d (где это вне ядра).
3. **Графическое представление "работы"** - в 5 из 9 нотаций это cds-шеврон или похожая стрелка (ver9d, ARIS, Business Studio). В BCD-семье и Stormbpmn - прямоугольник.

## Где нотации принципиально расходятся

### 1. Поток времени (hasNext)

VAD-семья имеет связь "следующее" в обязательном порядке (`hasNext`/`precedes`/`triggering`). BCD-семья её формально не имеет: BCD - это статическая карта. Stormbpmn BCD позиционируется как BCD, но через `sequenceFlow` фактически восстанавливает VAD-поведение - это смысловое противоречие, разобрано в `analysis3.md`.

### 2. Природа главного узла

- VAD: работа - это **функция/процесс/операция** (что-то, что делается).
- BCD: работа - это **способность** (что предприятие умеет делать). Способность существует, даже когда никто её не использует.

### 3. Положение "ответственного"

- ARIS, SILA, Business Studio, ArchiMate: ответственный - **отдельный узел**.
- Comindware BCD: ответственный - **атрибут внутри блока**.
- OSP BCD: на месте "роли" - **группа способностей** (потому что отдельного "ответственного" в BCD нет).
- ver9d: ответственный - это **группа исполнителей**, обязательный узел.
- Stormbpmn BCD: ответственный - это **дорожка (lane)**.

### 4. Входы/выходы

- ARIS, SILA, Business Studio, Stormbpmn, ArchiMate: вход и выход - **разные узлы** (даже если документ один и тот же).
- OSP BCD: вход и выход - **один класс Resource** (resource = product).
- Comindware BCD, ver9d: входы и выходы **отсутствуют** в палитре.
- BCD (обобщ.): разделение есть (Resource vs Product), но в простых случаях сводимо к одному.

### 5. События

- ArchiMate, Stormbpmn BCD: события - **полноценные узлы** с собственным предикатом triggering/sequenceFlow.
- ARIS VAD: события - **технический маркер** (вторичный элемент).
- ver9d, SILA, Business Studio, BCD-семья: **событий нет**.

## Сопоставление с rdf-grapher ver9d и эталоном из issue

В <https://bpmbpm.github.io/rdf-grapher/ver9d/> используется минималистичная VAD-логика: цепочка `TypeProcess` с параллельным рядом `ExecutorGroup`. Именно этот образец в задании указан как "правильная" визуализация. В ver3VAD ver9d-vad.js реализует его буквально, остальные VAD-нотации стараются повторить горизонтальный layout через `rankdir=LR` + `rank=same`.

В Comindware BCD (Рис. 9 из исходной задачи) центральный элемент - способность, а контекст - продукты и ответственные. Это **другая семантика**, чем у ver9d: в Comindware упор на иерархию, в ver9d на поток.

| Свойство                  | ver9d (VAD)           | Comindware BCD       | OSP BCD            |
| ------------------------- | --------------------- | -------------------- | ------------------ |
| Главный элемент           | TypeProcess           | Capability           | Capability         |
| Поток времени             | hasNext (есть)        | Нет                  | Нет                |
| Декомпозиция              | Нет                   | decomposesInto       | isPartOf (группа)  |
| Ресурсы/продукты          | Нет                   | Нет                  | Resource (есть)    |
| Ответственный             | ExecutorGroup (узел)  | Атрибут блока        | Group of capabilities |

## Вывод по совместимости (критически)

- **VAD-семья совместима между собой** через единое понятие "работа + последовательность". Перенос модели из ARIS в SILA или в Business Studio - в основном переименование меток.
- **BCD-семья несовместима с VAD по сути.** Если в OSP BCD добавить hasNext, статья настаивает: это уже не BCD. Поэтому миграция VAD ↔ BCD требует переосмысления, а не механической замены меток.
- **Stormbpmn BCD - проблемная промежуточная нотация.** BPMN-палитра не предназначена для BCD: `sequence flow` означает "что после чего", и зрителю модели легко перепутать поток управления с зависимостью способностей. См. подробный разбор в `analysis3.md`.
- **ArchiMate** даёт самую формальную семантику, но требует, чтобы пользователь знал контракт `triggering`/`access`/`assignment`/`serving`. Без этого диаграмма выглядит "как VAD", но содержит более строгую информацию.

## Практическая рекомендация

| Сценарий                                              | Какую нотацию выбрать |
| ----------------------------------------------------- | --------------------- |
| Быстрая диаграмма для презентации (минимум деталей)   | ver9d                 |
| Регламентное описание процесса с входами/выходами     | ARIS VAD или SILA VAD |
| Внедрение в Business Studio (российская сертификация) | Business Studio VAD   |
| Карта способностей предприятия (архитектурный обзор)  | OSP BCD               |
| Иерархия способностей по уровням L1/L2/L3             | Comindware BCD        |
| Корпоративная архитектура с привязкой к ИТ            | ArchiMate VAD-like    |
| Работа с BPMN-инструментом, лень осваивать BCD-палитру | Stormbpmn BCD (с оговорками) |
