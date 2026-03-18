import { useEffect, useRef } from "react";

/**
 * Horizontal scroll section driven entirely by JS.
 *
 * How it works:
 *   1. The pin wrapper is tall (JS sets its height).
 *   2. The sticky child sticks at top:92px while the page scrolls through the pin.
 *   3. JS maps "how far we've scrolled past the sticky's stuck position" → translateX.
 *   4. Translation starts at 0 when the sticky first sticks, ends when all cards pass.
 *   5. After that, normal vertical scroll resumes.
 *
 * JSX structure:
 *   <div id={pinId}  className="section-hpin">
 *     <div           className="section-hsticky">
 *       <div id={trackId} className="section-htrack">
 *         {cards}
 *       </div>
 *     </div>
 *   </div>
 */
export function useSectionHScroll(trackId: string, pinId: string) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const track = document.getElementById(trackId) as HTMLElement | null;
    const pin   = document.getElementById(pinId)   as HTMLElement | null;
    if (!track || !pin) return;

    // On mobile let CSS handle it
    if (window.innerWidth <= 820) return;

    const STICKY_TOP = 92; // must match CSS top value on .section-hsticky

    // scrollY at which the sticky element becomes "stuck"
    // = distance from document top to pin top, minus the sticky offset
    let stickyStart = 0;
    let totalScroll = 0;

    const measure = () => {
      // Reset so we measure natural width
      track.style.transform = "translateX(0px)";

      // Natural width of the track = sum of card widths + gaps + padding
      const gap = 24;
      const children = Array.from(track.children) as HTMLElement[];
      let naturalWidth = 0;
      children.forEach((child, i) => {
        naturalWidth += child.offsetWidth;
        if (i < children.length - 1) naturalWidth += gap;
      });
      const cs = getComputedStyle(track);
      naturalWidth += parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

      totalScroll = Math.max(0, naturalWidth - window.innerWidth);

      // stickyStart = scrollY when the sticky first hits its top:92px position
      // = pin's distance from document top, minus STICKY_TOP
      const pinRect = pin.getBoundingClientRect();
      const pinDocTop = pinRect.top + window.scrollY;
      stickyStart = pinDocTop - STICKY_TOP;

      if (totalScroll <= 0) return;

      // Pin height = enough to scroll through all cards + one viewport height of breathing room
      pin.style.minHeight = `${totalScroll + window.innerHeight}px`;
    };

    const update = () => {
      if (totalScroll <= 0) return;

      // How many px we've scrolled past the point where sticky became stuck
      const scrolledPast = window.scrollY - stickyStart;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalScroll));
      track.style.transform = `translateX(${-progress * totalScroll}px)`;
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    const onResize = () => { measure(); update(); };

    // Delay so React + fonts are fully rendered before we measure
    const timer = setTimeout(() => { measure(); update(); }, 120);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trackId, pinId]);
}
