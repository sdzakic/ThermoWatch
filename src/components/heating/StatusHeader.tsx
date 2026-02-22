import { Wifi, Maximize2, Minimize2 } from "lucide-react";

interface StatusHeaderProps {
  systemName?: string;
  isConnected?: boolean;
  lastUpdate?: string;
}

export function StatusHeader({ 
  systemName = "BioTec-L", 
  isConnected = true,
  lastUpdate = "Just now"
}: StatusHeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 sm:px-6 bg-card/50 backdrop-blur border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-base sm:text-lg font-semibold text-foreground">{systemName}</h1>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
          isConnected ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
        }`}>
          <Wifi className="w-3 h-3" />
          <span>{isConnected ? "Connected" : "Offline"}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground hidden sm:block">Updated: {lastUpdate}</span>
        <button className="p-1.5 rounded hover:bg-secondary transition-colors">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
