import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bluetooth, Wifi, Battery, Download, RefreshCw, CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DeviceStatus {
  connected: boolean;
  battery: number;
  firmware: string;
  lastSync: string;
  storage: {
    used: number;
    total: number;
  };
  recording: boolean;
}

const HardwareCompanion = () => {
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceStatus>({
    connected: true,
    battery: 78,
    firmware: "v2.1.5",
    lastSync: "2分钟前",
    storage: {
      used: 2.4,
      total: 8,
    },
    recording: false,
  });

  const [syncing, setSyncing] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(true);
  
  // 防丢模式状态
  const [antiLossEnabled, setAntiLossEnabled] = useState(() => {
    const saved = localStorage.getItem('antiLossEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  const handleAntiLossToggle = (enabled: boolean) => {
    setAntiLossEnabled(enabled);
    localStorage.setItem('antiLossEnabled', JSON.stringify(enabled));
    toast.success(enabled ? "防丢模式已开启" : "防丢模式已关闭", {
      description: enabled ? "设备离开一定范围后将发出提醒" : "防丢提醒已关闭"
    });
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setDevice({ ...device, lastSync: "刚刚" });
    }, 2000);
  };

  const storagePercent = (device.storage.used / device.storage.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">硬件伴侣</h1>
            <p className="text-xs text-muted-foreground">Hardware Companion</p>
          </div>
          <Badge 
            variant={device.connected ? "default" : "secondary"}
            className={cn(
              "text-xs",
              device.connected && "bg-success text-success-foreground"
            )}
          >
            {device.connected ? "已连接" : "未连接"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Device Status Card */}
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-primary to-primary-glow p-6 flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bluetooth className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-medium text-white">SalesCore Device</p>
              <p className="text-xs text-white/80">序列号: SC-2024-A1B2C3</p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Battery */}
            <div className="flex items-center gap-3">
              <Battery className={cn(
                "h-5 w-5",
                device.battery > 50 ? "text-success" : device.battery > 20 ? "text-warning" : "text-destructive"
              )} />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">电池电量</span>
                  <span className="text-sm text-muted-foreground">{device.battery}%</span>
                </div>
                <Progress value={device.battery} className="h-2" />
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-info" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">存储空间</span>
                  <span className="text-sm text-muted-foreground">{device.storage.used}GB / {device.storage.total}GB</span>
                </div>
                <Progress value={storagePercent} className="h-2" />
              </div>
            </div>

            {/* Firmware */}
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">固件版本</p>
                  <p className="text-xs text-muted-foreground">{device.firmware}</p>
                </div>
              </div>
              {updateAvailable && (
                <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                  有更新
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Connection Status */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">连接状态</h3>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                device.connected ? "bg-success/10" : "bg-muted"
              )}>
                <Bluetooth className={cn(
                  "h-5 w-5",
                  device.connected ? "text-success" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">蓝牙连接</p>
                <p className="text-xs text-muted-foreground">BLE 5.3 低功耗模式</p>
              </div>
            </div>
            {device.connected && <CheckCircle2 className="h-5 w-5 text-success" />}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                device.connected ? "bg-success/10" : "bg-muted"
              )}>
                <Wifi className={cn(
                  "h-5 w-5",
                  device.connected ? "text-success" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Wi-Fi 同步</p>
                <p className="text-xs text-muted-foreground">极速传输音频文件</p>
              </div>
            </div>
            {device.connected && <CheckCircle2 className="h-5 w-5 text-success" />}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                antiLossEnabled ? "bg-primary/10" : "bg-muted"
              )}>
                <MapPin className={cn(
                  "h-5 w-5",
                  antiLossEnabled ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">防丢模式</p>
                <p className="text-xs text-muted-foreground">
                  {antiLossEnabled ? "设备离开后将提醒" : "防丢提醒已关闭"}
                </p>
              </div>
            </div>
            <Switch 
              checked={antiLossEnabled} 
              onCheckedChange={handleAntiLossToggle}
            />
          </div>
        </Card>

        {/* Sync Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">数据同步</h3>
            <span className="text-xs text-muted-foreground">最后同步: {device.lastSync}</span>
          </div>

          <Button 
            className="w-full gap-2"
            onClick={handleSync}
            disabled={syncing || !device.connected}
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            {syncing ? "同步中..." : "立即同步"}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            后台保活，静默同步。手机锁屏状态下依然能接收大文件。
          </p>
        </Card>

        {/* Firmware Update */}
        {updateAvailable && (
          <Card className="p-4 border-warning/50 bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">固件更新可用</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  v2.2.0 版本现已推出，包含性能优化和新功能支持。
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  下载并安装更新
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">24</p>
            <p className="text-xs text-muted-foreground">今日录音</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-success mb-1">156</p>
            <p className="text-xs text-muted-foreground">本周录音</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-info mb-1">2.4</p>
            <p className="text-xs text-muted-foreground">GB 已用</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HardwareCompanion;
