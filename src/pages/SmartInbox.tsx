import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Play, Pause, ChevronRight, Mic, Phone, Users, Bookmark, Edit2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { shippingMockData, InboxItem as MockInboxItem } from "@/data/mockData";

interface Mark {
  id: string;
  time: string;
  content: string;
  marked: boolean;
}

interface AIExtractedData {
  phone?: string;
  email?: string;
  budget?: string;
  nextFollowUp?: string;
  amount?: string;
  probability?: string;
  expectedClose?: string;
  requirements?: string;
  decisionMaker?: string;
  risk?: string;
}

interface InboxItem {
  id: string;
  type: "voice-memo" | "phone-call" | "meeting-record";
  targetType: "lead" | "opportunity";
  audioUrl?: string;
  transcript: string;
  customerName: string;
  company: string;
  confidence: "high" | "medium" | "low";
  status: "pending" | "analyzing" | "approved" | "archived";
  timestamp: string;
  duration?: string;
  marks?: Mark[];
  extractedData?: AIExtractedData;
  hasLocation?: boolean;
  aiSuggestions?: string[];
}

// Transform mock data based on language
const transformMockData = (mockData: MockInboxItem[], lang: "zh" | "en"): InboxItem[] => {
  return mockData.map(item => ({
    id: item.id,
    type: item.type,
    targetType: item.targetType,
    audioUrl: item.audioUrl,
    transcript: item.transcript[lang],
    customerName: item.customerName[lang],
    company: item.company[lang],
    confidence: item.confidence,
    status: item.status,
    timestamp: item.timestamp[lang],
    duration: item.duration,
    marks: item.marks?.map(m => ({
      id: m.id,
      time: m.time,
      content: m.content[lang],
      marked: m.marked,
    })),
    extractedData: item.extractedData ? {
      phone: item.extractedData.phone,
      email: item.extractedData.email,
      budget: item.extractedData.budget,
      nextFollowUp: typeof item.extractedData.nextFollowUp === 'object' ? item.extractedData.nextFollowUp[lang] : item.extractedData.nextFollowUp,
      amount: item.extractedData.amount,
      probability: item.extractedData.probability,
      expectedClose: item.extractedData.expectedClose,
      requirements: typeof item.extractedData.requirements === 'object' ? item.extractedData.requirements[lang] : item.extractedData.requirements,
      decisionMaker: typeof item.extractedData.decisionMaker === 'object' ? item.extractedData.decisionMaker[lang] : item.extractedData.decisionMaker,
      risk: typeof item.extractedData.risk === 'object' ? item.extractedData.risk[lang] : item.extractedData.risk,
    } : undefined,
    hasLocation: item.hasLocation,
    aiSuggestions: item.aiSuggestions?.map(s => s[lang]),
  }));
};

const SmartInbox = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [items, setItems] = useState<InboxItem[]>(() => transformMockData(shippingMockData, language));
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [showVoiceMemo, setShowVoiceMemo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<InboxItem | null>(null);
  const [editingItem, setEditingItem] = useState<InboxItem | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update items when language changes
  useEffect(() => {
    setItems(transformMockData(shippingMockData, language));
  }, [language]);

  const handleApprove = (item: InboxItem) => {
    if (item.targetType === "lead") {
      toast.success(t("inbox.approved"), { description: t("inbox.lead_updated") });
      setTimeout(() => {
        navigate("/my-leads");
      }, 1000);
    } else {
      toast.success(t("inbox.approved"), { description: t("inbox.opp_updated") });
      setTimeout(() => {
        navigate("/my-opportunities");
      }, 1000);
    }
    setItems(items.filter(i => i.id !== item.id));
  };

  const handleReject = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: "archived" as const } : item
    ));
    setTimeout(() => {
      setItems(items.filter(item => item.id !== id));
    }, 300);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const cleanedData: AIExtractedData = {};
    if (editingItem.extractedData?.phone?.trim()) cleanedData.phone = editingItem.extractedData.phone;
    if (editingItem.extractedData?.email?.trim()) cleanedData.email = editingItem.extractedData.email;
    if (editingItem.extractedData?.budget?.trim()) cleanedData.budget = editingItem.extractedData.budget;
    if (editingItem.extractedData?.nextFollowUp?.trim()) cleanedData.nextFollowUp = editingItem.extractedData.nextFollowUp;
    if (editingItem.extractedData?.amount?.trim()) cleanedData.amount = editingItem.extractedData.amount;
    if (editingItem.extractedData?.probability?.trim()) cleanedData.probability = editingItem.extractedData.probability;
    if (editingItem.extractedData?.expectedClose?.trim()) cleanedData.expectedClose = editingItem.extractedData.expectedClose;
    if (editingItem.extractedData?.requirements?.trim()) cleanedData.requirements = editingItem.extractedData.requirements;
    if (editingItem.extractedData?.decisionMaker?.trim()) cleanedData.decisionMaker = editingItem.extractedData.decisionMaker;
    if (editingItem.extractedData?.risk?.trim()) cleanedData.risk = editingItem.extractedData.risk;
    
    const updatedItem = {
      ...editingItem,
      extractedData: cleanedData
    };
    
    setItems(items.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    
    setEditingItem(null);
    handleApprove(updatedItem);
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      high: "bg-success/10 text-success border-success/20",
      medium: "bg-warning/10 text-warning border-warning/20",
      low: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return variants[confidence as keyof typeof variants] || variants.medium;
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t("inbox.status.pending"),
      analyzing: t("inbox.status.analyzing"),
      approved: t("inbox.status.approved"),
      archived: t("inbox.status.archived"),
    };
    return statusMap[status] || status;
  };

  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { label: string; icon: typeof Mic; color: string }> = {
      "voice-memo": { label: t("inbox.type.voice"), icon: Mic, color: "text-primary" },
      "phone-call": { label: t("inbox.type.call"), icon: Phone, color: "text-success" },
      "meeting-record": { label: t("inbox.type.meeting"), icon: Users, color: "text-warning" },
    };
    return typeMap[type] || typeMap["voice-memo"];
  };

  const getConfidenceLabel = (confidence: string) => {
    const labels: Record<string, string> = {
      high: t("inbox.confidence.high"),
      medium: t("inbox.confidence.medium"),
      low: t("inbox.confidence.low"),
    };
    return labels[confidence] || confidence;
  };

  const handleMarkToggle = (itemId: string, markId: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === itemId && item.marks) {
        const updatedItem = {
          ...item,
          marks: item.marks.map(mark =>
            mark.id === markId ? { ...mark, marked: !mark.marked } : mark
          )
        };
        if (selectedTranscript?.id === itemId) {
          setSelectedTranscript(updatedItem);
        }
        return updatedItem;
      }
      return item;
    }));
    toast.success(t("inbox.mark_updated"));
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
      
      toast.success(t("inbox.voice_complete"), { description: t("inbox.generating") });
      
      setTimeout(() => {
        const locationEnabled = localStorage.getItem('locationEnabled');
        const hasLocation = locationEnabled ? JSON.parse(locationEnabled) : false;
        
        const newItem: InboxItem = {
          id: Date.now().toString(),
          type: "voice-memo",
          targetType: "lead",
          audioUrl: "/audio/voice-memo-sample.mp3",
          transcript: language === "zh" 
            ? "刚才和李总监通了电话，他们对我们的整柜海运报价很感兴趣，每月货量大概80-100个柜，主要发往美西港口。需要尽快跟进..."
            : "Just spoke with Director Li, they're interested in our FCL ocean freight quote, about 80-100 containers monthly, mainly to US West Coast ports. Need to follow up soon...",
          customerName: language === "zh" ? "李总监 (物流总监)" : "Director Li (Logistics Director)",
          company: language === "zh" ? "远洋国际贸易有限公司" : "Ocean International Trading Co.",
          confidence: "medium",
          status: "pending",
          timestamp: language === "zh" ? "刚刚" : "Just now",
          duration: formatTime(recordingTime),
          extractedData: {
            budget: "$4,000-4,500/TEU",
            risk: language === "zh" ? "竞争激烈" : "Competitive pressure",
            nextFollowUp: language === "zh" ? "本周内联系沟通" : "Contact within this week",
          },
          aiSuggestions: [
            language === "zh" ? "准备美西航线详细报价，突出我方船期优势" : "Prepare detailed US West Coast route quote, highlight our schedule advantages",
            language === "zh" ? "创建日程：本周内电话跟进李总监决策进度" : "Create schedule: Follow up with Director Li on decision progress this week",
          ],
          hasLocation
        };
        
        setItems([newItem, ...items]);
        toast.success(t("inbox.card_generated"), { description: t("inbox.added_inbox") });
      }, 1500);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      toast.info(t("inbox.recording_start"), { description: t("inbox.recording_stop") });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">{t("inbox.empty")}</p>
            <p className="text-sm text-muted-foreground">{t("inbox.empty_desc")}</p>
          </div>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                item.status === "approved" && "opacity-0 scale-95",
                item.status === "archived" && "opacity-0 scale-95"
              )}
              style={{
                transform: draggedItem === item.id ? `translateX(${dragOffset}px)` : undefined,
              }}
            >
              {/* Swipe Actions Background */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-success flex items-center justify-start px-6">
                  <Check className="h-6 w-6 text-success-foreground" />
                </div>
                <div className="flex-1 bg-destructive flex items-center justify-end px-6">
                  <X className="h-6 w-6 text-destructive-foreground" />
                </div>
              </div>

              {/* Card Content */}
              <div className="relative bg-card p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{item.customerName}</h3>
                      <Badge className={getConfidenceBadge(item.confidence)} variant="outline">
                        {getConfidenceLabel(item.confidence)}
                      </Badge>
                      <MapPin className={cn(
                        "h-4 w-4 transition-colors",
                        item.hasLocation ? "text-primary" : "text-muted-foreground/30"
                      )} />
                    </div>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
                </div>

                {/* Type & Audio */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const typeInfo = getTypeInfo(item.type);
                      const TypeIcon = typeInfo.icon;
                      return (
                        <>
                          <TypeIcon className={cn("h-4 w-4", typeInfo.color)} />
                          <span className="text-sm font-medium text-foreground">{typeInfo.label}</span>
                          {item.duration && (
                            <span className="text-xs text-muted-foreground">· {item.duration}</span>
                          )}
                          {item.type === "meeting-record" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info(
                                  language === "zh" ? "正在生成会议纪要..." : "Generating meeting minutes...",
                                  { description: language === "zh" ? "AI 正在分析会议内容" : "AI is analyzing meeting content" }
                                );
                              }}
                            >
                              {language === "zh" ? "生成会议纪要" : "Generate Minutes"}
                            </Button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Audio Player */}
                  {item.audioUrl && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => setPlayingAudio(playingAudio === item.id ? null : item.id)}
                      >
                        {playingAudio === item.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-primary rounded-full" />
                      </div>
                    </div>
                  )}
                  
                  {/* Transcript */}
                  {item.transcript && (
                    <div 
                      className="p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedTranscript(item)}
                    >
                      <p className="text-xs text-muted-foreground mb-1">{t("inbox.transcript")}</p>
                      <p className="text-sm text-foreground line-clamp-2">{item.transcript}</p>
                    </div>
                  )}
                </div>

                {/* AI Extracted Fields */}
                {item.extractedData && Object.keys(item.extractedData).length > 0 && (
                  <div 
                    className="relative group cursor-pointer p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all"
                    onClick={() => setEditingItem(item)}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-medium text-primary">{t("inbox.ai_extracted")}</p>
                      <span className="text-xs text-muted-foreground">· {t("inbox.click_edit")}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {item.targetType === "lead" && (
                        <>
                          {item.extractedData.phone && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.phone")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.phone}</p>
                            </div>
                          )}
                          {item.extractedData.email && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.email")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.email}</p>
                            </div>
                          )}
                          {item.extractedData.budget && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.budget")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.budget}</p>
                            </div>
                          )}
                          {item.extractedData.nextFollowUp && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.next_followup")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.nextFollowUp}</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {item.targetType === "opportunity" && (
                        <>
                          {item.extractedData.amount && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.amount")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.amount}</p>
                            </div>
                          )}
                          {item.extractedData.probability && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.probability")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.probability}</p>
                            </div>
                          )}
                          {item.extractedData.expectedClose && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">{t("field.expected_close")}</p>
                              <p className="text-sm font-medium text-foreground">{item.extractedData.expectedClose}</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {item.extractedData.decisionMaker && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{t("field.decision_maker")}</p>
                          <p className="text-sm font-medium text-foreground">{item.extractedData.decisionMaker}</p>
                        </div>
                      )}
                      {item.extractedData.risk && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">{t("field.risk")}</p>
                          <p className="text-sm font-medium text-warning">{item.extractedData.risk}</p>
                        </div>
                      )}
                      {item.extractedData.requirements && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground mb-0.5">{t("field.requirements")}</p>
                          <p className="text-sm font-medium text-foreground">{item.extractedData.requirements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                {item.aiSuggestions && item.aiSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{t("inbox.ai_suggestions")}</p>
                    <div className="space-y-2">
                      {item.aiSuggestions.map((suggestion, index) => (
                        <button 
                          key={index}
                          className="w-full flex items-center justify-between p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left"
                        >
                          <span className="text-sm text-foreground">{suggestion}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleReject(item.id)}
                  >
                    <X className="h-4 w-4" />
                    {language === "zh" ? "归档" : "Archive"}
                  </Button>
                  <Button
                    className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                    onClick={() => handleApprove(item)}
                  >
                    <Check className="h-4 w-4" />
                    {language === "zh" ? "更新CRM" : "Update CRM"}
                  </Button>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>

      {/* Floating Voice Button */}
      <button
        onClick={handleToggleRecording}
        className={cn(
          "fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-lg z-20 transition-all duration-300 flex flex-col items-center justify-center",
          isRecording
            ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/50 shadow-xl"
            : "bg-gradient-to-br from-primary to-primary-glow hover:scale-105 active:scale-95"
        )}
      >
        <Mic className="h-7 w-7 text-white" />
        {isRecording && (
          <span className="text-[10px] text-white font-mono mt-0.5 font-semibold">
            {formatTime(recordingTime)}
          </span>
        )}
      </button>

      {/* Voice Memo Modal */}
      {showVoiceMemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("toolkit.voice_memo")}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowVoiceMemo(false);
                    setIsRecording(false);
                    if (recordingTimerRef.current) {
                      clearInterval(recordingTimerRef.current);
                    }
                    setRecordingTime(0);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleToggleRecording}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                    isRecording
                      ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/50 shadow-xl"
                      : "bg-gradient-to-br from-primary to-primary-glow hover:scale-105 active:scale-95"
                  )}
                >
                  <Mic className="h-12 w-12 text-white" />
                </button>

                {isRecording ? (
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-mono font-bold">{formatTime(recordingTime)}</p>
                    <p className="text-sm text-muted-foreground">{t("toolkit.recording")}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{language === "zh" ? "点击开始录音" : "Click to start recording"}</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Transcript Dialog */}
      <Dialog open={!!selectedTranscript} onOpenChange={() => setSelectedTranscript(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === "zh" ? "完整转录文本" : "Full Transcript"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTranscript?.marks && selectedTranscript.marks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{language === "zh" ? "重点标记" : "Key Marks"}</h4>
                <div className="space-y-2">
                  {selectedTranscript.marks.map((mark) => (
                    <div
                      key={mark.id}
                      className="flex items-start gap-2 p-2 rounded-lg border bg-card"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 relative"
                        onClick={() => handleMarkToggle(selectedTranscript.id, mark.id)}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            mark.marked ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                        {mark.marked && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">{mark.time}</div>
                        <div className="text-sm">{mark.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-medium text-sm mb-2">{language === "zh" ? "转录内容" : "Transcript Content"}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedTranscript?.transcript}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === "zh" ? "编辑 AI 提取信息" : "Edit AI Extracted Info"}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 mb-4">
                <p className="text-sm text-muted-foreground">
                  {language === "zh" 
                    ? "以下信息由 AI 从转录文本中自动提取，您可以修改或补充。如果某项信息不相关，可以留空。"
                    : "The following information was automatically extracted by AI. You can modify or supplement it. Leave empty if not relevant."}
                </p>
              </div>

              {editingItem.targetType === "lead" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.phone")}</label>
                    <Input
                      value={editingItem.extractedData?.phone || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, phone: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.email")}</label>
                    <Input
                      value={editingItem.extractedData?.email || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, email: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.budget")}</label>
                    <Input
                      value={editingItem.extractedData?.budget || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, budget: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.next_followup")}</label>
                    <Input
                      value={editingItem.extractedData?.nextFollowUp || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, nextFollowUp: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>
                </>
              )}

              {editingItem.targetType === "opportunity" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.amount")}</label>
                    <Input
                      value={editingItem.extractedData?.amount || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, amount: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.probability")}</label>
                    <Input
                      value={editingItem.extractedData?.probability || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, probability: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("field.expected_close")}</label>
                    <Input
                      value={editingItem.extractedData?.expectedClose || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        extractedData: { ...editingItem.extractedData, expectedClose: e.target.value }
                      })}
                      placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("field.decision_maker")}</label>
                <Input
                  value={editingItem.extractedData?.decisionMaker || ""}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    extractedData: { ...editingItem.extractedData, decisionMaker: e.target.value }
                  })}
                  placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("field.risk")}</label>
                <Input
                  value={editingItem.extractedData?.risk || ""}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    extractedData: { ...editingItem.extractedData, risk: e.target.value }
                  })}
                  placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("field.requirements")}</label>
                <Textarea
                  value={editingItem.extractedData?.requirements || ""}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    extractedData: { ...editingItem.extractedData, requirements: e.target.value }
                  })}
                  placeholder={language === "zh" ? "如无相关数据可留空" : "Leave empty if not relevant"}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingItem(null)}
                >
                  {t("toolkit.cancel")}
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                  onClick={handleSaveEdit}
                >
                  {t("inbox.edit_approve")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartInbox;
