import { Settings, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  roomName?: string;
}

export function Header({ roomName }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between p-4 sm:px-6">
      <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      <div className="text-center">
        <h1 className="text-lg font-semibold text-foreground">{roomName || t("header.livingRoom")}</h1>
        <p className="text-xs text-muted-foreground">{t("header.smartHeatingControl")}</p>
      </div>

      <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
        <Settings className="w-6 h-6 text-foreground" />
      </button>
    </header>
  );
}
