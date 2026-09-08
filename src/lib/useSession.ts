"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "shiesty_handle";

function readStoredHandle(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(KEY);
}

export function useSession() {
  const [handle, setHandleState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reading sessionStorage is a sync read from an external system on mount —
    // exactly what effects are for. Single one-time read, no cascading updates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHandleState(readStoredHandle());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  const setHandle = useCallback((h: string) => {
    setHandleState(h);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(KEY, h);
    }
  }, []);

  return { handle, setHandle, loaded };
}
