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
    const handleScroll = () => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    };

    handleScroll();
    window.addEventListener("popstate", handleScroll);
    return () => window.removeEventListener("popstate", handleScroll);
  }, [pathname]);

  return null;
}
