/** A single parameter value with its last-update timestamp */
export interface StatusParam {
    /** The parameter value (always a string, may represent number, enum, etc.) */
    v: string;
    /** UTC timestamp of last update, e.g. "2026-02-22 01:46:22" */
    ut: string;
}

/** All known parameter keys returned in the installation status response */
export interface StatusParams {
    // ── Boiler identity & metadata ──────────────────────────────────────
    /** Boiler brand name, e.g. "Centrometal" */
    B_BRAND: StatusParam;
    /** Installation/boiler model type, e.g. "BIOTEC-L" */
    B_INST: StatusParam;
    /** Product display name, e.g. "BioTec-L" */
    B_PRODNAME: StatusParam;
    /** Boiler power rating, e.g. "25kW" */
    B_sng: StatusParam;
    /** Firmware version of the boiler controller, e.g. "v2.47eL" */
    B_VER: StatusParam;
    /** WiFi module firmware version, e.g. "v1.15" */
    B_WifiVER: StatusParam;
    /** Boiler configuration number/variant */
    B_KONF: StatusParam;
    /** Support type identifier */
    B_SUP_TYPE: StatusParam;

    // ── Boiler operating state ──────────────────────────────────────────
    /** Current boiler state code, e.g. "GLW2" (glowing/ember phase 2) */
    B_STATE: StatusParam;
    /** Fan speed or on/off status (0 = off) */
    B_fan: StatusParam;
    /** Fuel level or hopper level sensor (0 = empty or not available) */
    B_lvl: StatusParam;
    /** CM2K module connection status (0 = not connected) */
    B_cm2k: StatusParam;

    // ── Boiler temperatures ─────────────────────────────────────────────
    /** Boiler water temperature (Tk = Temperatura kotla), e.g. "70.9" °C */
    B_Tk1: StatusParam;
    /** Flue gas / exhaust temperature (Tlo = Temperatura ložišta), e.g. "102" °C */
    B_Tlo1: StatusParam;
    /** Boiler feed temperature (Tdpl = Temperatura dovodnog polaznog leda), e.g. "48" °C */
    B_Tdpl1: StatusParam;
    /** Accumulation tank top temperature (Tak1_1), e.g. "66" °C */
    B_Tak1_1: StatusParam;
    /** Accumulation tank bottom temperature (Tak2_1), e.g. "49" °C */
    B_Tak2_1: StatusParam;
    /** DHW / hot water sensor temperature (Tpov = Temperatura potrošne vode), -55 = not connected */
    B_Tpov1: StatusParam;
    /** Return water temperature (Tptv = Temperatura povratne vode), -55 = not connected */
    B_Tptv1: StatusParam;
    /** Outdoor / ambient temperature sensor (Tva = Temperatura vanjskog), -55 = not connected */
    B_Tva1: StatusParam;
    /** Solar/additional heat source sensor (Ths), -55 = not connected */
    B_Ths1: StatusParam;

    // ── Boiler sensors ──────────────────────────────────────────────────
    /** Oxygen sensor reading (lambda probe), e.g. "9.4" % */
    B_Oxy1: StatusParam;

    // ── Pump states ─────────────────────────────────────────────────────
    /** Pump 1 on/off state (1 = running, 0 = stopped) — boiler circulation pump */
    B_P1: StatusParam;
    /** Pump 2 on/off state — DHW or secondary circuit pump */
    B_P2: StatusParam;
    /** Pump 3 on/off state — additional circuit pump */
    B_P3: StatusParam;

    // ── Pump demand/request flags ───────────────────────────────────────
    /** Pump 1 demand/request flag (zahP = zahtjev pumpe) */
    B_zahP1: StatusParam;
    /** Pump 2 demand/request flag */
    B_zahP2: StatusParam;
    /** Pump 3 demand/request flag */
    B_zahP3: StatusParam;

    // ── Boiler control parameters ───────────────────────────────────────
    /** Primary air supply percentage, e.g. "5" % */
    B_priS: StatusParam;
    /** Secondary air supply percentage, e.g. "100" % */
    B_secS: StatusParam;
    /** Ignition/glow plug or burner request (zar = zaržavanje), 1 = active */
    B_zar: StatusParam;

    // ── Circuit 1 (C1B) — heating circuit parameters ────────────────────
    /** Circuit type (1 = radiator, 2 = floor heating, etc.) */
    C1B_CircType: StatusParam;
    /** Day/night mode for circuit 1 (0 = day/normal mode) */
    C1B_dayNight: StatusParam;
    /** Heating room temperature setpoint correction */
    C1B_kor: StatusParam;
    /** Heating curve type (correction mode selector)??? */
    C1B_korType: StatusParam;
    /** Circuit 1 on/off (1 = enabled) */
    C1B_onOff: StatusParam;
    /** Circuit 1 pump state (0 = off, 1 = on) */
    C1B_P: StatusParam;
    /** Circuit 1 supply/flow setpoint temperature (polazna), e.g. "60" °C */
    C1B_Tpol: StatusParam;
    /** Circuit 1 actual supply/flow temperature sensor, -55 = not connected */
    C1B_Tpol1: StatusParam;
    /** Circuit 1 room temperature setpoint (sobna), e.g. "24" °C */
    C1B_Tsob: StatusParam;
    /** Circuit 1 actual room temperature sensor reading, e.g. "25.3" °C */
    C1B_Tsob1: StatusParam;

    // ── System / communication params ───────────────────────────────────
    /** Command timestamp — last command sent to the boiler */
    CMD_TIME: StatusParam;
    /** Keep-alive ping counter */
    PING: StatusParam;
    /** WiFi data request status ("?" = pending) */
    wf_req: StatusParam;

    // ── Parameter definitions (PDEF) — default values ───────────────────
    /** Default value for parameter group 15, index 0 (e.g. DHW setpoint default) */
    PDEF_15_0: StatusParam;
    /** Default value for parameter group 3, index 0 (e.g. boiler max temp default) */
    PDEF_3_0: StatusParam;
    /** Default value for parameter group 4, index 0 (e.g. primary air default) */
    PDEF_4_0: StatusParam;

    // ── Parameter max bounds (PMAX) ─────────────────────────────────────
    /** Max allowed value for parameter group 15, index 0 */
    PMAX_15_0: StatusParam;
    /** Max allowed value for parameter group 3, index 0 */
    PMAX_3_0: StatusParam;
    /** Max allowed value for parameter group 4, index 0 */
    PMAX_4_0: StatusParam;

    // ── Parameter min bounds (PMIN) ─────────────────────────────────────
    /** Min allowed value for parameter group 15, index 0 */
    PMIN_15_0: StatusParam;
    /** Min allowed value for parameter group 3, index 0 */
    PMIN_3_0: StatusParam;
    /** Min allowed value for parameter group 4, index 0 */
    PMIN_4_0: StatusParam;

    // ── Parameter current values (PVAL) ─────────────────────────────────
    /** Current value for parameter group 15, index 0 (e.g. DHW setpoint = 45 °C) */
    PVAL_15_0: StatusParam;
    /** Current value for parameter group 3, index 0 (e.g. boiler max temp = 86 °C) */
    PVAL_3_0: StatusParam;
    /** Current value for parameter group 4, index 0 (e.g. primary air = 5 %) */
    PVAL_4_0: StatusParam;
    /** Current value for parameter group 80, index 0 (e.g. room temp setpoint day = 24 °C) */
    PVAL_80_0: StatusParam;
    /** Current value for parameter group 81, index 0 (e.g. room temp setpoint night = 23 °C) */
    PVAL_81_0: StatusParam;
    /** Current value for parameter group 82, index 0 (e.g. comfort/eco mode = 0) */
    PVAL_82_0: StatusParam;

    // ── Service / error codes ───────────────────────────────────────────
    /** Service/error code register 0 (0 = no error) */
    SE00: StatusParam;
    /** Service/error code register 1 (bitmask or code, e.g. "2000000") */
    SE01: StatusParam;

    // ── Warning / notification codes ────────────────────────────────────
    /** Warning/notification code 1 — hex-encoded event, e.g. "N699A5E4C" */
    W11: StatusParam;
    /** Warning/notification code 2 — hex-encoded event, e.g. "P699A1CFF" */
    W12: StatusParam;

    /** Allow additional/unknown parameters from newer firmware versions */
    [key: string]: StatusParam;
}

/** Installation metadata returned alongside status params */
export interface InstallationInfo {
    /** Installation type identifier, e.g. "biotec" */
    type: string;
    /** Device serial number (hex), e.g. "664A5EFA" */
    serial: string;
    /** User permission level, e.g. "2" (string-encoded) */
    permissions: string;
    /** Optional template identifier */
    template: string | null;
    /** Country name, e.g. "Hrvatska" */
    country: string;
    /** ISO country code, e.g. "hr" */
    countryCode: string;
}

/** Status data for a single installation, keyed by installation ID */
export interface InstallationStatus {
    /** All parameter key-value pairs with timestamps */
    params: StatusParams;
    /** Installation metadata */
    installation: InstallationInfo;
}

/**
 * Top-level response from the installation-status-all endpoint.
 * Keyed by installation ID (numeric string), e.g. { "9289": { params, installation } }
 */
export type InstallationStatusResponse = Record<string, InstallationStatus>;
