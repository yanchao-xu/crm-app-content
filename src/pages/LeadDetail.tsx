import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Building2, Phone, Mail, Calendar, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowUp {
  id: string;
  date: string;
  type: "call" | "meeting" | "email";
  content: string;
  result: string;
}

interface Lead {
  id: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  budget: string;
  status: "new" | "contacted" | "qualified" | "negotiating";
  confidence: "high" | "medium" | "low";
  lastContact: string;
  nextFollowUp: string;
  followUps: FollowUp[];
}

// Mock data - in production this would come from API
const mockLeads: Lead[] = [
  {
    id: "1",
    customerName: "王总 (采购总监)",
    company: "星河科技集团",
    phone: "138-0000-1234",
    email: "wang@xinghe.com",
    budget: "50-80 万(RMB)",
    status: "negotiating",
    confidence: "high",
    lastContact: "2024-11-18",
    nextFollowUp: "2024-11-27",
    followUps: [
      {
        id: "f1",
        date: "2024-11-18",
        type: "meeting",
        content: "讨论技术方案细节",
        result: "客户对方案表示认可，需要进一步确认预算",
      },
      {
        id: "f2",
        date: "2024-11-15",
        type: "call",
        content: "初步沟通需求",
        result: "了解到客户有明确采购计划",
      },
    ],
  },
  {
    id: "2",
    customerName: "张经理",
    company: "创新科技有限公司",
    phone: "139-0000-5678",
    email: "zhang@chuangxin.com",
    budget: "30-50 万(RMB)",
    status: "contacted",
    confidence: "medium",
    lastContact: "2024-11-17",
    nextFollowUp: "2024-11-22",
    followUps: [
      {
        id: "f3",
        date: "2024-11-17",
        type: "email",
        content: "发送产品资料",
        result: "客户已阅读，等待反馈",
      },
    ],
  },
  {
    id: "3",
    customerName: "李总监",
    company: "未来科技有限公司",
    phone: "137-0000-9012",
    email: "li@weilai.com",
    budget: "60-100 万(RMB)",
    status: "qualified",
    confidence: "medium",
    lastContact: "2024-11-19",
    nextFollowUp: "2024-11-25",
    followUps: [
      {
        id: "f4",
        date: "2024-11-19",
        type: "call",
        content: "确认技术需求",
        result: "需求明确，等待内部审批",
      },
    ],
  },
];

const LeadDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("id");
  
  const lead = mockLeads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground mb-4">线索不存在</p>
          <Button onClick={() => navigate("/my-leads")}>返回列表</Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { bg: "bg-primary/10", text: "text-primary", label: "新线索" },
      contacted: { bg: "bg-info/10", text: "text-info", label: "已联系" },
      qualified: { bg: "bg-success/10", text: "text-success", label: "已确认" },
      negotiating: { bg: "bg-warning/10", text: "text-warning", label: "谈判中" },
    };
    return variants[status as keyof typeof variants] || variants.new;
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      high: { bg: "bg-success/10", text: "text-success", label: "高" },
      medium: { bg: "bg-warning/10", text: "text-warning", label: "中" },
      low: { bg: "bg-destructive/10", text: "text-destructive", label: "低" },
    };
    return variants[confidence as keyof typeof variants] || variants.medium;
  };

  const getFollowUpIcon = (type: string) => {
    const icons = {
      call: Phone,
      meeting: MessageSquare,
      email: Mail,
    };
    return icons[type as keyof typeof icons] || MessageSquare;
  };

  const statusStyle = getStatusBadge(lead.status);
  const confidenceStyle = getConfidenceBadge(lead.confidence);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-leads")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">线索详情</h1>
            <p className="text-xs text-muted-foreground">Lead Details</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Basic Info */}
        <Card className="p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                基本信息
              </h2>
              <Badge className={cn(statusStyle.bg, statusStyle.text)} variant="outline">
                {statusStyle.label}
              </Badge>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">客户姓名</p>
                  <p className="text-sm font-medium text-foreground">{lead.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">公司名称</p>
                  <p className="text-sm font-medium text-foreground">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">联系电话</p>
                  <p className="text-sm font-medium text-foreground">{lead.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">电子邮箱</p>
                  <p className="text-sm font-medium text-foreground">{lead.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Schedule */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="p-3 rounded-lg bg-primary/5">
              <p className="text-xs text-muted-foreground mb-1">预算范围</p>
              <p className="text-sm font-semibold text-primary">{lead.budget}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">跟进信心</p>
              <Badge className={cn(confidenceStyle.bg, confidenceStyle.text)} variant="outline">
                {confidenceStyle.label}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Follow-up History */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              跟进记录
            </h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              添加跟进
            </Button>
          </div>

          <div className="space-y-3">
            {lead.followUps.map((followUp) => {
              const FollowUpIcon = getFollowUpIcon(followUp.type);
              return (
                <div key={followUp.id} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FollowUpIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{followUp.content}</span>
                      <span className="text-xs text-muted-foreground">{followUp.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{followUp.result}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Next Follow-up */}
        <Card className="p-5 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">下次跟进计划</h3>
              <p className="text-sm text-muted-foreground">计划时间: {lead.nextFollowUp}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeadDetail;
