/* Inferno Racing — scroll choreography (GSAP + ScrollTrigger + Lenis). */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  /* ---------------- Navigation (works without GSAP) ---------------- */
  var nav = document.getElementById("nav");
  var toggle = nav.querySelector(".nav__toggle");
  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll(".nav__menu a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  if (!hasGsap) {
    finishIntro(true);
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Smooth scroll ---------------- */
  var lenis = null;
  if (!reduce && typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links: smooth, with room for the floating nav.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var target = id === "#top" ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === "#top" ? 0 : target, { offset: -84 });
      else window.scrollTo({ top: id === "#top" ? 0 : target.getBoundingClientRect().top + window.scrollY - 84, behavior: reduce ? "auto" : "smooth" });
      if (target.id) history.replaceState(null, "", id);
    });
  });

  // Lap progress under the nav.
  gsap.to(".lap__fill", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* ---------------- Intro: start lights ---------------- */
  var intro = document.getElementById("intro");
  var introDone = false;
  function finishIntro(instant) {
    if (introDone) return;
    introDone = true;
    try { sessionStorage.setItem("ir-intro", "1"); } catch (e) { /* ignore */ }
    if (typeof gsap === "undefined" || instant) {
      root.classList.add("no-intro");
      if (typeof heroIn === "function") heroIn(true);
      return;
    }
    gsap.to(intro, {
      yPercent: -100, duration: 0.7, ease: "power4.inOut",
      onComplete: function () { root.classList.add("no-intro"); if (lenis) lenis.start(); }
    });
    heroIn(false, 0.35);
  }

  function runIntro() {
    if (root.classList.contains("no-intro")) { heroIn(reduce); return; }
    if (lenis) lenis.stop();
    var pods = intro.querySelectorAll(".intro__pod");
    var tl = gsap.timeline();
    pods.forEach(function (p, i) { tl.call(function () { p.classList.add("on"); }, null, 0.25 + i * 0.32); });
    tl.call(function () { pods.forEach(function (p) { p.classList.remove("on"); }); }, null, "+=0.55");
    tl.call(function () { finishIntro(false); }, null, "+=0.08");
    document.getElementById("intro-skip").addEventListener("click", function () { tl.kill(); finishIntro(false); });
  }

  /* ---------------- Hero ---------------- */
  var heroPlayed = false;
  function heroIn(instant, delay) {
    if (heroPlayed) return;
    heroPlayed = true;
    if (instant) return;
    var d = delay || 0;
    var tl = gsap.timeline({ delay: d, defaults: { ease: "power4.out" } });
    tl.from(".hero__word--top", { x: function () { return -window.innerWidth * 0.6; }, opacity: 0, duration: 1.1 }, 0)
      .from(".hero__word--bottom", { x: function () { return window.innerWidth * 0.6; }, opacity: 0, duration: 1.1 }, 0.05)
      .from(".hero__car", { xPercent: -160, rotation: -4, duration: 1.2, ease: "expo.out" }, 0.25)
      .from(".hero__flame", { clipPath: "inset(0% 0% 0% 100%)", opacity: 0, duration: 1.0, ease: "expo.out" }, 0.35)
      .from(".hero__slogan span", { yPercent: 110, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.55)
      .from(".hero__chips .tag", { y: 20, opacity: 0, stagger: 0.06, duration: 0.6 }, 0.7)
      .from(".hero__badge", { scale: 0, duration: 0.9, ease: "back.out(2)" }, 0.8);
  }

  var mm = gsap.matchMedia();

  mm.add({
    desktop: "(min-width: 900px)",
    mobile: "(max-width: 899px)",
    motion: "(prefers-reduced-motion: no-preference)"
  }, function (ctx) {
    var c = ctx.conditions;
    if (!c.motion) return;

    /* Hero scroll: the car launches out, flame trail grows. */
    var heroTl = gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: c.desktop ? "+=110%" : "bottom top", scrub: 0.6, pin: c.desktop, anticipatePin: 1 }
    });
    heroTl
      .to(".hero__car-wrap", { xPercent: c.desktop ? 85 : 60, scale: c.desktop ? 1.35 : 1.15, ease: "power2.in" }, 0)
      .to(".hero__flame", { scaleX: 1.9, ease: "power1.in" }, 0)
      .to(".hero__word--top", { xPercent: -28, ease: "none" }, 0)
      .to(".hero__word--bottom", { xPercent: 22, ease: "none" }, 0)
      .to(".hero__meta", { y: -40, opacity: 0, ease: "power1.in" }, 0.1)
      .to(".hero__badge", { rotation: 200, y: 80, ease: "none" }, 0);

    /* Results: award cards slam down like stamps. */
    gsap.utils.toArray("[data-stamp]").forEach(function (card, i) {
      gsap.from(card, {
        scale: 1.45, rotation: [-9, 7, -5][i % 3], opacity: 0, y: -40,
        duration: 0.55, ease: "power4.in", delay: i * 0.14,
        scrollTrigger: { trigger: ".results__grid", start: "top 78%" },
        onComplete: function () { gsap.fromTo(card, { x: -4 }, { x: 0, duration: 0.25, ease: "elastic.out(3, 0.3)" }); }
      });
    });

    /* Identity: words light up as you read. */
    document.querySelectorAll("[data-reveal-words]").forEach(function (p) {
      var words = p.textContent.trim().split(/\s+/);
      p.setAttribute("aria-label", p.textContent.trim());
      p.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + "</span>"; }).join(" ");
      gsap.to(p.querySelectorAll(".w"), {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 45%", scrub: true }
      });
    });

    gsap.utils.toArray("[data-rise]").forEach(function (el, i) {
      gsap.from(el, { y: 70, rotation: i % 2 ? 2.5 : -2.5, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    /* The car: scroll turns it through every render angle. */
    var frames = gsap.utils.toArray(".car__frame");
    var specs = gsap.utils.toArray(".spec");
    var viewLabel = document.querySelector("[data-car-view]");
    var dotsWrap = document.querySelector("[data-car-dots]");
    dotsWrap.innerHTML = frames.map(function () { return "<i></i>"; }).join("");
    var dots = dotsWrap.querySelectorAll("i");
    var current = -1;
    function showFrame(i) {
      if (i === current) return;
      var prev = current;
      current = i;
      frames.forEach(function (f, k) {
        if (k === i) gsap.fromTo(f, { opacity: 0, scale: 0.92, rotation: prev < i ? -3 : 3 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "power3.out", overwrite: true });
        else gsap.to(f, { opacity: 0, duration: 0.25, overwrite: true });
      });
      specs.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
      viewLabel.textContent = frames[i].getAttribute("data-view");
    }
    showFrame(0);
    ScrollTrigger.create({
      trigger: c.desktop ? ".car__pin" : ".car__viewer",
      start: c.desktop ? "center center+=36" : "top 70%",
      end: c.desktop ? "+=" + frames.length * 55 + "%" : "+=" + frames.length * 140,
      pin: c.desktop ? ".car__pin" : false,
      anticipatePin: 1,
      scrub: true,
      onUpdate: function (self) { showFrame(Math.min(frames.length - 1, Math.floor(self.progress * frames.length))); }
    });

    /* Mass bar fills by weight. */
    var segs = gsap.utils.toArray(".mass__seg");
    gsap.to(segs, {
      flexGrow: function (i, el) { return parseFloat(el.getAttribute("data-g")); },
      duration: 1.2, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: "[data-mass]", start: "top 80%" }
    });

    /* Engineering: a horizontal pit lane. */
    var track = document.querySelector("[data-eng-track]");
    if (c.desktop) {
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var engTween = gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: ".eng__pin", start: "center center+=40", end: function () { return "+=" + dist(); },
          pin: ".eng", pinSpacing: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
      gsap.to("[data-eng-progress]", { scaleX: 1, ease: "none",
        scrollTrigger: { trigger: ".eng__pin", start: "center center+=40", end: function () { return "+=" + dist(); }, scrub: true } });
      gsap.utils.toArray(".panel").forEach(function (p) {
        gsap.from(p.querySelector(".panel__media img"), {
          scale: 1.25, rotation: 3, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: engTween, start: "left right", end: "center center", scrub: true }
        });
        gsap.from(p, {
          rotation: 4, y: 40, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: engTween, start: "left right", end: "left 55%", scrub: true }
        });
      });
    } else {
      gsap.utils.toArray(".panel").forEach(function (p, i) {
        gsap.from(p, { y: 60, rotation: i % 2 ? 2 : -2, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 88%" } });
      });
    }

    /* Drag: watch the bar shrink by half. */
    gsap.fromTo(".drag__bar--v3 i", { width: "100%" }, {
      width: "50.7%", ease: "power2.inOut",
      scrollTrigger: { trigger: "[data-drag]", start: "top 80%", end: "top 35%", scrub: 0.5 }
    });

    /* Drawings: a stacked pile fans out. */
    var drawings = gsap.utils.toArray(".drawing");
    if (c.desktop) {
      var spread = [[-34, 6, -10], [-11, -4, -3], [12, 4, 4], [34, -6, 11]];
      drawings.forEach(function (d, i) {
        gsap.fromTo(d, { xPercent: -50, yPercent: -50, x: 0, y: 40, rotation: (i - 1.5) * 2 }, {
          x: function () { return spread[i][0] / 100 * window.innerWidth * 0.62; },
          y: function () { return spread[i][1] * 6; },
          rotation: spread[i][2], ease: "power2.out",
          scrollTrigger: { trigger: "[data-drawings]", start: "top 85%", end: "center 50%", scrub: 0.6, invalidateOnRefresh: true }
        });
      });
    } else {
      drawings.forEach(function (d, i) {
        gsap.from(d, { x: i % 2 ? 80 : -80, rotation: i % 2 ? 6 : -6, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: d, start: "top 90%" } });
      });
    }

    /* Season: drive the car down the road. */
    buildSeason(c.desktop);

    /* Partners: tiers slide in from alternating sides. */
    gsap.utils.toArray("[data-tier]").forEach(function (t, i) {
      gsap.from(t, { x: i % 2 ? 120 : -120, rotation: i % 2 ? 2 : -2, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 88%" } });
      gsap.from(t.querySelectorAll(".logo-tile"), { scale: 0.6, opacity: 0, stagger: 0.08, duration: 0.5, ease: "back.out(2)", scrollTrigger: { trigger: t, start: "top 80%" } });
    });
    gsap.utils.toArray(".bars i").forEach(function (b) {
      var w = b.style.getPropertyValue("--w").trim();
      gsap.fromTo(b, { "--w": "0%" }, { "--w": w, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 92%" } });
    });

    /* Team: cards start as one deck, then get dealt out. */
    var deck = document.querySelector("[data-deck]");
    var members = gsap.utils.toArray(".member");
    if (c.desktop) {
      gsap.set(members, { transformOrigin: "50% 50%" });
      var dealTl = gsap.timeline({ scrollTrigger: { trigger: deck, start: "top 85%", end: "top 30%", scrub: 0.7, invalidateOnRefresh: true } });
      members.forEach(function (m, i) {
        // Measure layout positions (offsetLeft ignores transforms), so refreshes stay correct.
        dealTl.fromTo(m, {
          x: function () { return deck.offsetWidth / 2 - (m.offsetLeft + m.offsetWidth / 2); },
          y: 90, rotation: (i - 2) * 7, zIndex: 10 - Math.abs(i - 2)
        }, { x: 0, y: 0, rotation: 0, ease: "power2.out" }, 0);
      });
    } else {
      members.forEach(function (m, i) {
        gsap.from(m, { y: 70, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 0.7, ease: "back.out(1.6)", scrollTrigger: { trigger: m, start: "top 92%" } });
      });
    }
    gsap.fromTo("[data-group]", { clipPath: "inset(18% 22% 18% 22% round 16px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 16px)", ease: "none",
      scrollTrigger: { trigger: "[data-group]", start: "top 90%", end: "top 35%", scrub: true }
    });
    gsap.from("[data-group] img", { scale: 1.3, ease: "none", scrollTrigger: { trigger: "[data-group]", start: "top 90%", end: "bottom 40%", scrub: true } });

    /* Footer: slogan lines slide past each other. */
    gsap.utils.toArray("[data-slide]").forEach(function (el) {
      var dir = parseFloat(el.getAttribute("data-slide"));
      gsap.fromTo(el, { xPercent: dir * -25 }, { xPercent: dir * 8, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });
    });

    /* Section headings rise. */
    gsap.utils.toArray(".h-section, .h-sub").forEach(function (h) {
      gsap.from(h, { yPercent: 40, opacity: 0, skewY: 4, duration: 0.8, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 88%" } });
    });
    gsap.utils.toArray(".section__head .star").forEach(function (s) {
      gsap.to(s, { rotation: 360, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  // Active section highlight (created after the pinned sections so positions include pin spacing).
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  links.forEach(function (a) {
    var sec = document.querySelector(a.getAttribute("href"));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: "top 45%", end: "bottom 45%",
      onToggle: function (self) {
        if (self.isActive) links.forEach(function (l) { l.classList.toggle("is-active", l === a); });
        else a.classList.remove("is-active");
      }
    });
  });

  /* ---------------- Marquees driven by scroll velocity ---------------- */
  function marquee(el, speed) {
    if (!el) return;
    el.innerHTML += el.innerHTML; // seamless loop
    var x = 0, dir = 1, boost = 0, skew = 0;
    var half = function () { return el.scrollWidth / 2; };
    var setX = gsap.quickSetter(el, "x", "px");
    var setSkew = gsap.quickSetter(el, "skewX", "deg");
    if (reduce) return;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var v = self.getVelocity();
        dir = self.direction;
        boost = Math.min(Math.abs(v) / 120, 14);
        skew = gsap.utils.clamp(-10, 10, v / -250);
      }
    });
    gsap.ticker.add(function (t, dt) {
      var step = (speed + boost) * (dt / 16.67) * dir;
      x -= step;
      var h = half();
      if (h > 0) { if (x <= -h) x += h; if (x > 0) x -= h; }
      setX(x);
      boost *= 0.94;
      skew *= 0.9;
      setSkew(skew);
    });
  }
  marquee(document.querySelector("[data-marquee]"), 1.4);
  marquee(document.querySelector("[data-logo-marquee]"), 0.9);

  /* ---------------- Counters ---------------- */
  gsap.utils.toArray("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var fmt = el.hasAttribute("data-format");
    var suf = el.getAttribute("data-suffix") || "";
    var write = function (v) {
      var s = dec ? v.toFixed(dec) : String(Math.round(v));
      if (fmt) s = Math.round(v).toLocaleString("en-IN");
      el.textContent = s + suf;
    };
    if (reduce) { write(end); return; }
    var o = { v: 0 };
    write(0);
    gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", onUpdate: function () { write(o.v); },
      scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  /* ---------------- Season road ---------------- */
  function buildSeason(desktop) {
    var track = document.querySelector("[data-season]");
    var svg = document.querySelector("[data-season-svg]");
    var road = svg.querySelector("[data-road]");
    var dash = svg.querySelector("[data-road-dash]");
    var fill = svg.querySelector("[data-road-fill]");
    var car = document.querySelector("[data-season-car]");
    var stops = gsap.utils.toArray(".stop");

    function draw() {
      var h = track.offsetHeight;
      svg.setAttribute("viewBox", "0 0 120 " + h);
      var amp = desktop ? 38 : 0;
      var cx = 60, n = stops.length, seg = h / n;
      var d = "M" + cx + " 0";
      for (var i = 0; i < n; i++) {
        var y0 = i * seg, y1 = (i + 1) * seg;
        var side = i % 2 ? -1 : 1;
        d += " C" + (cx + side * amp) + " " + (y0 + seg * 0.35) + " " + (cx + side * amp) + " " + (y0 + seg * 0.65) + " " + cx + " " + y1;
      }
      [road, dash, fill].forEach(function (p) { p.setAttribute("d", d); });
      var len = fill.getTotalLength();
      fill.style.strokeDasharray = len;
      return len;
    }
    var len = draw();

    function place(progress) {
      var l = fill.getTotalLength();
      fill.style.strokeDashoffset = l * (1 - progress);
      var p = fill.getPointAtLength(l * progress);
      var p2 = fill.getPointAtLength(Math.min(l, l * progress + 2));
      var ang = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;
      var svgBox = svg.getBoundingClientRect();
      var trackBox = track.getBoundingClientRect();
      var scaleY = svgBox.height / track.offsetHeight;
      var left = svgBox.left - trackBox.left + p.x * (svgBox.width / 120);
      car.style.left = left + "px";
      car.style.top = p.y * scaleY + "px";
      car.style.rotate = ang + 180 + "deg"; // the render faces the other way, so turn it nose-first
    }

    ScrollTrigger.create({
      trigger: track, start: "top 60%", end: "bottom 60%", scrub: 0.4,
      onRefresh: function (self) { len = draw(); place(self.progress); },
      onUpdate: function (self) { place(self.progress); }
    });
    place(0);
    stops.forEach(function (s, i) {
      gsap.from(s, { x: desktop ? (i % 2 ? 140 : -140) : 60, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 0.7, ease: "back.out(1.4)",
        scrollTrigger: { trigger: s, start: "top 85%" } });
    });
  }

  // Reduced motion: show the season road fully drawn with the car at the finish.
  if (reduce) {
    var f = document.querySelector("[data-season-car]");
    if (f) f.style.display = "none";
  }

  runIntro();
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
