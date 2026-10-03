"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        window.scrollTo({ top: 0 });
        document.getElementById("top")?.focus({ preventScroll: true });
      }}
      className={cn(
        "fixed right-4 bottom-4 z-40 rounded-full shadow-md transition-opacity sm:right-6 sm:bottom-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
}
