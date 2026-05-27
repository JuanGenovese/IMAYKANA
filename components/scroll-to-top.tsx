"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const handleHashScroll = (hash: string, smooth = true) => {
      const id = decodeURIComponent(hash.replace("#", ""));
      const element = document.getElementById(id);
      if (element) {
        const headerHeight = 64;
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.scrollY;

        const viewportHeight = window.innerHeight;
        const elementHeight = elementRect.height;

        const middle = absoluteElementTop + (elementHeight / 2) - (viewportHeight + headerHeight) / 2;

        window.scrollTo({
          top: middle,
          behavior: smooth ? "smooth" : "instant" as ScrollBehavior,
        });
      }
    };

    const handleScroll = () => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      } else {
        handleHashScroll(window.location.hash, false);
      }
    };

    // Delay slightly to ensure layouts are fully rendered before calculating positions
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    // Click handler to intercept same-page hash links and scroll smoothly to center
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (href && (href.startsWith("#") || href.startsWith("/#") || href.includes("#"))) {
        const hashIndex = href.indexOf("#");
        const hash = href.substring(hashIndex);
        const pathBeforeHash = href.substring(0, hashIndex);

        const isSamePage =
          pathBeforeHash === "" ||
          pathBeforeHash === "/" ||
          pathBeforeHash === pathname ||
          (pathname === "/" && pathBeforeHash === "/");

        if (isSamePage) {
          const id = decodeURIComponent(hash.replace("#", ""));
          const element = document.getElementById(id);

          if (element) {
            e.preventDefault();
            window.history.pushState(null, "", hash);
            handleHashScroll(hash, true);
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });

    const handleHashChange = () => {
      handleHashScroll(window.location.hash, true);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleLinkClick, { capture: true });
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return null;
}
