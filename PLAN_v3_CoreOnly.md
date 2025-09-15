# План v3 — Core сейчас, Parsing & Checking потом (совместимо)

**Последнее обновление:** 2025-09-15 07:10 (Asia/Yerevan)

> Этот план заменяет текущий PLAN.md на время разработки ядра. Сейчас делаем **только Core** (админка, каталог, импорт через CSV, публичные страницы).  
> **Parsing** (краулеры/коннекторы) и **Checking** (периодические проверки доступности) — **в отдельном плагине**, который включим позже **без переделок**.

---

## 0) Что входит/не входит сейчас

### IN SCOPE (делаем сейчас)
- БД и модели: `vendors`, `themes?`, `demos`, `staging_imports`, `import_runs`, `media_sets?`.
- Админка: CRUD Vendors/Themes/Demos; **Импорт из CSV → DIFF → Добавить**.
- Публичная часть: каталог, PDP, viewer; фильтры/поиск/сортировки.
- Медиа (опц.): постеры/скрины и fallback.
- SEO/OG/JSON-LD, аналитика событий, аудит-лог, роли (Owner/Admin/Editor).
- **Фича-флаги:** `PARSING_ENABLED=false`, `CHECKING_ENABLED=false`.
- **Стабы интерфейсов** Parsing/Checking (без логики) — для совместимости.

### OUT OF SCOPE (подключим позже)
- **Parsing-плагин**: краулеры, коннекторы, автоскан, вебхуки.
- **Checking-плагин**: планировщик, HTTP-пробы, авто-статусы.

---

## 1) Контракты интеграции плагина (фиксируем сейчас)

### 1.1 Parsing → Core
- `POST /parse/vendor` ⇒ `{ vendorId, connectorConfig, seedUrls[] } → { feedId }`
- `GET /parse/feed/:feedId` ⇒ `Array<{ brand, name?, url, url_canonical }>`
- Webhook (опц.): `POST /webhooks/parse_completed` ⇒ `{ feedId, vendorId, count, finishedAt }`

**CSV-альтернатива (сейчас):** колонки **brand**, **url**, `name?`; канонизация URL обязательна (https, убрать UTM/fbclid/gclid, без # и завершающего `/`, хост lowercase).

**Сохранение:** писать в `staging_imports`; далее — **DIFF** с `demos` и добавление выбранных.

### 1.2 Checking → Core
- `POST /check/run` ⇒ `{ demoId } → { runId }`
- `GET /check/status/:runId` ⇒ `{ status: "ok"|"down"|"timeout", httpStatus?, error?, checkedAt }`
- Webhook (опц.): `POST /webhooks/check_result` ⇒ `{ demoId, status, httpStatus?, error?, checkedAt }`
- EventBus: `DemoCheckResult` ⇒ `{ demoId, status, httpStatus?, error?, checkedAt }`

**Правила статусов (хранятся в Core):**
- success ⇒ `state=active; last_ok_at=now()`
- first fail ⇒ `state=draft; first_failed_at=now() (если было пусто)`
- 30 дней без success ⇒ **hard delete** (`state=deleted` + фактическое удаление)

---

## 2) Модель данных (ядро)
- **vendors**: id, name, base_url, is_active, connector_profile(json), created_at
- **themes** (опц.): id, vendor_id, name, slug, category, tags[]
- **demos**: id, vendor_id, theme_id?, name?, url, **url_canonical**, state(`active|draft|deleted`), first_seen_at, last_seen_at, first_failed_at?, last_ok_at?
- **staging_imports**: id, vendor_id, brand, name?, url, **url_canonical**, imported_at, source(`csv|parsing`)
- **import_runs**: id, vendor_id, started_at, finished_at, totals(found,new,ignored,errors), source
- **media_sets** (опц.): id, demo_id, lcp_url, shot_375, shot_768, shot_1280, created_at

> Уникальность демо: `vendor_id + url_canonical`. Канонизация URL — одна функция и для CSV, и для будущего Parsing.

---

## 3) Админ-флоу (Core)

### 3.1 Импорт через CSV (активен сейчас)
1) Выбрать Vendor → вкладка **CSV** (вкладка *Parsing* скрыта флагом).  
2) Загрузить CSV → канонизация URL → `staging_imports`.  
3) Построить **DIFF** (сравнить `staging_imports` vs `demos`, показать «чего нет»).  
4) Мультивыбор → **Добавить** → создать записи в `demos` + запись в `import_runs`.

### 3.2 Checking (UI-каркас без логики)
- Таблица статусов, история; ручные кнопки «Mark Active/Draft».  
- Расписания/автопробы скрыты (`CHECKING_ENABLED=false`).

---

## 4) Публичная часть
- Каталог, PDP, viewer читают `demos` и показывают `state`.  
- Fallback на постеры/скрины (если включено).  
- Никакой зависимости от живых проверок/парсинга.

---

## 5) API (сейчас) + резерв под плагины
- `/vendors`, `/themes`, `/demos` — CRUD/списки/фильтры/поиск.
- `/import/csv` → загрузка CSV → `staging_imports`.
- `/import/diff?vendorId=...` → DIFF из `staging_imports` против `demos`.
- `/import/confirm` → массовое добавление в `demos`.
- `/media/*` (опц.) — генерация/получение.
- `/public/*` — каталог/PDP/вендоры.

**Зарезервировано:** `/parse/*`, `/check/*`, `/webhooks/*` — **не реализуем сейчас**, только объявляем.

---

## 6) Фича‑флаги и стабы
- `PARSING_ENABLED=false`, `CHECKING_ENABLED=false` — прячут вкладки/настройки.  
- `ParsingAdapterStub`, `CheckingAdapterStub` — реализуют контракты интерфейсов и возвращают фиктивные ответы.

---

## 7) Roadmap Core (A1…A7) — с хуками прогресса

- [ ] **A1** Миграции БД (ядро)  
  _Хук:_ **Статус:** <!-- STATUS:A1 --> todo | **Обновлено:** <!-- UPDATED_AT:A1 --> — | **Ссылка:** <!-- LINK:A1 --> —
- [ ] **A2** CRUD Vendors/Themes/Demos + аудит‑лог  
  _Хук:_ **Статус:** <!-- STATUS:A2 --> todo | **Обновлено:** <!-- UPDATED_AT:A2 --> — | **Ссылка:** <!-- LINK:A2 --> —
- [ ] **A3** CSV → StagingImports → DIFF → Add  
  _Хук:_ **Статус:** <!-- STATUS:A3 --> todo | **Обновлено:** <!-- UPDATED_AT:A3 --> — | **Ссылка:** <!-- LINK:A3 --> —
- [ ] **A4** Каталог/PDP/Viewer (fallback)  
  _Хук:_ **Статус:** <!-- STATUS:A4 --> todo | **Обновлено:** <!-- UPDATED_AT:A4 --> — | **Ссылка:** <!-- LINK:A4 --> —
- [ ] **A5** (опц.) Медиа‑постеры/скрины  
  _Хук:_ **Статус:** <!-- STATUS:A5 --> todo | **Обновлено:** <!-- UPDATED_AT:A5 --> — | **Ссылка:** <!-- LINK:A5 --> —
- [ ] **A6** SEO/OG/Аналитика/Мониторинг  
  _Хук:_ **Статус:** <!-- STATUS:A6 --> todo | **Обновлено:** <!-- UPDATED_AT:A6 --> — | **Ссылка:** <!-- LINK:A6 --> —
- [ ] **A7** Флаги + Stubs Parsing/Checking  
  _Хук:_ **Статус:** <!-- STATUS:A7 --> todo | **Обновлено:** <!-- UPDATED_AT:A7 --> — | **Ссылка:** <!-- LINK:A7 --> —

---

## 8) Что править в PROGRESS.md
- Добавить секцию «Core v3 (без Parsing/Checking)» и статусы A1…A7.  
- В таблице прогресса использовать те же якоря `<!-- STATUS:ID -->`, `<!-- UPDATED_AT:ID -->`, `<!-- LINK:ID -->`.

---

## 9) Инструкции для Cursor (шаг за шагом)

**Шаг 1.** Прочитай `PLAN_v3_CoreOnly.md` и зафиксируй фича‑флаги: `PARSING_ENABLED=false`, `CHECKING_ENABLED=false`.  
**Шаг 2.** Создай монорепо: `apps/web`, `apps/api`, `packages/ui`, `packages/types`, `jobs` + базовые конфиги и `.env.example`.  
**Шаг 3.** Подними БД и миграции для моделей из раздела 2. Отметь в PROGRESS `A1 → done`.  
**Шаг 4.** Реализуй админ‑CRUD Vendors/Themes/Demos и аудит‑лог. Обнови `A2`.  
**Шаг 5.** Сделай импорт через CSV: загрузка → `staging_imports` → DIFF → «Добавить» → записи в `demos` и `import_runs`. Обнови `A3`.  
**Шаг 6.** Публичная часть: каталог, PDP, viewer. Без зависимостей от Parsing/Checking. Обнови `A4`.  
**Шаг 7.** (Опц.) Медиа‑постеры/скрины + fallback. Обнови `A5`.  
**Шаг 8.** SEO/OG/JSON‑LD, аналитика событий, мониторинг. Обнови `A6`.  
**Шаг 9.** Добавь стабы `ParsingAdapterStub`/`CheckingAdapterStub`, включи резервные роуты `/parse/*`, `/check/*`, `/webhooks/*` без логики. Обнови `A7`.  
**Шаг 10.** Синхронизируй статус‑якоря в PROGRESS.md.

---

## 10) Как подключим плагин потом (без ломки)
1) Включить флаг `PARSING_ENABLED=true` или `CHECKING_ENABLED=true`.  
2) Развернуть плагин (см. `plugin.parsing-checking.json`): роутер `/parse/*` и `/check/*`.  
3) Parsing будет писать результаты в `staging_imports` → существующий DIFF/добавление **не меняется**.  
4) Checking будет присылать вебхуки/ивенты → ядро обновляет `demos.state`, `first_failed_at`, `last_ok_at`.  
5) UI вкладки Parsing/Checking разблокируются автоматически флагами.
