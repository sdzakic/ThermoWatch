import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineString } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import { db } from "./firebase";
import { getBoilerDataWithAuth } from "./centrometal-api";

const centrometalEmail = defineString("CENTROMETAL_EMAIL");
const centrometalPassword = defineString("CENTROMETAL_PASSWORD");

export const pollBoilerData = onSchedule({ schedule: "every 20 minutes", region: "europe-west1", maxInstances: 1 }, async () => {
    const email = centrometalEmail.value();
    const password = centrometalPassword.value();

    if (!email || !password) {
        logger.error("CENTROMETAL_EMAIL or CENTROMETAL_PASSWORD not configured.");
        return;
    }

    try {
        logger.info("Scheduled poll: fetching boiler data...");
        const result = await getBoilerDataWithAuth(email, password);

        const now = new Date();
        const timestamp = now.toISOString();

        const snapshot = {
            timestamp,
            installationId: result.installationId,
            statusData: result.statusData,
            //trafficData: result.trafficData,
            fromCache: result.fromCache
        };

        // Write timestamped document for history
        await db.collection("boilerReadings").doc(timestamp).set(snapshot);

        // Overwrite "latest" document for quick access
        await db.collection("boilerReadings").doc("latest").set(snapshot);

        logger.info(`Scheduled poll complete. Saved reading at ${timestamp}`);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error("Scheduled poll failed:", errorMessage);
    }
});
