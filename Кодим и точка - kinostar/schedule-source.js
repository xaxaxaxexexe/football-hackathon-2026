// Public, read-only playbill endpoints used by kinostar-groznymall.com.
(function(root) {
  const base = 'https://kinokassa.kinoplan24.ru/api/v2';
  const headers = { 'X-Application-Token': '06NNhjLgE6s1cknWCqivfa8p7FaC1JTe', 'X-Platform': 'widget', 'X-Preferred-Language': 'ru' };
  function normalize(days, dates, fetchedAt = new Date().toISOString()) {
    const films = new Map();
    for (const day of days) {
      if (!Array.isArray(day.releases)) throw new Error('Неверный формат афиши');
      for (const release of day.releases) {
        const id = String(release.id);
        let film = films.get(id);
        if (!film) {
          film = { id, title: release.title, age: release.age_rating, genres: (release.genres || []).map(g => g.title),
            duration: release.duration, poster: release.poster || release.thumbnail,
            badges: (release.qualifiers || []).filter(q => ['premiere', 'for_kids'].includes(q)),
            sessions: [] };
          films.set(id, film);
        }
        for (const s of release.seances || []) {
          if (s.cinema_id !== 8436 || film.sessions.some(q => q.id === s.id)) continue;
          if (!s.id || !s.start_date_time || !s.hall || !s.price) throw new Error('Неполные данные сеанса');
          film.sessions.push({ id: s.id, date: s.start_date, startsAt: s.start_date_time,
            time: new Intl.DateTimeFormat('ru-RU', {timeZone:'Europe/Moscow', hour:'2-digit', minute:'2-digit'}).format(new Date(s.start_date_time)),
            hall: 'Зал ' + s.hall.title, hallId: s.hall.id, capacity: s.hall.seats_limit,
            minPrice: s.price.min / 100, maxPrice: s.price.max / 100,
            formats: (s.formats || []).map(f => f.title).join(', '),
            online: !!s.is_allowed_online_sale });
        }
      }
    }
    return { source: 'https://kinostar-groznymall.com/', fetchedAt, dates: [...new Set(dates)].sort(),
      films: [...films.values()].filter(f => f.sessions.length).map(f => ({...f, sessions:f.sessions.sort((a,b)=>a.startsAt.localeCompare(b.startsAt))})) };
  }
  async function get(path) {
    const response = await fetch(base + path, { headers, credentials: 'omit', signal: AbortSignal.timeout(18000) });
    if (!response.ok) throw new Error('Расписание недоступно (' + response.status + ')');
    return response.json();
  }
  async function load() {
    const info = await get('/release/playbill/info?city_id=16&cinema_id=8436');
    const dates = info.calendar?.seance_dates;
    if (!Array.isArray(dates)) throw new Error('Не удалось прочитать даты');
    const days = [];
    for (let i = 0; i < dates.length; i += 3) {
      days.push(...await Promise.all(dates.slice(i,i+3).map(d => get('/release/playbill?city_id=16&date=' + encodeURIComponent(d)))));
    }
    return normalize(days, dates);
  }
  const source = { normalize, load };
  if (typeof module !== 'undefined') module.exports = source;
  else root.ScheduleSource = source;
})(typeof window === 'undefined' ? globalThis : window);
