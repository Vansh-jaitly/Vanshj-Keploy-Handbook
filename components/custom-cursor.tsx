"use client";

import { useEffect, useRef } from "react";

/*
 * A small monochrome cursor system. One fixed, pointer-events:none element is
 * moved with transforms on pointermove (no easing, so it never lags), and its
 * shape is picked from what is under the pointer. It only switches on for a
 * real mouse (hover + fine pointer); touch, pen and no-JS visitors keep the
 * native cursor. Elements can force a state with data-cursor="pointer|text|
 * move|resize|not-allowed".
 */

type CursorState = "default" | "pointer" | "text" | "not-allowed" | "move" | "resize";

const INTERACTIVE =
  'a[href], button, [role="button"], [role="tab"], [role="link"], summary, label[for], select, input[type="checkbox"], input[type="radio"], [data-cursor="pointer"]';
const EDITABLE =
  'input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';
const READABLE = "p, li, pre, code, h1, h2, h3, h4, td, th, dd, dt, blockquote, figcaption";
const DISABLED = ':disabled, [aria-disabled="true"], [data-cursor="not-allowed"]';

function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "default";
  const forced = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  if (target.closest(DISABLED)) return "not-allowed";
  if (forced === "move" || forced === "resize" || forced === "text") return forced;
  if (target.closest(INTERACTIVE)) return "pointer";
  if (target.closest(EDITABLE)) return "text";
  if (target.closest(READABLE)) return "text";
  return "default";
}

const stroke = {
  fill: "#ffffff",
  stroke: "#0a0a0a",
  strokeWidth: 1.15,
  strokeLinejoin: "miter" as const,
};

/** Each shape is drawn so that its hotspot sits at the element's origin. */
function Shapes() {
  return (
    <>
      <svg data-shape="default" width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
        <path d="M1.5 1.5 V17.2 L5.4 13.5 L8.2 20 L11 18.8 L8.3 12.4 H13.8 Z" {...stroke} />
      </svg>
      <svg
        data-shape="pointer"
        width="22"
        height="24"
        viewBox="0 0 22 24"
        aria-hidden="true"
        style={{ marginLeft: -8, marginTop: -1.5 }}
      >
        <path
          d="M6.6 3.1 a1.6 1.6 0 0 1 3.2 0 V10.2 l.1-.05 V8.9 a1.5 1.5 0 0 1 3 0 v1.5 a1.5 1.5 0 0 1 3 .2 v1.2 a1.45 1.45 0 0 1 2.9.3 V16.6 c0 3.6-2.4 5.9-5.8 5.9 H11.4 c-2 0-3.3-.8-4.5-2.4 L2.3 14.4 a1.6 1.6 0 0 1 2.4-2.1 L6.6 14.1 Z"
          {...stroke}
        />
        <path
          d="M9.9 13.6 V17.6 M12.9 13.6 V17.6 M15.9 13.6 V17.6"
          stroke="#0a0a0a"
          strokeWidth={1}
        />
      </svg>
      <svg
        data-shape="text"
        width="12"
        height="22"
        viewBox="0 0 12 22"
        aria-hidden="true"
        style={{ marginLeft: -6, marginTop: -11 }}
      >
        <g fill="none" strokeLinecap="square">
          <path
            d="M2 1.5 H5 Q6 1.5 6 3 Q6 1.5 7 1.5 H10 M6 3 V19 M2 20.5 H5 Q6 20.5 6 19 Q6 20.5 7 20.5 H10"
            stroke="#ffffff"
            strokeWidth={3.2}
          />
          <path
            d="M2 1.5 H5 Q6 1.5 6 3 Q6 1.5 7 1.5 H10 M6 3 V19 M2 20.5 H5 Q6 20.5 6 19 Q6 20.5 7 20.5 H10"
            stroke="#0a0a0a"
            strokeWidth={1.2}
          />
        </g>
      </svg>
      <svg data-shape="not-allowed" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <path d="M1.5 1.5 V17.2 L5.4 13.5 L8.2 20 L11 18.8 L8.3 12.4 H13.8 Z" {...stroke} />
        <circle cx="19" cy="19" r="5.2" fill="#ffffff" stroke="#0a0a0a" strokeWidth={1.4} />
        <path d="M15.4 22.6 L22.6 15.4" stroke="#0a0a0a" strokeWidth={1.4} />
      </svg>
      <svg
        data-shape="move"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        aria-hidden="true"
        style={{ marginLeft: -11, marginTop: -11 }}
      >
        <path
          d="M11 1 L14.5 4.8 H12.2 V9.8 H17.2 V7.5 L21 11 L17.2 14.5 V12.2 H12.2 V17.2 H14.5 L11 21 L7.5 17.2 H9.8 V12.2 H4.8 V14.5 L1 11 L4.8 7.5 V9.8 H9.8 V4.8 H7.5 Z"
          {...stroke}
        />
      </svg>
      <svg
        data-shape="resize"
        width="24"
        height="14"
        viewBox="0 0 24 14"
        aria-hidden="true"
        style={{ marginLeft: -12, marginTop: -7 }}
      >
        <path d="M1 7 L6.5 1.5 V5 H17.5 V1.5 L23 7 L17.5 12.5 V9 H6.5 V12.5 Z" {...stroke} />
      </svg>
    </>
  );
}

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;
    let active = false;

    const show = () => {
      if (!active) {
        active = true;
        html.classList.add("has-custom-cursor");
      }
      el.style.opacity = "1";
    };
    const hide = () => {
      el.style.opacity = "0";
    };
    const disable = () => {
      active = false;
      html.classList.remove("has-custom-cursor");
      hide();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !finePointer.matches) {
        disable();
        return;
      }
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      show();
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const next = stateFor(e.target);
      if (el.dataset.state !== next) el.dataset.state = next;
    };
    const onDown = () => {
      if (!reducedMotion.matches) el.dataset.pressed = "true";
    };
    const onUp = () => {
      delete el.dataset.pressed;
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };
    const onMedia = () => {
      if (!finePointer.matches) disable();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("blur", hide);
    finePointer.addEventListener("change", onMedia);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("blur", hide);
      finePointer.removeEventListener("change", onMedia);
      disable();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" data-state="default" className="custom-cursor">
      <div className="custom-cursor__shape">
        <Shapes />
      </div>
    </div>
  );
}
