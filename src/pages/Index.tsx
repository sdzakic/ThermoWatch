import { useState, useEffect } from "react";
import { StatusHeader } from "@/components/heating/StatusHeader";
import { HeatingSystemDiagram } from "@/components/heating/HeatingSystemDiagram";
import { TemperatureChart } from "@/components/heating/TemperatureChart";
import { SystemLog } from "@/components/heating/SystemLog";
import { PumpStatus } from "@/components/heating/PumpStatus";

// Generate mock temperature data
const generateChartData = () => {
  const data = [];
  const baseTime = new Date();
  baseTime.setMinutes(baseTime.getMinutes() - 30);

  for (let i = 0; i <= 30; i += 2) {
    const time = new Date(baseTime);
    time.setMinutes(time.getMinutes() + i);

    data.push({
      time: time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      boilerTemp: 150 + Math.sin(i / 5) * 20 + Math.random() * 5,
      bufferTop: 75 + Math.sin(i / 8) * 5 + Math.random() * 2,
      bufferBottom: 53 + Math.sin(i / 10) * 3 + Math.random() * 2,
      roomTemp: 19 + Math.sin(i / 15) * 0.5 + Math.random() * 0.3,
    });
  }

  return data;
};

const mockLogEntries = [
  {
    id: "1",
    timestamp: "2026-02-02 17:27:13",
    type: "warning" as const,
    code: "W11",
    description: "Out of fuel",
    startTime: "02.02.2026 17:27:13",
    endTime: "02.02.2026 17:29:17",
  },
  {
    id: "2",
    timestamp: "2026-02-02 15:16:40",
    type: "warning" as const,
    code: "W11",
    description: "Out of fuel",
    startTime: "02.02.2026 15:16:40",
    endTime: "02.02.2026 15:35:16",
  },
  {
    id: "3",
    timestamp: "2026-02-02 12:40:43",
    type: "warning" as const,
    code: "W11",
    description: "Out of fuel",
    startTime: "02.02.2026 12:40:43",
    endTime: "02.02.2026 13:42:39",
  },
  {
    id: "4",
    timestamp: "2026-02-02 03:24:39",
    type: "warning" as const,
    code: "W11",
    description: "Out of fuel",
    startTime: "02.02.2026 03:24:39",
    endTime: "02.02.2026 10:37:13",
  },
  {
    id: "5",
    timestamp: "2026-02-01 15:55:17",
    type: "info" as const,
    code: "I05",
    description: "System startup",
    startTime: "01.02.2026 15:55:17",
    endTime: "01.02.2026 15:57:15",
  },
  {
    id: "6",
    timestamp: "2026-01-31 17:04:03",
    type: "warning" as const,
    code: "W12",
    description: "Low buffer temperature",
    startTime: "31.01.2026 17:04:03",
    endTime: "31.01.2026 18:30:29",
  },
];

const mockPumps = [
  {
    id: "p1",
    name: "Pump P1 (Heating Circuit)",
    timeline: [
      { status: "on" as const, duration: 2 },
      { status: "off" as const, duration: 1 },
      { status: "on" as const, duration: 3 },
      { status: "off" as const, duration: 1 },
      { status: "on" as const, duration: 2 },
      { status: "off" as const, duration: 2 },
      { status: "on" as const, duration: 3 },
    ],
  },
  {
    id: "p3",
    name: "Pump P3 (Hot Water)",
    timeline: [
      { status: "standby" as const, duration: 1 },
      { status: "on" as const, duration: 1 },
      { status: "off" as const, duration: 2 },
      { status: "on" as const, duration: 1 },
      { status: "off" as const, duration: 3 },
      { status: "on" as const, duration: 2 },
      { status: "on" as const, duration: 2 },
    ],
  },
];

import { useBoilerData } from "@/hooks/useBoilerData";
import { formatDistanceToNow } from "date-fns";

const Index = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [timeRange, setTimeRange] = useState("30 min");

  const { data: boilerDataObj, loading: boilerLoading, error: boilerError, lastUpdate } = useBoilerData();

  if (boilerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading boiler data...</p>
        </div>
      </div>
    );
  }

  if (boilerError || !boilerDataObj) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">{boilerError || "Data format error"}</p>
        </div>
      </div>
    );
  }

  // Extract the first installation from the record payload
  const installationKeys = Object.keys(boilerDataObj);
  const instId = installationKeys[0];
  const instData = boilerDataObj[instId];
  if (!instData || !instData.params) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Invalid data format from boiler.</p>
      </div>
    );
  }

  const p = instData.params;

  // Safe parsing helper
  const parseNum = (val: any) => {
    if (!val || !val.v) return 0;
    const num = parseFloat(val.v);
    return isNaN(num) ? 0 : num;
  };

  const boilerTemp = parseNum(p.B_Tk1);
  const bufferTankTopTemp = parseNum(p.B_Tak1_1);
  const bufferTankBottomTemp = parseNum(p.B_Tak2_1);
  const radiatorSupplyTemp = parseNum(p.C1B_Tpol1);
  const radiatorReturnTemp = parseNum(p.B_Tptv1);
  const roomTemp = parseNum(p.C1B_Tsob1);

  const roomTempSetting = parseNum(p.C1B_Tsob);
  const roomTempCorrection = parseNum(p.C1B_kor);

  const isBoilerRunning = p.B_STATE?.v !== "OFF" && p.B_STATE?.v !== "0";
  const isPump1Running = p.B_P1?.v === "1";
  const isPump2Running = p.B_P2?.v === "1";

  const fanSpeed = parseNum(p.B_fan);
  const oxygenLevel = parseNum(p.B_Oxy1);

  const formattedLastUpdate = lastUpdate ? formatDistanceToNow(lastUpdate, { addSuffix: true }) : "Unknown";

  return (
    <div className="min-h-screen flex flex-col">
      <StatusHeader
        systemName={instData.installation?.type || "BioTec-L"}
        isConnected={true}
        lastUpdate={`Updated ${formattedLastUpdate}`}
      />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top row: System diagram and chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Diagram */}
            <HeatingSystemDiagram
              boilerTemp={boilerTemp}
              bufferTankTopTemp={bufferTankTopTemp}
              bufferTankBottomTemp={bufferTankBottomTemp}
              radiatorSupplyTemp={radiatorSupplyTemp}
              radiatorReturnTemp={radiatorReturnTemp}
              roomTemp={Number(roomTemp.toFixed(1))}
              roomTempSetting={roomTempSetting}
              roomTempCorrection={roomTempCorrection}
              isBoilerRunning={isBoilerRunning}
              isPump1Running={isPump1Running}
              isPump2Running={isPump2Running}
              fanSpeed={Number(fanSpeed.toFixed(1))}
              oxygenLevel={Number(oxygenLevel.toFixed(1))}
            />

            {/* Temperature Chart */}
            <TemperatureChart
              data={chartData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>

          {/* Bottom row: Log and Pump status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Log */}
            <SystemLog entries={mockLogEntries} />

            {/* Pump Status */}
            <PumpStatus
              pumps={mockPumps}
              dateRange="26.01.2026 - 02.02.2026"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
