import * as logger from "firebase-functions/logger";
import { BoilerData } from "../../shared/types";

const BASE_URL = 'https://portal.centrometal.hr';

const baseHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Origin': BASE_URL,
    'Referer': `${BASE_URL}/`
};

// Cache the session cookie globally so that warm function instances can reuse it
let cachedSessionCookie: string | null = null;
let cachedInstallationId: number | null = null;

// ── Individual API calls ────────────────────────────────────────────────

export async function performLogin(email: string, password: string): Promise<string | null> {
    const initRes = await fetch(`${BASE_URL}/login`);
    const initHtml = await initRes.text();
    const csrfToken = initHtml.match(/name="_csrf_token"\s+value="([^"]+)"/)?.[1];
    const sessionCookie = initRes.headers.get('set-cookie');

    if (!csrfToken) {
        throw new Error("Could not find CSRF token on login page.");
    }

    const loginRes = await fetch(`${BASE_URL}/login_check`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': sessionCookie || ''
        },
        body: new URLSearchParams({
            '_csrf_token': csrfToken,
            '_username': email,
            '_password': password
        }).toString(),
        redirect: 'manual'
    });

    const newCookie = loginRes.headers.get('set-cookie') || sessionCookie;
    return newCookie;
}

export async function fetchInstallationId(cookie: string): Promise<number | null> {
    const res = await fetch(`${BASE_URL}/data/autocomplete/installation`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Content-Type': 'application/json;charset=UTF-8',
            'Cookie': cookie
        },
        body: "{}"
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.installations?.length > 0) {
        return data.installations[0].value;
    }
    return null;
}

export async function fetchTrafficData(cookie: string, installationId: number | string): Promise<any | null> {
    const trafficPayload = {
        "params": [
            { "name": "B_Tk1", "color": "#ff0000", "curveType": "function" },
            { "name": "B_Tak1_1", "color": "#ff0080", "curveType": "function" },
            { "name": "B_Tak2_1", "color": "#8000ff", "curveType": "function" },
            { "name": "B_Tlo1", "color": "#800040", "curveType": "function" },
            { "name": "B_Tdpl1", "color": "#ff8000", "curveType": "function" }
        ],
        "interval": "30"
    };

    const trafficRes = await fetch(`${BASE_URL}/wdata/data/multi/traffic/${installationId}`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Content-Type': 'application/json;charset=UTF-8',
            'Cookie': cookie
        },
        body: JSON.stringify(trafficPayload),
        redirect: 'manual'
    });

    if (trafficRes.status >= 300 && trafficRes.status < 400) {
        return null;
    }

    if (!trafficRes.ok) {
        return null;
    }

    return await trafficRes.json();
}

export async function fetchInstallationStatus(cookie: string, installationId: number | string): Promise<any | null> {
    const statusRes = await fetch(`${BASE_URL}/wdata/data/installation-status-all`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Content-Type': 'application/json;charset=UTF-8',
            'Cookie': cookie
        },
        body: JSON.stringify({ installations: [Number(installationId)] }),
        redirect: 'manual'
    });

    if (statusRes.status >= 300 && statusRes.status < 400) {
        return null;
    }

    if (!statusRes.ok) {
        return null;
    }

    return await statusRes.json();
}

// Re-export shared types so downstream consumers don't need to change imports
export type { InstallationStatusResponse, InstallationStatus, InstallationInfo, StatusParams, StatusParam, BoilerData } from "../../shared/types";

// ── High-level orchestrator ─────────────────────────────────────────────

/**
 * Authenticates (with session caching) and fetches both traffic + status data.
 * Handles cookie caching and automatic re-login on expiry.
 */
export async function getBoilerDataWithAuth(
    email: string,
    password: string,
    installationId?: number | null
): Promise<BoilerData> {
    let instId = installationId || cachedInstallationId;

    // 1. Try with cached cookie if available
    if (cachedSessionCookie) {
        logger.info("Attempting to fetch with cached session cookie");

        if (!instId) {
            instId = await fetchInstallationId(cachedSessionCookie);
        }

        if (instId) {
            const [trafficData, statusData] = await Promise.all([
                fetchTrafficData(cachedSessionCookie, instId),
                fetchInstallationStatus(cachedSessionCookie, instId)
            ]);
            if (trafficData && statusData) {
                cachedInstallationId = instId;
                logger.info("Cached session cookie was successful");
                return { trafficData, statusData, installationId: instId, fromCache: true };
            }
        } else {
            logger.info("Could not resolve installationId with cached session. Might be expired.");
        }

        logger.info("Cached session cookie invalid or expired. Re-authenticating.");
        cachedSessionCookie = null;
    }

    // 2. Perform Login
    logger.info("Performing login to get new session cookie");
    const newCookie = await performLogin(email, password);

    if (!newCookie) {
        throw new Error("Failed to obtain session cookie during login.");
    }

    cachedSessionCookie = newCookie;

    // 3. Fetch installation ID if we still don't have it
    if (!instId) {
        instId = await fetchInstallationId(cachedSessionCookie);
    }

    if (!instId) {
        throw new Error("Successfully logged in, but failed to fetch installation ID.");
    }

    cachedInstallationId = instId;

    // 4. Fetch data with new session
    const [trafficData, statusData] = await Promise.all([
        fetchTrafficData(cachedSessionCookie, instId),
        fetchInstallationStatus(cachedSessionCookie, instId)
    ]);

    if (!trafficData || !statusData) {
        throw new Error("Successfully logged in, but failed to fetch data.");
    }

    return { trafficData, statusData, installationId: instId, fromCache: false };
}
