import { Flame } from "lucide-react";

interface HeatingSystemDiagramProps {
  boilerTemp: number;
  bufferTankTopTemp: number;
  bufferTankBottomTemp: number;
  radiatorSupplyTemp: number;
  radiatorReturnTemp: number;
  roomTemp: number;
  targetTemp: number;
  isBoilerRunning: boolean;
  isPump1Running: boolean;
  isPump2Running: boolean;
  fanSpeed?: number;
  oxygenLevel?: number;
}

// Pump component
function Pump({
  isRunning,
  label,
  className
}: {
  isRunning: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isRunning
          ? "border-primary bg-primary/20 shadow-glow"
          : "border-idle bg-idle/10"
          }`}
      >
        {/* Pump impeller */}
        <div className="relative w-5 h-5">
          <div
            className={`absolute inset-0 ${isRunning ? "animate-spin" : ""}`}
            style={{ animationDuration: "1s" }}
          >
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2.5 rounded-full ${isRunning ? "bg-primary" : "bg-idle"}`} />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-2.5 rounded-full ${isRunning ? "bg-primary" : "bg-idle"}`} />
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-1 rounded-full ${isRunning ? "bg-primary" : "bg-idle"}`} />
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-1 rounded-full ${isRunning ? "bg-primary" : "bg-idle"}`} />
          </div>
          <div className={`absolute inset-[35%] rounded-full ${isRunning ? "bg-primary" : "bg-idle"}`} />
        </div>

        {/* Running indicator */}
        {isRunning && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-card" />
        )}
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 font-medium">{label}</span>
      <span className={`text-[9px] ${isRunning ? "text-success" : "text-idle"}`}>
        {isRunning ? "ON" : "OFF"}
      </span>
    </div>
  );
}

export function HeatingSystemDiagram({
  boilerTemp,
  bufferTankTopTemp,
  bufferTankBottomTemp,
  radiatorSupplyTemp,
  radiatorReturnTemp,
  roomTemp,
  targetTemp,
  isBoilerRunning,
  isPump1Running,
  isPump2Running,
  fanSpeed = 5.0,
  oxygenLevel = 8.3,
}: HeatingSystemDiagramProps) {
  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">System Overview</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">P1:</span>
            <span className={`w-2 h-2 rounded-full ${isPump1Running ? "bg-success" : "bg-idle"}`} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">P2:</span>
            <span className={`w-2 h-2 rounded-full ${isPump2Running ? "bg-success" : "bg-idle"}`} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isBoilerRunning ? "bg-heating animate-pulse" : "bg-idle"}`} />
            <span className="text-xs text-muted-foreground">{isBoilerRunning ? "Active" : "Standby"}</span>
          </div>
        </div>
      </div>

      {/* System Schematic */}
      <div className="relative w-full h-80 sm:h-96">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* SVG Pipes Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 320" preserveAspectRatio="xMidYMid meet">
          {/* Pipes from Boiler to Buffer Tank */}
          {/* Hot pipe (top) - boiler to buffer via P1 */}
          <path
            d="M 115 110 L 160 110 L 160 80 L 250 80"
            fill="none"
            stroke={isBoilerRunning ? "hsl(var(--heating))" : "hsl(var(--idle))"}
            strokeWidth="6"
            strokeLinecap="round"
            className={isBoilerRunning ? "animate-pulse" : ""}
          />
          {/* Cold return pipe (bottom) - buffer to boiler */}
          <path
            d="M 115 210 L 160 210 L 160 240 L 250 240"
            fill="none"
            stroke="hsl(var(--cooling))"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Pipes from Buffer to Radiator via P2 */}
          {/* Hot supply (top) */}
          <path
            d="M 310 80 L 380 80 L 380 95"
            fill="none"
            stroke={isPump2Running ? "hsl(var(--heating))" : "hsl(var(--idle))"}
            strokeWidth="6"
            strokeLinecap="round"
            className={isPump2Running ? "animate-pulse" : ""}
          />
          <path
            d="M 380 135 L 380 150 L 430 150"
            fill="none"
            stroke={isPump2Running ? "hsl(var(--heating))" : "hsl(var(--idle))"}
            strokeWidth="6"
            strokeLinecap="round"
            className={isPump2Running ? "animate-pulse" : ""}
          />
          {/* Cold return (bottom) */}
          <path
            d="M 310 240 L 380 240 L 380 200 L 430 200"
            fill="none"
            stroke="hsl(var(--cooling))"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Flow direction arrows */}
          {isBoilerRunning && (
            <>
              <polygon points="155,106 165,110 155,114" fill="hsl(var(--heating))" />
            </>
          )}
          {isPump2Running && (
            <>
              <polygon points="370,76 380,80 370,84" fill="hsl(var(--heating))" />
            </>
          )}
        </svg>

        {/* Boiler Unit */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-24 sm:w-28">
          <div className={`relative rounded-xl border-2 ${isBoilerRunning ? "border-heating bg-gradient-to-t from-heating/20 to-heating/5" : "border-idle bg-secondary/30"} p-3`}>
            {/* Fire visualization */}
            <div className="flex justify-center mb-2">
              {isBoilerRunning ? (
                <div className="relative">
                  <Flame className="w-8 h-8 text-heating animate-pulse" />
                  <Flame className="absolute top-0 left-1 w-6 h-6 text-orange-400 animate-pulse opacity-70" style={{ animationDelay: "0.2s" }} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">OFF</span>
                </div>
              )}
            </div>

            {/* Boiler temp */}
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold ${isBoilerRunning ? "text-heating" : "text-foreground"}`}>
                {boilerTemp}°C
              </div>
              <div className="text-[10px] text-muted-foreground">Boiler</div>
            </div>

            {/* Stats */}
            <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Fan</span>
                <span className="text-foreground">{fanSpeed}%</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">O₂</span>
                <span className="text-foreground">{oxygenLevel}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pump P1 - Between Boiler and Buffer Tank (on hot pipe) */}
        <div className="absolute left-[28%] sm:left-[26%] top-[63%]">
          <Pump isRunning={isPump1Running} label="P1" />
        </div>

        {/* Buffer Tank */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 sm:w-20">
          <div className="relative rounded-2xl border-2 border-primary/30 bg-gradient-to-t from-cooling/20 via-primary/10 to-heating/20 h-36 sm:h-44 overflow-hidden">
            {/* Water level gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />

            {/* Top temp */}
            <div className="absolute top-2 left-0 right-0 text-center">
              <div className="text-base sm:text-lg font-bold text-heating">{bufferTankTopTemp}°C</div>
            </div>

            {/* Tank label */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Buffer</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Tank</div>
            </div>

            {/* Bottom temp */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <div className="text-base sm:text-lg font-bold text-cooling">{bufferTankBottomTemp}°C</div>
            </div>
          </div>
        </div>

        {/* Pump P2 - Between Buffer Tank and Radiator (on hot pipe) */}
        <div className="absolute right-[30%] sm:right-[32%] top-[22%]">
          <Pump isRunning={isPump2Running} label="P2" />
        </div>

        {/* Radiator / Room */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-24 sm:w-32">
          {/* Radiator */}
          <div className="rounded-lg border-2 border-border bg-gradient-to-b from-heating/10 to-cooling/10 p-2 mb-2">
            <div className="flex gap-0.5 justify-center mb-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 sm:w-2 h-8 sm:h-10 rounded-sm ${isPump2Running ? "bg-gradient-to-b from-heating to-cooling" : "bg-muted"}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] px-0.5">
              <span className="text-heating">{radiatorSupplyTemp}°</span>
              <span className="text-cooling">{radiatorReturnTemp}°</span>
            </div>
          </div>

          {/* Room temperature */}
          <div className="rounded-xl border-2 border-primary bg-card p-2 sm:p-3 text-center shadow-lg">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{roomTemp}°C</div>
            <div className="text-[10px] text-muted-foreground">Room Temp</div>
            <div className="flex items-center justify-center gap-1 mt-1 text-[10px]">
              <span className="text-muted-foreground">Target:</span>
              <span className="text-primary font-semibold">{targetTemp}°C</span>
            </div>
            {roomTemp < targetTemp && (
              <div className="mt-1 text-[9px] text-heating">+{(targetTemp - roomTemp).toFixed(1)}° needed</div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-4 text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-4 h-1 rounded bg-heating" />
            <span className="text-muted-foreground">Hot</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-1 rounded bg-cooling" />
            <span className="text-muted-foreground">Return</span>
          </div>
        </div>
      </div>
    </div>
  );
}
