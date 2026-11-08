const {test}=require('node:test');
const assert=require('node:assert/strict');
const {normalize}=require('./schedule-source.js');
const seance = {id:'public-session',cinema_id:8436,hall:{id:40945,title:'4',seats_limit:101},start_date:'2026-11-07',start_date_time:'2026-11-07T09:45:00.000Z',price:{min:45000,max:50000},formats:[{title:'2D'}],is_allowed_online_sale:true};
const release = {id:25242,title:'Живая книга',age_rating:'6+',genres:[{title:'семейный'}],qualifiers:['premiere'],seances:[seance]};
test('preserves public session identity, local time, hall and price range',()=>{
  const data=normalize([{releases:[release]}],['2026-11-07']);
  const s=data.films[0].sessions[0];
  assert.equal(s.id,'public-session');assert.equal(s.time,'12:45');
  assert.equal(s.hall,'Зал 4');assert.equal(s.minPrice,450);assert.equal(s.maxPrice,500);
});
test('merges dates without duplicate sessions and excludes other cinemas',()=>{
  const other={...seance,id:'other-cinema',cinema_id:1};
  const tomorrow={...seance,id:'tomorrow',start_date:'2026-11-08',start_date_time:'2026-11-08T12:45:00+03:00'};
  const data=normalize([{releases:[release]},{releases:[{...release,seances:[seance,other,tomorrow]}]}],['2026-11-08','2026-11-07']);
  assert.equal(data.films.length,1);assert.equal(data.films[0].sessions.length,2);
  assert.deepEqual(data.dates,['2026-11-07','2026-11-08']);
});
test('rejects malformed schedule instead of replacing a good snapshot',()=>{
  assert.throws(()=>normalize([{}],['2026-11-07']));
  assert.throws(()=>normalize([{releases:[{...release,seances:[{...seance,price:null}]}]}],['2026-11-07']));
});
