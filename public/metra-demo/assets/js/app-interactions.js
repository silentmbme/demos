(() => {
  // src/assets/js/app-interactions.js
  (function() {
    "use strict";
    function hideLoader() {
      const loader = document.getElementById("loader");
      if (loader) {
        loader.classList.add("d-none");
      }
    }
    window.addEventListener("load", hideLoader);
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
    const today = /* @__PURE__ */ new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    const endDateFormatted = endDate.toISOString().split("T")[0];
    const dateRangeInput = document.querySelector("#daterange");
    if (dateRangeInput && !dateRangeInput._flatpickr) {
      flatpickr(dateRangeInput, {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: [startDate, endDateFormatted],
        onReady: function(selectedDates, dateStr, instance) {
          updateInputDisplay([startDate, endDateFormatted], instance);
        },
        onChange: function(selectedDates, dateStr, instance) {
          updateInputDisplay(selectedDates, instance);
        }
      });
    }
    function updateInputDisplay(dates, instance) {
      if (dates.length === 2) {
        const startDateFormatted = formatDate(dates[0]);
        const endDateFormatted2 = formatDate(dates[1]);
        instance.input.value = `${startDateFormatted} to ${endDateFormatted2}`;
      } else {
        instance.input.value = "";
      }
    }
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${day}, ${month} ${year}`;
    }
    const pickrContainerBackground = document.querySelector(
      ".pickr-container-background"
    );
    const themeContainerBackground = document.querySelector(
      ".theme-container-background"
    );
    const nanoThemes1 = [
      [
        "nano",
        {
          defaultRepresentation: "RGB",
          components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
              hex: false,
              rgba: true,
              hsva: false,
              input: true,
              clear: false,
              save: false
            }
          }
        }
      ]
    ];
    const nanoButtons1 = [];
    let nanoPickr1 = null;
    for (const [theme, config] of nanoThemes1) {
      const button = document.createElement("button");
      button.innerHTML = theme;
      nanoButtons1.push(button);
      button.addEventListener("click", () => {
        const el = document.createElement("p");
        pickrContainerBackground.appendChild(el);
        if (nanoPickr1) {
          nanoPickr1.destroyAndRemove();
        }
        for (const btn of nanoButtons1) {
          btn.classList[btn === button ? "add" : "remove"]("active");
        }
        nanoPickr1 = new Pickr(
          Object.assign(
            {
              el,
              theme,
              default: localStorage.bodyBgRGB ? `rgb(${localStorage.bodyBgRGB})` : "#121c31"
            },
            config
          )
        );
        nanoPickr1.on("changestop", (source, instance) => {
          let color = instance.getColor().toRGBA();
          let html2 = document.querySelector("html");
          html2.style.setProperty(
            "--theme-body-bg-rgb",
            `${color[0]}, ${color[1]}, ${color[2]}`
          );
          document.querySelector("html").style.setProperty(
            "--theme-body-bg-rgb2",
            `${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14}`
          );
          document.querySelector("html").style.setProperty(
            "--theme-light-rgb",
            `${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14}`
          );
          document.querySelector("html").style.setProperty(
            "--theme-form-control-bg",
            `rgb(${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14})`
          );
          document.querySelector("html").style.setProperty(
            "--theme-gray-3",
            `rgb(${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14})`
          );
          localStorage.removeItem("bgtheme");
          html2.setAttribute("data-theme-color", "dark");
          html2.setAttribute("data-menu-color", "dark");
          html2.setAttribute("data-header-color", "dark");
          localStorage.setItem("metrauiThemeMode", "dark");
          localStorage.setItem("metrauiMenu", "dark");
          localStorage.setItem("metrauiHeader", "dark");
          document.querySelector("#switcher-menu-dark").checked = true;
          document.querySelector("#switcher-header-dark").checked = true;
          document.querySelector("#switcher-dark-theme").checked = true;
          localStorage.setItem(
            "bodyBgRGB",
            `${color[0]}, ${color[1]}, ${color[2]}`
          );
          localStorage.setItem(
            "bodylightRGB",
            `${color[0] + 14}, ${color[1] + 14}, ${color[2] + 14}`
          );
        });
      });
      themeContainerBackground.appendChild(button);
    }
    nanoButtons1[0].click();
    function toggleTheme() {
      let html2 = document.querySelector("html");
      if (html2.getAttribute("data-theme-color") === "dark") {
        html2.setAttribute("data-theme-color", "light");
        html2.setAttribute("data-header-color", "transparent");
        html2.setAttribute("data-menu-color", "dark");
        if (!localStorage.getItem("primaryRGB")) {
          html2.setAttribute("style", "");
        }
        html2.removeAttribute("data-bg-theme");
        document.querySelector("#switcher-light-theme").checked = true;
        document.querySelector("#switcher-menu-dark").checked = true;
        document.querySelector("html").style.removeProperty("--theme-body-bg-rgb", localStorage.bodyBgRGB);
        html2.style.removeProperty("--theme-body-bg-rgb2");
        html2.style.removeProperty("--theme-light-rgb");
        html2.style.removeProperty("--theme-form-control-bg");
        html2.style.removeProperty("--theme-input-border");
        document.querySelector("#switcher-header-transparent").checked = true;
        document.querySelector("#switcher-menu-dark").checked = true;
        document.querySelector("#switcher-light-theme").checked = true;
        document.querySelector("#switcher-background4").checked = false;
        document.querySelector("#switcher-background3").checked = false;
        document.querySelector("#switcher-background2").checked = false;
        document.querySelector("#switcher-background1").checked = false;
        document.querySelector("#switcher-background").checked = false;
        localStorage.removeItem("metrauidarktheme");
        localStorage.setItem("metrauiThemeMode", "light");
        localStorage.setItem("metrauiMenu", "dark");
        localStorage.removeItem("metrauiHeader");
        localStorage.removeItem("bodylightRGB");
        localStorage.removeItem("bodyBgRGB");
        html2.setAttribute("data-header-color", "transparent");
      } else {
        html2.setAttribute("data-theme-color", "dark");
        html2.setAttribute("data-header-color", "transparent");
        if (!localStorage.getItem("primaryRGB")) {
          html2.setAttribute("style", "");
        }
        html2.setAttribute("data-menu-color", "transparent");
        document.querySelector("#switcher-dark-theme").checked = true;
        document.querySelector("#switcher-menu-transparent").checked = true;
        document.querySelector("#switcher-header-transparent").checked = true;
        document.querySelector("#switcher-menu-transparent").checked = true;
        document.querySelector("#switcher-header-transparent").checked = true;
        document.querySelector("#switcher-dark-theme").checked = true;
        document.querySelector("#switcher-background4").checked = false;
        document.querySelector("#switcher-background3").checked = false;
        document.querySelector("#switcher-background2").checked = false;
        document.querySelector("#switcher-background1").checked = false;
        document.querySelector("#switcher-background").checked = false;
        localStorage.setItem("metrauidarktheme", "true");
        localStorage.setItem("metrauiThemeMode", "dark");
        localStorage.setItem("metrauiMenu", "transparent");
        localStorage.setItem("metrauiHeader", "transparent");
        localStorage.removeItem("bodylightRGB");
        localStorage.removeItem("bodyBgRGB");
      }
    }
    let layoutSetting = document.querySelector(".topbar-theme-toggle");
    layoutSetting.addEventListener("click", toggleTheme);
    let html = document.querySelector("html");
    if (html.getAttribute("data-layout-style") === "dualmenu") {
      let toggleTheme1 = function() {
        let html2 = document.querySelector("html");
        if (html2.getAttribute("data-theme-color") === "dark") {
          html2.setAttribute("data-theme-color", "light");
          html2.setAttribute("data-header-color", "transparent");
          html2.setAttribute("data-menu-color", "dark");
          if (!localStorage.getItem("primaryRGB")) {
            html2.setAttribute("style", "");
          }
          html2.removeAttribute("data-bg-theme");
          document.querySelector("#switcher-light-theme").checked = true;
          document.querySelector("#switcher-menu-dark").checked = true;
          document.querySelector("html").style.removeProperty("--theme-body-bg-rgb", localStorage.bodyBgRGB);
          html2.style.removeProperty("--theme-body-bg-rgb2");
          html2.style.removeProperty("--theme-light-rgb");
          html2.style.removeProperty("--theme-form-control-bg");
          html2.style.removeProperty("--theme-input-border");
          document.querySelector("#switcher-header-transparent").checked = true;
          document.querySelector("#switcher-menu-dark").checked = true;
          document.querySelector("#switcher-light-theme").checked = true;
          document.querySelector("#switcher-background4").checked = false;
          document.querySelector("#switcher-background3").checked = false;
          document.querySelector("#switcher-background2").checked = false;
          document.querySelector("#switcher-background1").checked = false;
          document.querySelector("#switcher-background").checked = false;
          localStorage.removeItem("metrauidarktheme");
          localStorage.setItem("metrauiThemeMode", "light");
          localStorage.setItem("metrauiMenu", "dark");
          localStorage.removeItem("metrauiHeader");
          localStorage.removeItem("bodylightRGB");
          localStorage.removeItem("bodyBgRGB");
          html2.setAttribute("data-header-color", "transparent");
        } else {
          html2.setAttribute("data-theme-color", "dark");
          html2.setAttribute("data-header-color", "transparent");
          if (!localStorage.getItem("primaryRGB")) {
            html2.setAttribute("style", "");
          }
          html2.setAttribute("data-menu-color", "transparent");
          document.querySelector("#switcher-dark-theme").checked = true;
          document.querySelector("#switcher-menu-transparent").checked = true;
          document.querySelector("#switcher-header-transparent").checked = true;
          document.querySelector("#switcher-menu-transparent").checked = true;
          document.querySelector("#switcher-header-transparent").checked = true;
          document.querySelector("#switcher-dark-theme").checked = true;
          document.querySelector("#switcher-background4").checked = false;
          document.querySelector("#switcher-background3").checked = false;
          document.querySelector("#switcher-background2").checked = false;
          document.querySelector("#switcher-background1").checked = false;
          document.querySelector("#switcher-background").checked = false;
          localStorage.setItem("metrauidarktheme", "true");
          localStorage.setItem("metrauiThemeMode", "dark");
          localStorage.setItem("metrauiMenu", "transparent");
          localStorage.setItem("metrauiHeader", "transparent");
          localStorage.removeItem("bodylightRGB");
          localStorage.removeItem("bodyBgRGB");
        }
      };
      let layoutSetting1 = document.querySelector(".layout-setting-doublemenu");
      layoutSetting1.addEventListener("click", toggleTheme1);
    }
    document.addEventListener("DOMContentLoaded", function() {
      var genericExamples = document.querySelectorAll("select[data-trigger]");
      for (let i2 = 0; i2 < genericExamples.length; ++i2) {
        var element = genericExamples[i2];
        new Choices(element, {
          allowHTML: true,
          placeholderValue: "This is a placeholder set in the config",
          searchPlaceholderValue: "Search"
        });
      }
    });
    const yearElement = document.getElementById("year");
    yearElement.innerHTML = (/* @__PURE__ */ new Date()).getFullYear();
    Waves.attach(".btn-wave", ["waves-light"]);
    Waves.init();
    let DIV_CARD = ".card";
    let cardRemoveBtn = document.querySelectorAll(
      '[data-bs-toggle="card-remove"]'
    );
    cardRemoveBtn.forEach((ele) => {
      ele.addEventListener("click", function(e) {
        e.preventDefault();
        let $this = this;
        let card = $this.closest(DIV_CARD);
        card.remove();
        return false;
      });
    });
    let cardFullscreenBtn = document.querySelectorAll(
      '[data-bs-toggle="card-fullscreen"]'
    );
    cardFullscreenBtn.forEach((ele) => {
      ele.addEventListener("click", function(e) {
        let $this = this;
        let card = $this.closest(DIV_CARD);
        card.classList.toggle("card-fullscreen");
        card.classList.remove("card-collapsed");
        e.preventDefault();
        return false;
      });
    });
    var i = 1;
    setInterval(() => {
      document.querySelectorAll(".count-up").forEach((ele) => {
        if (ele.getAttribute("data-count") >= i) {
          i = i + 1;
          ele.innerText = i;
        }
      });
    }, 10);
    window.addEventListener("scroll", () => {
      var widnowScroll = document.body.scrollTop || document.documentElement.scrollTop, height = document.documentElement.scrollHeight - document.documentElement.clientHeight, scrollAmount = widnowScroll / height * 100;
      document.querySelector(".progress-top-bar").style.width = scrollAmount + "%";
    });
    const scrollToTop = document.querySelector(".scrollToTop");
    const $rootElement = document.documentElement;
    const $body = document.body;
    window.onscroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const clientHt = $rootElement.scrollHeight - $rootElement.clientHeight;
      if (window.scrollY > 100) {
        scrollToTop.style.display = "flex";
      } else {
        scrollToTop.style.display = "none";
      }
    };
    scrollToTop.onclick = () => {
      window.scrollTo(0, 0);
    };
    var myHeadernotification = document.getElementById("header-notification-scroll");
    if (myHeadernotification) {
      new SimpleBar(myHeadernotification, { autoHide: true });
    }
    var myHeaderCart = document.getElementById("header-cart-items-scroll");
    if (myHeaderCart) {
      new SimpleBar(myHeaderCart, { autoHide: true });
    }
  })();
  var customSwitch = document.querySelectorAll(".toggle");
  customSwitch.forEach(
    (e) => e.addEventListener("click", () => {
      e.classList.toggle("on");
    })
  );
  var headerbtn = document.querySelectorAll(".dropdown-item-close");
  headerbtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      let cartCount = document.querySelectorAll(".dropdown-item-close").length;
      const cartDataEl = document.getElementById("cart-data");
      const cartBadgeEl = document.getElementById("cart-icon-badge");
      e.preventDefault();
      e.stopPropagation();
      button.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
      cartCount = document.querySelectorAll(".dropdown-item-close").length;
      if (cartDataEl) {
        cartDataEl.innerText = `${cartCount}`;
      }
      if (cartBadgeEl) {
        cartBadgeEl.innerText = `${cartCount}`;
      }
      console.log(cartCount);
      if (cartCount == 0) {
        let elementHide = document.querySelector(".topbar-cart-empty");
        let elementShow = document.querySelector(".topbar-empty");
        if (elementHide) {
          elementHide.classList.add("d-none");
        }
        if (elementShow) {
          elementShow.classList.remove("d-none");
        }
      }
    });
  });
  var minValue = 0;
  var maxValue = 30;
  var productMinusBtn = document.querySelectorAll(".product-quantity-minus");
  var productPlusBtn = document.querySelectorAll(".product-quantity-plus");
  productMinusBtn.forEach((button) => {
    button.onclick = () => {
      const input = button.parentElement.querySelector("input");
      let value = Number(input.value);
      if (value > minValue) {
        value -= 1;
        input.value = value;
      }
    };
  });
  productPlusBtn.forEach((button) => {
    button.onclick = () => {
      const input = button.parentElement.querySelector("input");
      let value = Number(input.value);
      if (value < maxValue) {
        value += 1;
        input.value = value;
      }
    };
  });
})();
