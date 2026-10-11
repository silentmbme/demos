(() => {
  // src/assets/js/coming-soon.js
  (() => {
    "use strict";
    const countdown = document.querySelector("#coming-soon-countdown");
    if (countdown) {
      const launchDate = new Date(countdown.dataset.launchDate).getTime();
      const fields = {
        days: countdown.querySelector('[data-time="days"]'),
        hours: countdown.querySelector('[data-time="hours"]'),
        minutes: countdown.querySelector('[data-time="minutes"]'),
        seconds: countdown.querySelector('[data-time="seconds"]')
      };
      let timer;
      const updateCountdown = () => {
        const remaining = Math.max(0, launchDate - Date.now());
        const values = {
          days: Math.floor(remaining / 864e5),
          hours: Math.floor(remaining % 864e5 / 36e5),
          minutes: Math.floor(remaining % 36e5 / 6e4),
          seconds: Math.floor(remaining % 6e4 / 1e3)
        };
        Object.entries(values).forEach(([key, value]) => {
          if (fields[key])
            fields[key].textContent = key === "days" ? String(value) : String(value).padStart(2, "0");
        });
        if (remaining === 0) window.clearInterval(timer);
      };
      updateCountdown();
      timer = window.setInterval(updateCountdown, 1e3);
    }
    const year = document.querySelector("#coming-soon-year");
    if (year) year.textContent = String((/* @__PURE__ */ new Date()).getFullYear());
    const signup = document.querySelector("#coming-soon-signup");
    signup?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = signup.querySelector('input[type="email"]');
      const note = document.querySelector("#coming-soon-signup-note");
      if (!input?.checkValidity()) {
        input?.reportValidity();
        return;
      }
      if (note) {
        note.textContent = signup.dataset.noticeKind === "maintenance" ? "Thanks. Your email passed validation; maintenance notifications are not connected yet." : "Thanks for your interest. Your email passed validation; signup storage is not connected yet.";
        note.classList.add("text-success");
      }
      signup.querySelector('button[type="submit"]')?.setAttribute("disabled", "disabled");
      input.value = "";
    });
  })();
})();
