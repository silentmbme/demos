"use strict";
(() => {
  // src/assets/js/sticky.js
  var navbar = document.getElementById("sidebar");
  var navbar1 = document.getElementById("header");
  var sticky = navbar.offsetTop;
  var sticky1 = navbar1.offsetTop;
  function stickyFn() {
    if (window.scrollY >= sticky) {
      navbar.classList.add("sticky-pin");
    } else {
      navbar.classList.remove("sticky-pin");
    }
    if (window.scrollY >= sticky1) {
      navbar1.classList.add("sticky-pin");
    } else {
      navbar1.classList.remove("sticky-pin");
    }
  }
  (() => {
    window.addEventListener("scroll", stickyFn);
    window.addEventListener("DOMContentLoaded", stickyFn);
  })();
})();
