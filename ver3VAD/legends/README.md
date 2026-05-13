# Легенды нотаций ver3VAD

В этой папке - DOT-исходники легенд для всех девяти нотаций. Каждая легенда показывает все объекты и предикаты, поддерживаемые нотацией.

## Как получить картинку

1. Открыть нужный `*.dot` файл.
2. Скопировать содержимое в <https://dreampuf.github.io/GraphvizOnline/>.
3. Сохранить результат как SVG или PNG.

Альтернативно: установить graphviz локально и выполнить

```bash
dot -Tsvg legend.dot -o legend.svg
```

## Файлы

| Нотация               | Файл                            | Описание                                         |
| --------------------- | ------------------------------- | ------------------------------------------------ |
| rdf-grapher ver9d     | `ver9d-vad-legend.dot`          | TypeProcess, ExecutorGroup, hasNext, hasExecutor |
| ARIS VAD              | `aris-vad-legend.dot`           | Function, Event, Info object, Role, App system, Comment + предикаты |
| SILA Union VAD        | `sila-vad-legend.dot`           | Operation, Document, Role, IS, Comment + предикаты |
| Business Studio VAD   | `businessstudio-vad-legend.dot` | VAD function, Term, Org unit, IS + предикаты    |
| BCD (обобщ.)          | `bcd-vad-legend.dot`            | Capability, Resource, Product, Owner + предикаты |
| OSP BCD               | `osp-bcd-legend.dot`            | Capability, Group, Resource + consumes/produces/isPartOf |
| Comindware BCD        | `comindware-bcd-legend.dot`     | Capability + decomposesInto (плюс атрибуты)     |
| Stormbpmn BCD         | `stormbpmn-bcd-legend.dot`      | BPMN task, event, data object, lane, annotation |
| ArchiMate VAD-like    | `archimate-vad-legend.dot`      | Business event/process/role/object, App component, Meaning |

## Почему DOT, а не PNG/SVG в репозитории

Бинарные файлы (PNG) увеличивают репозиторий и плохо поддаются review. SVG-файлы при ручном редактировании DOT тоже устаревают. Поэтому источник правды - DOT, а картинка генерируется по требованию.

Если в PR нужны embedded картинки - сгенерируйте их разово и положите рядом (например, `aris-vad-legend.svg`). DOT останется источником для будущих изменений.
