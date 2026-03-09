const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const cursorGlow = document.querySelector(".cursor-glow");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const parallaxItems = document.querySelectorAll(".parallax");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
    });
  });
}

window.addEventListener("mousemove", (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.18,
  }
);

reveals.forEach((item) => revealObserver.observe(item));

const animateCounter = (el) => {
  const target = Number(el.dataset.target || 0);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));

  const update = () => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = current;
    requestAnimationFrame(update);
  };

  update();
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.8,
  }
);

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.15);
    item.style.transform = `translateY(${scrolled * speed}px)`;
  });

  const phoneCard = document.querySelector(".phone-card");
  const backCard = document.querySelector(".card-back");

  if (phoneCard) {
    const move = Math.min(scrolled * 0.05, 28);
    phoneCard.style.transform = `translateY(${move}px) rotateY(${-8 + scrolled * 0.01}deg)`;
  }

  if (backCard && window.innerWidth > 580) {
    const move = Math.min(scrolled * 0.03, 24);
    backCard.style.transform = `translateY(${-move}px) rotateZ(${-4}deg)`;
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});
