import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Edit2, Save, Calendar, User, Building2, DollarSign, AlertCircle, Target } from "lucide-react";
import { toast } from "sonner";

interface LeadData {
  customerName: string;
  company: string;
  source: string;
  budget: string;
  risk: string;
  nextStep: string;
  decisionMaker: string;
  confidence: string;
}

const CRMLead = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    customerName: searchParams.get("customerName") || "",
    company: searchParams.get("company") || "",
    source: searchParams.get("source") || "",
    budget: searchParams.get("budget") || "",
    risk: searchParams.get("risk") || "",
    nextStep: searchParams.get("nextStep") || "",
    decisionMaker: searchParams.get("decisionMaker") || "",
    confidence: searchParams.get("confidence") || "medium",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("线索信息已保存", {
      description: "CRM系统已同步更新",
    });
  };

  const handleComplete = () => {
    toast.success("线索已成功入库", {
      description: "已同步至CRM系统",
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      high: { bg: "bg-success/10", text: "text-success", border: "border-success/20", label: "高" },
      medium: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", label: "中" },
      low: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", label: "低" },
    };
    return variants[confidence as keyof typeof variants] || variants.medium;
  };

  const confidenceStyle = getConfidenceBadge(leadData.confidence);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/smart-inbox")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">CRM 线索详情</h1>
            <p className="text-xs text-muted-foreground">Lead Details</p>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <Check className="h-3 w-3 mr-1" />
            已入库
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* AI Auto-fill Notice */}
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">AI 已自动填写</h3>
              <p className="text-sm text-muted-foreground">
                系统已根据智能收件箱的数据自动填充以下字段，您可以直接保存或编辑调整。
              </p>
            </div>
          </div>
        </Card>

        {/* Lead Information Card */}
        <Card className="p-5 space-y-5">
          {/* Customer Info Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                客户信息
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="gap-2"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    保存
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    编辑
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium text-foreground">
                  客户姓名
                </Label>
                {isEditing ? (
                  <Input
                    id="customerName"
                    value={leadData.customerName}
                    onChange={(e) => setLeadData({ ...leadData, customerName: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/50 text-foreground">
                    {leadData.customerName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  公司名称
                </Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={leadData.company}
                    onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/50 text-foreground">
                    {leadData.company}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Business Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              商机详情
            </h2>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">线索来源</Label>
                {isEditing ? (
                  <Input
                    value={leadData.source}
                    onChange={(e) => setLeadData({ ...leadData, source: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/50 text-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                    {leadData.source}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  预算范围
                </Label>
                {isEditing ? (
                  <Input
                    value={leadData.budget}
                    onChange={(e) => setLeadData({ ...leadData, budget: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/50 text-foreground font-medium">
                    {leadData.budget}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">跟进信心度</Label>
                <Badge variant="outline" className={`${confidenceStyle.bg} ${confidenceStyle.text} ${confidenceStyle.border}`}>
                  {confidenceStyle.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Follow-up Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              跟进计划
            </h2>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">下一步行动</Label>
                {isEditing ? (
                  <Textarea
                    value={leadData.nextStep}
                    onChange={(e) => setLeadData({ ...leadData, nextStep: e.target.value })}
                    rows={2}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/50 text-foreground">
                    {leadData.nextStep}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">决策人信息</Label>
                {isEditing ? (
                  <Input
                    value={leadData.decisionMaker}
                    onChange={(e) => setLeadData({ ...leadData, decisionMaker: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-muted/50 text-foreground">
                    {leadData.decisionMaker}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  风险提示
                </Label>
                {isEditing ? (
                  <Textarea
                    value={leadData.risk}
                    onChange={(e) => setLeadData({ ...leadData, risk: e.target.value })}
                    rows={2}
                  />
                ) : (
                  <div className="px-3 py-2 rounded-md bg-warning/5 border border-warning/20 text-warning">
                    {leadData.risk}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/smart-inbox")}
          >
            返回收件箱
          </Button>
          <Button
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            onClick={isEditing ? handleSave : handleComplete}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                保存更改
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                确认完成
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CRMLead;
