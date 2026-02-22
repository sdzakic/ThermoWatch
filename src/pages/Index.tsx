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

const Index = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [timeRange, setTimeRange] = useState("30 min");
  
  // Simulated live values
  const [systemState, setSystemState] = useState({
    boilerTemp: 157,
    bufferTankTopTemp: 75,
    bufferTankBottomTemp: 53,
    radiatorSupplyTemp: 65,
    radiatorReturnTemp: 45,
    roomTemp: 22.0,
    targetTemp: 22.0,
    isBoilerRunning: true,
    isPump1Running: true,
    isPump2Running: true,
    fanSpeed: 5.0,
    oxygenLevel: 8.3,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemState((prev) => ({
        ...prev,
        boilerTemp: prev.boilerTemp + (Math.random() - 0.5) * 2,
        bufferTankTopTemp: prev.bufferTankTopTemp + (Math.random() - 0.5) * 0.5,
        bufferTankBottomTemp: prev.bufferTankBottomTemp + (Math.random() - 0.5) * 0.3,
        roomTemp: prev.roomTemp + (Math.random() - 0.5) * 0.1,
        fanSpeed: Math.max(0, Math.min(100, prev.fanSpeed + (Math.random() - 0.5) * 0.5)),
        oxygenLevel: Math.max(0, Math.min(21, prev.oxygenLevel + (Math.random() - 0.5) * 0.2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <StatusHeader 
        systemName="BioTec-L" 
        isConnected={true} 
        lastUpdate="Just now" 
      />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top row: System diagram and chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Diagram */}
            <HeatingSystemDiagram
              boilerTemp={Math.round(systemState.boilerTemp)}
              bufferTankTopTemp={Math.round(systemState.bufferTankTopTemp)}
              bufferTankBottomTemp={Math.round(systemState.bufferTankBottomTemp)}
              radiatorSupplyTemp={systemState.radiatorSupplyTemp}
              radiatorReturnTemp={systemState.radiatorReturnTemp}
              roomTemp={Number(systemState.roomTemp.toFixed(1))}
              targetTemp={systemState.targetTemp}
              isPump1Running={systemState.isPump1Running}
              isPump2Running={systemState.isPump2Running}
              isBoilerRunning={systemState.isBoilerRunning}
              fanSpeed={Number(systemState.fanSpeed.toFixed(1))}
              oxygenLevel={Number(systemState.oxygenLevel.toFixed(1))}
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
