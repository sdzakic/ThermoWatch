import { Home, Moon, Briefcase, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Preset {
  id: string;
  labelKey: string;
  temp: number;
  icon: typeof Home;
}

interface QuickPresetsProps {
  activePreset?: string;
  onPresetSelect: (presetId: string, temp: number) => void;
}

const presets: Preset[] = [
  { id: "home", labelKey: "presets.home", temp: 21, icon: Home },
  { id: "away", labelKey: "presets.away", temp: 16, icon: Briefcase },
  { id: "sleep", labelKey: "presets.sleep", temp: 18, icon: Moon },
  { id: "eco", labelKey: "presets.eco", temp: 19, icon: Leaf },
];

export function QuickPresets({ activePreset, onPresetSelect }: QuickPresetsProps) {
  const { t } = useTranslation();

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("presets.quickPresets")}</h3>
      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset.id, preset.temp)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{t(preset.labelKey)}</span>
              <span className={`text-sm font-semibold ${isActive ? "" : "text-foreground"}`}>
                {preset.temp}°
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
