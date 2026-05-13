# ArchiMate VAD-профиль - описание источника

**Первичная спецификация:** The Open Group ArchiMate 3.x - <https://pubs.opengroup.org/architecture/archimate3-doc/>

В репозитории используется не весь язык ArchiMate, а узкий VAD-подобный профиль. Соответствие колонок таблицы и концептов ArchiMate:

| Колонка таблицы  | Концепт ArchiMate            |
| ---------------- | ---------------------------- |
| `type=event`     | Business Event               |
| `type=activity`  | Business Process             |
| `input`/`output` | Business Object              |
| `role`           | Business Role                |
| `system`         | Application Component        |
| `comment`        | Meaning / Representation     |

## Допустимые связи (VAD-подмножество)

| Связь        | Источник              | Цель                  |
| ------------ | --------------------- | --------------------- |
| triggering   | Business Event/Process | Business Process/Event |
| access       | Business Process      | Business Object       |
| assignment   | Business Role         | Business Process      |
| serving      | Application Component | Business Process      |
| association  | Любой узел            | Meaning               |

Локальный OWL-файл `archimate-vad-profile.owl` (см. `ver2VAD/source/`) описывает это подмножество как самостоятельную онтологию. Он не заменяет официальную спецификацию Open Group; это лишь рабочий контракт, на который опирается `archimate-vad.js`.

## Чем ArchiMate отличается от ARIS VAD

ARIS VAD - это нотация для одной диаграммы (цепочка функций + окружение). ArchiMate - язык корпоративной архитектуры с несколькими уровнями (бизнес, прикладной, технологический). Когда мы рисуем "VAD-подобную диаграмму ArchiMate", мы фактически создаём срез только по бизнес-слою плюс одна связь к прикладному слою (`serving` от Application Component).

Главное отличие в семантике связей: `triggering` в ArchiMate имеет более строгое определение (поведение запускает поведение или событие), чем неформальный `precedes` в ARIS.

## Связанные ресурсы

- ArchiMate 3.x спецификация: <https://pubs.opengroup.org/architecture/archimate3-doc/>
- Локальный OWL-профиль: `ver2VAD/source/archimate-vad-profile.owl`
- Сопоставление с прочими нотациями: см. `comparison3.md`
