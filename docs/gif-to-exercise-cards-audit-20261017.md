# Muscle Map: полный аудит GIF, медиа и карточек

Дата: 17.10.2026. Только черновая ветка PR #31, без публикации в Production.

## Критерии назначения упражнения мышце

1. **ID упражнения** подтверждает соответствие исходной записи, GIF и JPG, но не подтверждает анатомическую классификацию.
2. **Исходная запись** содержит английское имя, target, equipment, инструкцию и ссылки на изображения. Для 29 отсутствующих карточек используется закреплённая версия `hasaneyldrm/exercises-dataset` commit `7455efae41b330c265e7cd4b78dfa848e7ce5ebd`.
3. **GIF и текст движений** необходимо визуально сверить с заявленным движением, направлением нагрузки и целевой мышцей. Только имя или GIF не должны автоматически решать классификацию.
4. **Реальные карточки** в приложении получают исправленный `muscleId`, стабильный `id`, инструкции, перевод, JPG и GIF только после проверки. Каждое изменение проверяется через браузерный тест и сохранённый дневник.
5. **Лицензирование** медиа является отдельным блокером: оригинальные видео и картинки © Gym visual; исходный MIT не лицензирует их для коммерческого использования сторонними продуктами.

## Полная инвентаризация

| Измерение | Найдено |
|---|---:|
| GIF в репозитории | 1368 |
| GIF в основном каталоге | 1295 |
| GIF, используемые ручными упражнениями | 44 |
| GIF, не привязанные к карточкам | 29 |
| Для 29 найден соответствующий JPG | 29 |
| Для 29 восстановлено название и исходный ID | 29 |
| Пустые пути к существующим GIF | 0 |
| Несовпадений ID с именами JPG/GIF основного каталога | 0 |

**Все 29 непривязанных GIF имеют исходную категорию Cardio и target `cardiovascular system`.**

| ID | Имя исходного упражнения | Оборудование | Планируемый раздел |
|---|---|---|---|
| `0501` | jack burpee | body weight | Cardio (requires review) |
| `0630` | mountain climber | body weight | Cardio (requires review) |
| `0684` | run (equipment) | body weight | Cardio (requires review) |
| `0685` | run | body weight | Cardio (requires review) |
| `0798` | stationary bike walk | leverage machine | Cardio (requires review) |
| `1160` | burpee | body weight | Cardio (requires review) |
| `1201` | dumbbell burpee | dumbbell | Cardio (requires review) |
| `2138` | stationary bike run v. 3 | stationary bike | Cardio (requires review) |
| `2141` | walk elliptical cross trainer | elliptical machine | Cardio (requires review) |
| `2311` | walking on stepmill | stepmill machine | Cardio (requires review) |
| `2331` | cycle cross trainer | leverage machine | Cardio (requires review) |
| `2612` | jump rope | rope | Cardio (requires review) |
| `3219` | scissor jumps (male) | body weight | Cardio (requires review) |
| `3220` | astride jumps (male) | body weight | Cardio (requires review) |
| `3221` | half knee bends (male) | body weight | Cardio (requires review) |
| `3222` | semi squat jump (male) | body weight | Cardio (requires review) |
| `3223` | star jump (male) | body weight | Cardio (requires review) |
| `3224` | jack jump (male) | body weight | Cardio (requires review) |
| `3318` | swing 360 | body weight | Cardio (requires review) |
| `3360` | bear crawl | body weight | Cardio (requires review) |
| `3361` | skater hops | body weight | Cardio (requires review) |
| `3636` | high knee against wall | body weight | Cardio (requires review) |
| `3637` | wheel run | body weight | Cardio (requires review) |
| `3638` | push to run | body weight | Cardio (requires review) |
| `3655` | walking high knees lunge | body weight | Cardio (requires review) |
| `3656` | short stride run | body weight | Cardio (requires review) |
| `3666` | walking on incline treadmill | leverage machine | Cardio (requires review) |
| `3671` | ski step | body weight | Cardio (requires review) |
| `3672` | back and forth step | body weight | Cardio (requires review) |

### Шея

В текущем разделе `male_sternocleidomastoid` имеется шесть ручных карточек с GIF `videos/custom/neck_1.gif` … `neck_6.gif`. Все шесть путей существуют; других непривязанных GIF шеи в репозитории нет.

Три записи из шести описывают **разгибание шеи**, тогда как целевая категория является грудино-ключично-сосцевидной мышцей. Это **кандидаты для проверки**: уточнить, относятся ли они к задним разгибателям шеи и нуждаются ли в отдельной мышечной группе; не переприсваивать автоматически.

Две записи основного каталога `1403` (`neck side stretch`) и `0716` (`side push neck stretch`) имеют исходный target `levator scapulae`, но текущий атлас не имеет отдельной мышцы, поднимающей лопатку. Это не доказательство того, что их нужно поместить в SCM.

### Кардио

29 исходных кардиоупражнений не следует автоматически прикреплять к трапеции, квадрицепсам или какой-либо одной мышце. Нужен отдельный каталог **«Кардио»** с карточками упражнений, их GIF, русскими/английскими названиями, техникой и оборудованием. Привязка такого каталога к дневнику должна сохранять прежние ID и Premium-правила.

## Проверка на реальном устройстве

Только для ручной проверки в тестовой ветке: `http://192.168.100.2:8000/qa/media-card-audit.html` (локальный адрес может измениться).

В галерее три вкладки: Кардио (29), Шея (6), Растяжки (2). GIF загружается только по нажатию. Эта страница не включена в меню приложения, не публикует новые упражнения и не изменяет данные пользователей.

## Автоматические проверки

- `scripts/audit-gif-coverage.cjs` проверяет реальные локальные GIF/JPG, неприкреплённые файлы и сопоставляет ID с исходными упражнениями.
- `.github/workflows/gif-media-coverage.yml` читает закреплённые исходные метаданные, публикует JSON/Markdown отчёты и не скачивает новых GIF.
- `tests/gif-media-audit.test.cjs` проверяет, что 29 GIF остаются изолированными до принятия решения о публикации.
- `tests/browser-smoke.cjs` проверяет 29 превью-карточек, шесть ручных анимаций шеи, две растяжки, а также desktop/mobile регрессию.

## Перед пользовательским выпуском

- [ ] Проверить правомерность коммерческого использования GIF и JPG; ссылка: https://github.com/hasaneyldrm/exercises-dataset/blob/main/NOTICE.md
- [ ] Осмотреть GIF в движении для всех кандидатов и сверить с техникой.
- [ ] Подготовить отдельный раздел карточек Cardio без ложного назначения основной мышцы.
- [ ] Проверить шестёрку шеи, отделив разгибатели от сгибателей и учитывая безопасность движений.
- [ ] Добавить переводы RU/EN, инструкции и критерии качества для 29 карточек.
- [ ] Прогнать CI и снова проверить Samsung, включая плавность и мгновенность.
- [ ] Не сливать PR #31 без разрешения владельца.

Связанная задача: https://github.com/barispamuk02/muscle-map/issues/35
