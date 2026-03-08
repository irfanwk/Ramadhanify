"use client";

import { useEffect, useState } from "react";

export function ServerStatusIndicator() {
    const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");

    useEffect(() => {
        async function checkHealth() {
            try {
                // Assume NEXT_PUBLIC_API_URL is configured
                const res = await fetch(`http://localhost:4000/health`);
                const data = await res.json();
                if (data.status === "OK") {
                    setStatus("ok");
                } else {
                    setStatus("error");
                }
            } catch {
                setStatus("error");
            }
        }

        checkHealth();
    }, []);

    return (
        <div className="flex items-center gap-2 mt-4 text-xs font-mono bg-secondary/50 px-3 py-1.5 rounded-full inline-flex">
            <span className="opacity-80">Server Status:</span>
            {status === "checking" && <span className="text-yellow-500 animate-pulse">Checking...</span>}
            {status === "ok" && <span className="text-primary font-bold">[OK] Connected</span>}
            {status === "error" && <span className="text-red-500 font-bold">[ERROR] Disconnected</span>}
        </div>
    );
}
