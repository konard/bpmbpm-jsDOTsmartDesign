# Подробное описание VAD-образных нотаций

Файл фиксирует рабочую метамодель для сравнения ARIS VAD, BCD VAD, SILA Union VAD, Stormbpmn BCD и VAD-подобного профиля ArchiMate. Табличный формат следует принципу `source \ target`: строки показывают исходный тип объекта, столбцы - целевой тип объекта, а ячейка содержит допустимый предикат.

## ARIS VAD

Детальное описание: https://docs.aris.com/10.0.27.0/yay-method-reference/en/#/home/494393/en/1

### Типы объектов

| Тип | Назначение |
| --- | --- |
| Function | Работа верхнего уровня в цепочке создания ценности |
| Event | Технический маркер состояния; в классической VAD вторичен |
| Information object | Документ, данные, вход или выход функции |
| Organizational unit / Role | Исполнитель, владелец или подразделение |
| Application system | ИС, поддерживающая функцию |
| Comment | Пояснение к функции, объекту или связи |

### Матрица source \ target

| source \ target | Function | Information object | Organizational unit / Role | Application system | Comment |
| --- | --- | --- | --- | --- | --- |
| Function | precedes | creates | is performed by | is supported by | has comment |
| Information object | is input for | - | - | - | has comment |
| Organizational unit / Role | performs | - | - | - | has comment |
| Application system | supports | - | - | - | has comment |
| Comment | annotates | annotates | annotates | annotates | - |

### Предикаты

| Предикат | source | target | Описание |
| --- | --- | --- | --- |
| precedes | Function | Function | Последовательность функций верхнего уровня |
| is input for | Information object | Function | Документ или данные используются функцией |
| creates | Function | Information object | Функция создает результат |
| performs | Organizational unit / Role | Function | Роль или подразделение выполняет функцию |
| supports | Application system | Function | Система поддерживает выполнение функции |
| has comment | Any object | Comment | Объект связан с комментарием |

## BCD VAD

Детальное описание: https://www.osp.ru/os/2026/02/13060742

### Типы объектов

| Тип | Назначение |
| --- | --- |
| Business capability | Устойчивая способность бизнеса создавать результат |
| Resource | Вход способности, включая данные, материалы или сервис |
| Product | Выход способности, продукт или результат |
| Owner | Роль или подразделение, отвечающее за способность |
| Comment | Пояснение к способности или связи |

### Матрица source \ target

| source \ target | Business capability | Resource | Product | Owner | Comment |
| --- | --- | --- | --- | --- | --- |
| Business capability | depends on | consumes | produces | is owned by | has comment |
| Resource | is resource for | - | - | - | has comment |
| Product | enables | - | - | - | has comment |
| Owner | owns | - | - | - | has comment |
| Comment | annotates | annotates | annotates | annotates | - |

### Предикаты

| Предикат | source | target | Описание |
| --- | --- | --- | --- |
| depends on | Business capability | Business capability | Одна способность зависит от другой |
| consumes | Business capability | Resource | Способность требует ресурс |
| produces | Business capability | Product | Способность создает продукт или результат |
| owns | Owner | Business capability | Ответственный владеет способностью |
| has comment | Any object | Comment | Связь с комментарием |

## SILA Union VAD

Детальное описание: https://bpm3.ru/articles/modelirovanie-protsessov-v-notatsii-vad-v-sila-union/

### Типы объектов

| Тип | Назначение |
| --- | --- |
| Process / operation | Операция или процесс верхнего уровня |
| Document | Входной или выходной документ |
| Role | Исполнитель |
| Information system | Система, участвующая в выполнении |
| Comment | Пояснение к элементу модели |

### Матрица source \ target

| source \ target | Process / operation | Document | Role | Information system | Comment |
| --- | --- | --- | --- | --- | --- |
| Process / operation | precedes | produces document | is performed by | is supported by | has comment |
| Document | is used by | - | - | - | has comment |
| Role | performs | - | - | - | has comment |
| Information system | supports | - | - | - | has comment |
| Comment | annotates | annotates | annotates | annotates | - |

### Предикаты

| Предикат | source | target | Описание |
| --- | --- | --- | --- |
| precedes | Process / operation | Process / operation | Порядок операций |
| is used by | Document | Process / operation | Документ нужен операции |
| produces document | Process / operation | Document | Операция формирует документ |
| performs | Role | Process / operation | Роль выполняет операцию |
| supports | Information system | Process / operation | Система поддерживает операцию |
| has comment | Any object | Comment | Связь с комментарием |

## Stormbpmn BCD через BPMN

Детальное описание: https://helpdesk.stormbpmn.com/hc/docs/articles/1749580250-

### Типы объектов

| Тип | Назначение |
| --- | --- |
| BPMN event | Событие начала, завершения или изменения состояния |
| BPMN task | Работа или способность, показанная BPMN-задачей |
| Data object | Вход или выход работы |
| Lane / participant | Зона ответственности |
| Text annotation | Комментарий BPMN |

### Матрица source \ target

| source \ target | BPMN event | BPMN task | Data object | Lane / participant | Text annotation |
| --- | --- | --- | --- | --- | --- |
| BPMN event | - | sequence flow | - | - | association |
| BPMN task | sequence flow | sequence flow | data output association | assigned lane | association |
| Data object | - | data input association | - | - | association |
| Lane / participant | - | contains | - | - | association |
| Text annotation | association | association | association | association | - |

### Предикаты

| Предикат | source | target | Описание |
| --- | --- | --- | --- |
| sequence flow | BPMN event/task | BPMN task/event | Управляющая последовательность |
| data input association | Data object | BPMN task | Входные данные задачи |
| data output association | BPMN task | Data object | Выходные данные задачи |
| assigned lane | BPMN task | Lane / participant | Ответственная дорожка |
| association | Any object | Text annotation | Связь с комментарием |

## ArchiMate VAD-like

Детальное описание: https://pubs.opengroup.org/architecture/archimate3-doc/

### Типы объектов

| Тип | Назначение |
| --- | --- |
| Business event | Событие, запускающее или завершающее поведение |
| Business process | Работа верхнего уровня |
| Business role | Роль, назначенная на поведение |
| Business object | Данные, документ или бизнес-объект |
| Application component | Прикладной компонент |
| Meaning / representation | Комментарий или поясняющее представление |

### Матрица source \ target

| source \ target | Business event | Business process | Business object | Business role | Application component | Meaning / representation |
| --- | --- | --- | --- | --- | --- | --- |
| Business event | - | triggering | - | - | - | association |
| Business process | triggering | triggering | access | - | serving | association |
| Business object | - | access | - | - | - | association |
| Business role | - | assignment | - | - | - | association |
| Application component | - | serving | - | - | - | association |
| Meaning / representation | association | association | association | association | association | - |

### Предикаты

| Предикат | source | target | Описание |
| --- | --- | --- | --- |
| triggering | Business event/process | Business process/event | Запуск или последовательность поведения |
| access | Business process | Business object | Чтение, запись или изменение бизнес-объекта |
| assignment | Business role | Business process | Назначение роли на поведение |
| serving | Application component | Business process | Прикладная поддержка процесса |
| association | Any object | Meaning / representation | Связь с пояснением |
