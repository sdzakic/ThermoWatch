import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InstallationStatusResponse } from "@shared/types/status";

export function useBoilerData() {
    const [data, setData] = useState<InstallationStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        // Listen to the latest boiler reading document
        const unsubscribe = onSnapshot(
            doc(db, "boilerReadings", "latest"),
            (docSnap) => {
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    setData(docData.statusData as InstallationStatusResponse);

                    if (docData.timestamp) {
                        setLastUpdate(new Date(docData.timestamp));
                    } else {
                        setLastUpdate(new Date());
                    }

                    setError(null);
                } else {
                    setError("No boiler data available yet.");
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching boiler data:", err);
                setError("Failed to fetch boiler data. Please ensure you are logged in.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error, lastUpdate };
}
