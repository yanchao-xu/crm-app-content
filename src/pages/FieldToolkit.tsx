import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Camera, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { toolkitMockData, ToolkitNote } from "@/data/mockData";

interface LocalNote {
  id: string;
  type: "voice" | "card";
  content: string;
  timestamp: string;
  status: "processing" | "completed";
}

const FieldToolkit = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Initialize notes with localized mock data
  const [notes, setNotes] = useState<LocalNote[]>(() => 
    toolkitMockData.map(note => ({
      id: note.id,
      type: note.type,
      content: note.content[language],
      timestamp: note.timestamp[language],
      status: note.status,
    }))
  );

  // Update notes when language changes
  useEffect(() => {
    setNotes(toolkitMockData.map(note => ({
      id: note.id,
      type: note.type,
      content: note.content[language],
      timestamp: note.timestamp[language],
      status: note.status,
    })));
  }, [language]);

  const [showCardScanner, setShowCardScanner] = useState(false);
  const [showVoiceMemo, setShowVoiceMemo] = useState(false);

  const handleStartRecording = () => {
    setRecording(true);
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    
    setTimeout(() => {
      setRecording(false);
      clearInterval(interval);
      setRecordingTime(0);
      setShowVoiceMemo(false);
      setNotes([
        {
          id: Date.now().toString(),
          type: "voice",
          content: t("toolkit.voice_saved"),
          timestamp: language === "zh" ? "刚刚" : "Just now",
          status: "processing",
        },
        ...notes,
      ]);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 active:scale-100"
            onClick={() => setShowVoiceMemo(true)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t("toolkit.voice_memo")}</h3>
                <p className="text-xs text-muted-foreground">{t("toolkit.voice_memo_desc")}</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 active:scale-100"
            onClick={() => setShowCardScanner(true)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t("toolkit.card_scan")}</h3>
                <p className="text-xs text-muted-foreground">{t("toolkit.card_scan_desc")}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Notes */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">{t("toolkit.recent")}</h3>
            <Badge variant="secondary" className="text-xs">{notes.length}</Badge>
          </div>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("toolkit.no_records")}</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    note.type === "voice" ? "bg-primary/10" : "bg-success/10"
                  )}>
                    {note.type === "voice" ? (
                      <Mic className={cn("h-5 w-5", note.status === "processing" ? "text-warning" : "text-primary")} />
                    ) : (
                      <Camera className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {note.type === "voice" ? t("toolkit.voice") : t("toolkit.card")}
                      </Badge>
                      {note.status === "processing" && (
                        <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                          {t("toolkit.processing")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{note.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{t("toolkit.tip_voice")}</h4>
                <p className="text-xs text-muted-foreground">
                  {t("toolkit.tip_voice_desc")}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-success/5 to-transparent border-l-4 border-success">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{t("toolkit.tip_card")}</h4>
                <p className="text-xs text-muted-foreground">
                  {t("toolkit.tip_card_desc")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Voice Memo Modal */}
      {showVoiceMemo && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("toolkit.voice_memo")}</h3>
              <p className="text-sm text-muted-foreground">{t("toolkit.quick_record")}</p>
            </div>

            {!recording ? (
              <>
                <Textarea
                  placeholder={t("toolkit.text_note")}
                  className="min-h-[120px] resize-none"
                />
                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2 h-16 text-lg bg-gradient-to-r from-primary to-primary-glow"
                    onClick={handleStartRecording}
                  >
                    <Mic className="h-6 w-6" />
                    {t("toolkit.hold_record")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowVoiceMemo(false)}
                  >
                    {t("toolkit.cancel")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                    <Mic className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-2">{formatTime(recordingTime)}</p>
                  <p className="text-sm text-muted-foreground">{t("toolkit.recording")}</p>
                </div>
                <Button 
                  className="w-full h-12"
                  variant="destructive"
                  onClick={() => {
                    setRecording(false);
                    setRecordingTime(0);
                  }}
                >
                  {t("toolkit.stop_record")}
                </Button>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Card Scanner Modal */}
      {showCardScanner && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("toolkit.card_scan")}</h3>
              <p className="text-sm text-muted-foreground">{t("toolkit.photo_upload")}</p>
            </div>

            <div className="aspect-[1.6/1] rounded-lg bg-muted/50 flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("toolkit.photo_upload")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Input placeholder={t("toolkit.name")} />
              <Input placeholder={t("toolkit.company")} />
              <Input placeholder={t("toolkit.phone")} />
              <Input placeholder={t("toolkit.email")} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCardScanner(false)}
              >
                {t("toolkit.cancel")}
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-success to-success/80"
                onClick={() => {
                  setShowCardScanner(false);
                  setNotes([
                    {
                      id: Date.now().toString(),
                      type: "card",
                      content: t("toolkit.card_saved"),
                      timestamp: language === "zh" ? "刚刚" : "Just now",
                      status: "completed",
                    },
                    ...notes,
                  ]);
                }}
              >
                {t("toolkit.save_crm")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FieldToolkit;
