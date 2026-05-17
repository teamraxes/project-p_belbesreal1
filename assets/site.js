/* Belbes — shared site behaviour
   - sticky header scroll state
   - mobile nav drawer
   - lead form: budget chips + soft validation + success state
*/
(function () {
  // ── Header scroll ──────────────────────────────────────────────
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 80) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ── Mobile nav ─────────────────────────────────────────────────
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileClose = document.querySelector(".mobile-nav__close");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      mobileNav.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  }
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener("click", function () {
      mobileNav.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  }
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // ── Budget chips ───────────────────────────────────────────────
  document.querySelectorAll(".budget-chips").forEach(function (group) {
    var hidden = group.querySelector("input[type=hidden]");
    group.querySelectorAll(".budget-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        group.querySelectorAll(".budget-chip").forEach(function (c) {
          c.setAttribute("aria-pressed", "false");
        });
        chip.setAttribute("aria-pressed", "true");
        if (hidden) hidden.value = chip.getAttribute("data-value") || "";
      });
    });
  });

  // ── Lead form ──────────────────────────────────────────────────
  var form = document.querySelector("form.form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      // soft validation: required fields
      form.querySelectorAll("[data-required]").forEach(function (input) {
        var field = input.closest(".field");
        var error = field ? field.querySelector(".field__error") : null;
        var v = (input.value || "").trim();
        if (!v) {
          valid = false;
          if (field) field.classList.add("is-error");
          if (error) error.textContent = input.getAttribute("data-required-msg") || "Заполните поле";
        } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          valid = false;
          if (field) field.classList.add("is-error");
          if (error) error.textContent = "Похоже, в адресе опечатка";
        } else {
          if (field) field.classList.remove("is-error");
          if (error) error.textContent = "";
        }
      });
      if (!valid) return;
      // success: replace form body with confirmation
      var success = form.querySelector(".form__success");
      var body = form.querySelector(".form__body");
      if (success && body) {
        body.classList.add("is-hidden");
        success.classList.remove("is-hidden");
        var name = (form.querySelector("[name=name]") || {}).value || "";
        var nameOut = form.querySelector("[data-name-out]");
        if (nameOut) nameOut.textContent = name.split(" ")[0] || "";
      }
    });
    // clear error on input
    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) {
          field.classList.remove("is-error");
          var error = field.querySelector(".field__error");
          if (error) error.textContent = "";
        }
      });
    });
  }
})();
