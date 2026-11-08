# Билет с видом на поле: решения команд

Решения кейса хакатона «Билет с видом на поле» (2026): веб-сервис, где болельщик выбирает стадион и матч, видит свободные места на схеме трибуны, садится на место в 3D, смотрит, как оттуда видно поле, и покупает билет. Цена зависит от места.

Часть команд сначала делала кейс про кинотеатр. Их решения визуально адаптированы под стадион: тексты, данные, палитра, а в 3D-сцене вместо экрана теперь поле с трибунами. Логика покупки и API не менялись.

| Команда | Папка | Исходный репозиторий | Стек | Что сделано |
|---|---|---|---|---|
| 404 | [`404 - team-404`](./404%20-%20team-404) | [Ramzanl7/-404-](https://github.com/Ramzanl7/-404-) | Vite, Three.js, API на Supabase | Кино → Sphera Arena |
| D4C | [`D4C - cinema-3d`](./D4C%20-%20cinema-3d) | архив команды | Express, MySQL, Three.js | Кино → «Билет с видом на поле» |
| Квазар | [`Квазар - hakaton-film_site`](./Квазар%20-%20hakaton-film_site) | [TrueAntrius/hakaton-film_site](https://github.com/TrueAntrius/hakaton-film_site) | Python, SQLite, Three.js | КиноВид → МатчВид |
| Кодим и точка | [`Кодим и точка - kinostar`](./Кодим%20и%20точка%20-%20kinostar) | [Mountok/kinostar](https://github.com/Mountok/kinostar) | Node.js, SQLite, Three.js | Киностар → Арена 3D |
| Сатийсар | [`Сатийсар - ekran-cinema-3d`](./Сатийсар%20-%20ekran-cinema-3d) | [chirikipuki-code/ekran-cinema-3d](https://github.com/chirikipuki-code/ekran-cinema-3d) | Python, SQLite, Three.js | Уже под стадион, без изменений |
| ыыы | [`ыыы - zal`](./ыыы%20-%20zal) | [makhkets/zal](https://github.com/makhkets/zal) | React, FastAPI, SQLite | Уже под стадион, без изменений |

Как запустить каждый проект, написано в README внутри его папки. Стадионы, клубы и матчи во всех проектах вымышленные, оплата демонстрационная.
