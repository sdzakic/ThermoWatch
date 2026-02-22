import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getBoilerDataWithAuth } from "./centrometal-api";

setGlobalOptions({
    maxInstances: 1,
    region: "europe-west1",
    timeoutSeconds: 60,
    memory: "256MiB",
});

export { pollBoilerData } from "./scheduled";

export const getBoilerData = onRequest({ region: "europe-west1", maxInstances: 1 }, async (request, response) => {
    // Enable CORS
    response.set('Access-Control-Allow-Origin', '*');
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Methods', 'GET, POST');
        response.set('Access-Control-Allow-Headers', 'Content-Type');
        response.status(204).send('');
        return;
    }

    const { email, password } = request.body || {};
    const installationId = request.body?.installationId || null;

    if (!email || !password) {
        response.status(400).json({ error: "Missing 'email' or 'password' in request body." });
        return;
    }

    try {
        const result = await getBoilerDataWithAuth(email, password, installationId);
        response.json({ success: true, ...result });
    } catch (err: unknown) {
        logger.error("Operation failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        response.status(500).json({ error: errorMessage });
    }
});
