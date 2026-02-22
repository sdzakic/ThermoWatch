const BASE_URL = 'https://portal.centrometal.hr';

const baseHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Origin': BASE_URL,
    'Referer': `${BASE_URL}/`
};

const username = "[EMAIL_ADDRESS]";
const password = "[PASSWORD]";

async function getBoilerData() {
    try {
        // 1. Initial hit to get CSRF and Session
        const initRes = await fetch(`${BASE_URL}/login`);
        const initHtml = await initRes.text();
        const csrfToken = initHtml.match(/name="_csrf_token"\s+value="([^"]+)"/)?.[1];
        let sessionCookie = initRes.headers.get('set-cookie');

        // 2. Login
        const loginRes = await fetch(`${BASE_URL}/login_check`, {
            method: 'POST',
            headers: { ...baseHeaders, 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': sessionCookie },
            body: new URLSearchParams({ '_csrf_token': csrfToken, '_username': username, '_password': password }),
            redirect: 'manual'
        });

        // Update with Auth Cookie
        sessionCookie = loginRes.headers.get('set-cookie') || sessionCookie;
        console.log("Logged in successfully.");

        // 3. Get Traffic / Historical Data (The new request)
        const installationId = 9289;
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

        console.log("Fetching traffic data and installation status...");
        const [trafficRes, statusRes] = await Promise.all([
            fetch(`${BASE_URL}/wdata/data/multi/traffic/${installationId}`, {
                method: 'POST',
                headers: { ...baseHeaders, 'Cookie': sessionCookie },
                body: JSON.stringify(trafficPayload)
            }),
            fetch(`${BASE_URL}/wdata/data/installation-status-all`, {
                method: 'POST',
                headers: { ...baseHeaders, 'Cookie': sessionCookie },
                body: JSON.stringify({ installations: [installationId] })
            })
        ]);

        const trafficData = await trafficRes.json();
        const statusData = await statusRes.json();

        // 4. Process the data
        console.log("--- Traffic Data ---");
        console.log(JSON.stringify(trafficData, null, 2));
        console.log("--- Installation Status ---");
        console.log(JSON.stringify(statusData, null, 2));

    } catch (err) {
        console.error("Operation failed:", err);
    }
}

getBoilerData();