interface PumpStatusProps {
  pumps: {
    id: string;
    name: string;
    timeline: { status: "on" | "off" | "standby"; duration: number }[];
  }[];
  dateRange: string;
}

export function PumpStatus({ pumps, dateRange }: PumpStatusProps) {
  const getStatusColor = (status: "on" | "off" | "standby") => {
    switch (status) {
      case "on":
        return "bg-success";
      case "off":
        return "bg-destructive";
      case "standby":
        return "bg-muted";
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Pump Activity</h3>
        <span className="text-xs text-muted-foreground">{dateRange}</span>
      </div>

      <div className="space-y-4">
        {pumps.map((pump) => (
          <div key={pump.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">{pump.name}</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  ON
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  OFF
                </span>
              </div>
            </div>
            
            {/* Timeline bar */}
            <div className="flex h-6 rounded-md overflow-hidden border border-border">
              {pump.timeline.map((segment, i) => (
                <div
                  key={i}
                  className={`${getStatusColor(segment.status)} transition-all`}
                  style={{ flex: segment.duration }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Time axis */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>28.01</span>
        <span>29.01</span>
        <span>30.01</span>
        <span>31.01</span>
        <span>01.02</span>
        <span>02.02</span>
      </div>
    </div>
  );
}
