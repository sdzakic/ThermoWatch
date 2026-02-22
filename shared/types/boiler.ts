import { InstallationStatusResponse } from "./status";

export interface BoilerData {
    trafficData: any;
    statusData: InstallationStatusResponse;
    installationId: number;
    fromCache: boolean;
}