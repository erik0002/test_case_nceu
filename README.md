# Task Manager — SPA для управления задачами

Одностраничное приложение для управления задачами с полным CRUD, фильтрацией, поиском и сортировкой.

## Стек технологий

| Категория | Технология |
|-----------|------------|
| UI | React 19, TypeScript |
| UI-библиотека | Material UI (MUI) |
| Стилизация | CSS Modules + MUI theme |
| Роутинг | React Router v6+ (react-router-dom v7) |
| Формы и валидация | react-hook-form + zod |
| Состояние и API | Redux Toolkit + RTK Query |
| Backend (mock) | JSON Server |
| Сборка | Vite |
| Тестирование | Vitest + React Testing Library |
| Документация UI | Storybook 10 |

## Быстрый старт

### Требования

- Node.js 18+
- npm 9+

### Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера (Vite + JSON Server одновременно)
npm run dev
```

Приложение: [http://localhost:5173](http://localhost:5173)  
API (JSON Server): [http://localhost:3001](http://localhost:3001)

### Отдельный запуск

```bash
npm run client   # только фронтенд (Vite)
npm run server   # только JSON Server
```

### Сборка для production

```bash
npm run build
npm run preview
```

### Тесты

```bash
npm test              # watch-режим
npm run test:run      # однократный прогон
npm run test:coverage # с отчётом покрытия
```

Покрытие тестами:
- утилиты (`date.ts`) и zod-схема валидации
- RTK Query (`normalizeTasksResponse`)
- компоненты: `TaskCard`, `TaskFilters`, `DeleteConfirmModal`

### Storybook

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # статическая сборка в storybook-static/
```

Stories для компонентов: `TaskCard`, `TaskFilters`, `TaskForm`, `DeleteConfirmModal`.

## Функциональность

### Главная страница (`/`)

- Список задач в виде карточек (title, description, status, priority, deadline, tags)
- Визуальное выделение просроченных задач
- Быстрое изменение статуса через dropdown на карточке (PATCH)
- Переход на страницу задачи по клику на карточку
- Фильтрация по тегу при клике на тег
- Фильтры: статус, приоритет, тег
- Поиск по названию
- Сортировка по дате создания / дедлайну
- Пагинация (6 задач на страницу)

### Страница задачи (`/task/:id`)

- Полная информация о задаче
- Удаление с подтверждением в модальном окне
- Кнопка редактирования

### Создание / редактирование (`/tasks/new`, `/tasks/:id/edit`)

- Валидация через zod:
  - **Заголовок** — обязательно, мин. 5 символов
  - **Описание** — необязательно, макс. 500 символов
  - **Статус** — выпадающий список
  - **Приоритет** — radio group
  - **Дедлайн** — `input[type="date"]`
  - **Теги** — autocomplete с множественным выбором, мин. 1 тег, возможность добавления новых

## API (JSON Server)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/tasks` | Список задач (фильтры, сортировка) |
| GET | `/tasks/:id` | Задача по ID |
| POST | `/tasks` | Создание задачи |
| PUT | `/tasks/:id` | Полное обновление |
| PATCH | `/tasks/:id` | Обновление статуса |
| DELETE | `/tasks/:id` | Удаление |
| GET | `/tags` | Список тегов |
| POST | `/tags` | Создание тега |

Запросы проксируются через Vite: `/api/*` → `http://localhost:3001/*`

**Примечание:** используется JSON Server 1.x. Сортировка: `_sort=-createdAt` (минус = по убыванию). Поиск: `title:contains=текст`. Фильтрация по тегам выполняется на клиенте.

## Архитектура проекта

```
src/
├── components/          # Переиспользуемые UI-компоненты
│   ├── Layout/        # Общий layout с навигацией
│   ├── TaskCard/      # Карточка задачи (CSS Modules)
│   ├── TaskFilters/   # Панель фильтров и сортировки
│   ├── TaskForm/      # Форма создания/редактирования
│   └── DeleteConfirmModal/
├── pages/             # Страницы (роуты)
│   ├── TaskListPage/
│   ├── TaskDetailPage/
│   └── TaskFormPage/
├── store/
│   ├── index.ts       # Redux store
│   └── api/
│       ├── tasksApi.ts  # RTK Query endpoints для задач
│       └── tagsApi.ts   # RTK Query endpoints для тегов
├── schemas/           # Zod-схемы валидации
├── types/             # TypeScript-типы
├── utils/             # Константы и утилиты
└── theme/             # MUI theme
```

**Поток данных:** компоненты → RTK Query hooks → JSON Server (через Vite proxy) → кэш RTK Query → UI.

**Инвалидация кэша:** при мутациях (create/update/delete/patch) автоматически обновляются связанные теги через `invalidatesTags`.

## Модель данных

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  id: string;
  name: string;
}
```
