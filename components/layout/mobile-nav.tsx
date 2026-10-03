"use client";

import { Menu, X } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import type { NavSection } from "@/lib/content";

import { DocsSidebar } from "./docs-sidebar";

/**
 * Below the lg breakpoint the sidebar moves into a native <dialog>, which
 * gives us a focus trap, Escape to close and an inert background for free.
 */
export function MobileNav({ nav }: { nav: NavSection[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 lg:hidden"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <Menu aria-hidden="true" />
      </Button>
      <dialog
        ref={dialog}
        aria-label="Tutorial navigation"
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        className="bg-background text-foreground backdrop:bg-background/70 open:animate-in open:slide-in-from-left-4 open:fade-in-0 m-0 h-dvh max-h-none w-[min(20rem,86vw)] max-w-none border-r p-0 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="eyebrow">Contents</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Close navigation"
            onClick={close}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <nav aria-label="Tutorial sections" className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
          <DocsSidebar nav={nav} onNavigate={close} />
        </nav>
      </dialog>
    </>
  );
}
