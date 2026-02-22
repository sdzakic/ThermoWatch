import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getBoilerDataWithAuth } from "./centrometal-api";

export { pollBoilerData } from "./scheduled";

export const getBoilerData = onRequest(async (request, response) => {
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
    } catch (err: any) {
        logger.error("Operation failed:", err);
        response.status(500).json({ error: err.message || "Unknown error occurred" });
    }
});
