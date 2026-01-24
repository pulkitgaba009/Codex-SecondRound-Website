import { useEffect } from "react";

export default function SecureQuiz({ onAutoSubmit }) {
  useEffect(() => {
    // ---------- STEP 1: REQUEST FULLSCREEN ----------
    const enterFullscreen = async () => {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      } catch (err) {
        // Some browsers require this call from a user gesture — handle errors silently
        console.warn("Fullscreen request failed:", err);
      }
    };
    enterFullscreen();

    // ---------- STEP 2: BLOCK / INTERCEPT KEY SHORTCUTS ----------
    const allowedKeys = [
      // add any keys you want to allow (by default we block many combos)
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab", // if you want to allow tab, remove from blocking below
    ];

    const handleKeyDown = (e) => {
      // If it's a single harmless key (and you want to allow it) -> return
      if (!e.ctrlKey && !e.metaKey && !e.altKey && allowedKeys.includes(e.key)) {
        return;
      }

      // Block copy/paste/cut/select-all/find etc when modifiers are present
      // Common combos to block:
      const blockedCombos = [
        // Ctrl/Cmd + C/X/V/A/S/P/F/U/I/J/O/W/T/Y
        "c",
        "x",
        "v",
        "a",
        "s",
        "p",
        "f",
        "u",
        "i",
        "j",
        "o",
        "w",
        "t",
        "y",
        "r",
      ];

      const keyLower = (e.key || "").toLowerCase();

      // If any modifier present (ctrl/meta/alt) — try to block common combinations
      if (e.ctrlKey || e.metaKey) {
        if (blockedCombos.includes(keyLower) || e.key === "Tab" || e.key === "Escape") {
          e.preventDefault?.();
          e.stopPropagation?.();
          // stopImmediatePropagation is a bit aggressive but helps block other listeners
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          // gentle UI feedback
          // NOTE: avoid too many alerts — popup flood can be annoying
          // You may prefer a non-blocking toast in real UI.
          console.log("Blocked shortcut:", e.key, { ctrl: e.ctrlKey, meta: e.metaKey, alt: e.altKey });
          return false;
        }
      }

      // Block right-click / context menu keys if desired (Key: contextmenu or Shift+F10)
      if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
        e.preventDefault?.();
        e.stopPropagation?.();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
      }

      // If Alt+Tab / Windows key / OS-level — can't reliably block; detect focus loss instead
    };

    // Use capture so we see events before the page-level handlers and possibly before browser handlers
    document.addEventListener("keydown", handleKeyDown, { capture: true });

    // ---------- STEP 2b: BLOCK CONTEXT MENU & CLIPBOARD EVENTS ----------
    const disableEvent = (e) => {
      e.preventDefault();
      e.stopPropagation?.();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    };

    document.addEventListener("contextmenu", disableEvent, { capture: true });
    document.addEventListener("copy", disableEvent, { capture: true });
    document.addEventListener("cut", disableEvent, { capture: true });
    document.addEventListener("paste", disableEvent, { capture: true });

    // ---------- STEP 3: FULLSCREEN CHANGE / VISIBILITY / BLUR DETECTION ----------
    const onFullScreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (!isFullscreen) {
        // You left fullscreen — auto submit
        try {
          onAutoSubmit?.();
        } catch (err) {
          console.error("onAutoSubmit threw:", err);
        }
      }
    };

    // vendor-prefixed events
    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("mozfullscreenchange", onFullScreenChange);
    document.addEventListener("MSFullscreenChange", onFullScreenChange);

    // Detect when page loses visibility (switch tab, alt+tab, minimized)
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Automatically submit if you consider switching tabs unacceptable
        try {
          onAutoSubmit?.();
        } catch (err) {
          console.error("onAutoSubmit threw:", err);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Detect blur (window losing focus)
    const onBlur = () => {
      // sometimes blur happens while interacting with OS—choose behavior carefully
      try {
        onAutoSubmit?.();
      } catch (err) {
        console.error("onAutoSubmit threw:", err);
      }
    };
    window.addEventListener("blur", onBlur);

    // ---------- CLEANUP ----------
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("contextmenu", disableEvent, { capture: true });
      document.removeEventListener("copy", disableEvent, { capture: true });
      document.removeEventListener("cut", disableEvent, { capture: true });
      document.removeEventListener("paste", disableEvent, { capture: true });

      document.removeEventListener("fullscreenchange", onFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
      document.removeEventListener("mozfullscreenchange", onFullScreenChange);
      document.removeEventListener("MSFullscreenChange", onFullScreenChange);

      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [onAutoSubmit]);

  return null;
}
