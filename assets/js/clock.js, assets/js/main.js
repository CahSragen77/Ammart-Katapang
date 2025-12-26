// assets/js/clock.js
(function(){
  function pad(n){ return n < 10 ? '0' + n : n; }
  function updateClock(){
    const el = document.getElementById('clock');
    if(!el) return;
    const d = new Date();
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());
    el.textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 30 * 1000);
})();
