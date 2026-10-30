(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var dropToggles = document.querySelectorAll(".drop-toggle");
  dropToggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      var willOpen = btn.getAttribute("aria-expanded") !== "true";

      dropToggles.forEach(function (other) {
        var otherId = other.getAttribute("aria-controls");
        var otherPanel = otherId ? document.getElementById(otherId) : null;
        other.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
      });

      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (panel) panel.hidden = !willOpen;
    });
  });

  document.addEventListener("click", function () {
    dropToggles.forEach(function (btn) {
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      btn.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  });
})();

(function () {
  var root = document.querySelector("[data-hero-slider]");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
  var prevBtn = root.querySelector("[data-hero-prev]");
  var nextBtn = root.querySelector("[data-hero-next]");
  var index = 0;
  var timer = null;
  var delay = 5500;

  function goTo(next) {
    if (!slides.length) return;
    index = (next + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dots.forEach(function (dot, i) {
      var active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function start() {
    stop();
    timer = setInterval(next, delay);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (nextBtn) nextBtn.addEventListener("click", function () { next(); start(); });
  if (prevBtn) prevBtn.addEventListener("click", function () { prev(); start(); });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goTo(Number(dot.getAttribute("data-hero-dot")));
      start();
    });
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", function (e) {
    if (!root.contains(e.relatedTarget)) start();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  goTo(0);
  start();
})();

(function () {
  var root = document.querySelector("[data-partner-slider]");
  if (!root) return;

  var track = root.querySelector("[data-partner-track]");
  var cards = Array.prototype.slice.call(root.querySelectorAll(".partner-card"));
  var prevBtn = root.querySelector("[data-partner-prev]");
  var nextBtn = root.querySelector("[data-partner-next]");
  var dotsWrap = root.querySelector("[data-partner-dots]");
  if (!track || !cards.length) return;

  var index = 0;
  var perView = 3;
  var gap = 20;

  function calcPerView() {
    var w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    var pages = maxIndex() + 1;
    for (var i = 0; i < pages; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "หน้า " + (i + 1));
      if (i === index) btn.classList.add("is-active");
      (function (page) {
        btn.addEventListener("click", function () {
          goTo(page);
        });
      })(i);
      dotsWrap.appendChild(btn);
    }
  }

  function goTo(next) {
    perView = calcPerView();
    var max = maxIndex();
    index = Math.max(0, Math.min(next, max));

    var cardWidth = cards[0].getBoundingClientRect().width;
    var offset = index * (cardWidth + gap);
    track.style.transform = "translateX(-" + offset + "px)";

    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll("button");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= max;
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      perView = calcPerView();
      buildDots();
      goTo(index);
    }, 120);
  });

  // keep CSS gap in sync (1.25rem ≈ 20px)
  gap = parseFloat(getComputedStyle(track).gap) || 20;
  perView = calcPerView();
  buildDots();
  goTo(0);
})();

(function () {
  var root = document.querySelector("[data-sub-slider]");
  if (!root) return;

  var track = root.querySelector("[data-sub-track]");
  var cards = Array.prototype.slice.call(root.querySelectorAll(".sub-card"));
  var prevBtn = root.querySelector("[data-sub-prev]");
  var nextBtn = root.querySelector("[data-sub-next]");
  var dotsWrap = root.querySelector("[data-sub-dots]");
  if (!track || !cards.length) return;

  var index = 0;
  var perView = 3;
  var gap = 20;

  function calcPerView() {
    var w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    var pages = maxIndex() + 1;
    for (var i = 0; i < pages; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "หน้า " + (i + 1));
      if (i === index) btn.classList.add("is-active");
      (function (page) {
        btn.addEventListener("click", function () {
          goTo(page);
        });
      })(i);
      dotsWrap.appendChild(btn);
    }
  }

  function goTo(next) {
    perView = calcPerView();
    var max = maxIndex();
    index = Math.max(0, Math.min(next, max));

    var cardWidth = cards[0].getBoundingClientRect().width;
    var offset = index * (cardWidth + gap);
    track.style.transform = "translateX(-" + offset + "px)";

    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll("button");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= max;
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      perView = calcPerView();
      buildDots();
      goTo(index);
    }, 120);
  });

  gap = parseFloat(getComputedStyle(track).gap) || 20;
  perView = calcPerView();
  buildDots();
  goTo(0);
})();

(function () {
  var root = document.querySelector("[data-news-slider]");
  if (!root) return;

  var track = root.querySelector("[data-news-track]");
  var cards = Array.prototype.slice.call(root.querySelectorAll(".news-card"));
  var prevBtn = root.querySelector("[data-news-prev]");
  var nextBtn = root.querySelector("[data-news-next]");
  var dotsWrap = root.querySelector("[data-news-dots]");
  if (!track || !cards.length) return;

  var index = 0;
  var perView = 3;
  var gap = 20;

  function calcPerView() {
    var w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - perView);
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    var pages = maxIndex() + 1;
    for (var i = 0; i < pages; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "หน้า " + (i + 1));
      if (i === index) btn.classList.add("is-active");
      (function (page) {
        btn.addEventListener("click", function () {
          goTo(page);
        });
      })(i);
      dotsWrap.appendChild(btn);
    }
  }

  function goTo(next) {
    perView = calcPerView();
    var max = maxIndex();
    index = Math.max(0, Math.min(next, max));

    var cardWidth = cards[0].getBoundingClientRect().width;
    var offset = index * (cardWidth + gap);
    track.style.transform = "translateX(-" + offset + "px)";

    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll("button");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= max;
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      perView = calcPerView();
      buildDots();
      goTo(index);
    }, 120);
  });

  gap = parseFloat(getComputedStyle(track).gap) || 20;
  perView = calcPerView();
  buildDots();
  goTo(0);
})();

(function () {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "gototop";
  btn.setAttribute("aria-label", "กลับขึ้นด้านบน");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btn);

  var visible = false;
  function sync() {
    var show = window.scrollY > 320;
    if (show === visible) return;
    visible = show;
    btn.classList.toggle("is-visible", show);
  }

  window.addEventListener("scroll", sync, { passive: true });
  sync();

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

(function () {
  var gallery = document.querySelector("[data-product-gallery]");
  if (!gallery) return;

  var main = document.getElementById("productMainImg");
  var thumbs = gallery.querySelectorAll(".product-gallery-thumbs button");
  if (!main || !thumbs.length) return;

  thumbs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-full");
      if (!src) return;
      main.src = src;
      thumbs.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
    });
  });

  var pageUrl = encodeURIComponent(window.location.href);
  document.querySelectorAll(".product-share a[href$='url=']").forEach(function (a) {
    a.href += pageUrl;
  });

  var copyBtn = document.querySelector('[data-share="copy"]');
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href);
      }
    });
  }
})();