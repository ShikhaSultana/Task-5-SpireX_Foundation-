/* ============================================
   Testimonials Section
   Responsive carousel + animated stats
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const track   = document.getElementById("track");
  const cards   = Array.from(track.children);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsBox = document.getElementById("dots");

  let index = 0;          // current first visible card
  let perView = 3;        // cards visible at once
  let maxIndex = 0;

  /* ---------- How many cards fit per view ---------- */
  const getPerView = () => {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 980) return 2;
    return 3;
  };

  /* ---------- Build pagination dots ---------- */
  const buildDots = () => {
    dotsBox.innerHTML = "";
    const pages = maxIndex + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === index ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to testimonial page ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsBox.appendChild(dot);
    }
  };

  /* ---------- Move the track ---------- */
  const update = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = index * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // dots
    Array.from(dotsBox.children).forEach((d, i) =>
      d.classList.toggle("active", i === index)
    );

    // buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;
  };

  const goTo = (i) => {
    index = Math.max(0, Math.min(i, maxIndex));
    update();
  };

  /* ---------- Recalculate on resize ---------- */
  const recalc = () => {
    perView = getPerView();
    maxIndex = Math.max(0, cards.length - perView);
    if (index > maxIndex) index = maxIndex;
    buildDots();
    update();
  };

  /* ---------- Controls ---------- */
  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // Keyboard arrows
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  /* ---------- Touch / swipe support ---------- */
  let startX = 0, isDown = false;
  const viewport = document.querySelector(".carousel__viewport");

  viewport.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDown = true;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (!isDown) return;
    isDown = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? goTo(index + 1) : goTo(index - 1);
    }
  });

  /* ---------- Autoplay ---------- */
  let autoplay = setInterval(() => {
    goTo(index >= maxIndex ? 0 : index + 1);
  }, 5000);

  const stopAutoplay = () => clearInterval(autoplay);
  const startAutoplay = () => {
    stopAutoplay();
    autoplay = setInterval(() => {
      goTo(index >= maxIndex ? 0 : index + 1);
    }, 5000);
  };

  [prevBtn, nextBtn, viewport].forEach((el) => {
    el.addEventListener("mouseenter", stopAutoplay);
    el.addEventListener("mouseleave", startAutoplay);
  });

  /* ---------- Animated stat counters ---------- */
  const stats = document.querySelectorAll(".stat__num");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = target * eased;

      let display;
      if (decimals > 0) {
        display = value.toFixed(decimals);
      } else {
        display = Math.floor(value).toLocaleString();
      }
      el.textContent = display + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else {
        el.textContent =
          (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((s) => statObserver.observe(s));
  } else {
    stats.forEach(animateCount);
  }

  /* ---------- Init ---------- */
  recalc();
  window.addEventListener("resize", recalc);
});
