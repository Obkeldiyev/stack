import { useEffect } from "react";

export function useMarketingMotion() {
  useEffect(() => {
    const page = document.querySelector(".landing-page") as HTMLElement | null;
    const reveals = Array.from(document.querySelectorAll(".reveal"));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.18 }
    );

    reveals.forEach((item) => revealObserver.observe(item));

    const updateScroll = () => {
      if (!page) return;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      page.style.setProperty("--scroll-progress", String(window.scrollY / maxScroll));
    };

    const updateCursor = (event: MouseEvent) => {
      if (!page) return;
      page.style.setProperty("--glow-x", `${event.clientX}px`);
      page.style.setProperty("--glow-y", `${event.clientY}px`);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("mousemove", updateCursor);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("mousemove", updateCursor);
      revealObserver.disconnect();
    };
  }, []);
}
