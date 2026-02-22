import { Flame, Snowflake, RefreshCw, Power } from "lucide-react";

export type HeatingMode = "heat" | "cool" | "auto" | "off";

interface ModeSelectorProps {
  currentMode: HeatingMode;
  onModeChange: (mode: HeatingMode) => void;
}

const modes: { id: HeatingMode; label: string; icon: typeof Flame }[] = [
  { id: "heat", label: "Heat", icon: Flame },
  { id: "cool", label: "Cool", icon: Snowflake },
  { id: "auto", label: "Auto", icon: RefreshCw },
  { id: "off", label: "Off", icon: Power },
];

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Mode</h3>
      <div className="grid grid-cols-4 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={isActive ? "mode-btn-active" : "mode-btn"}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
