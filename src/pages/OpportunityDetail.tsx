import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, FileText, Calendar, DollarSign, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpportunityActivity {
  id: string;
  date: string;
  type: "call" | "meeting" | "email" | "demo" | "proposal";
  title: string;
  description: string;
}

interface QuoteItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

interface Quote {
  id: string;
  name: string;
  amount: string;
  validUntil: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  items: QuoteItem[];
  notes?: string;
  terms?: string;
}

interface Opportunity {
  id: string;
  name: string;
  company: string;
  amount: string;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closing";
  probability: number;
  expectedClose: string;
  owner: string;
  activities: OpportunityActivity[];
  quotes: Quote[];
}

// Mock data
const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    name: "星河科技私有化部署项目",
    company: "星河科技集团",
    amount: "80 万",
    stage: "negotiation",
    probability: 75,
    expectedClose: "2024-12-15",
    owner: "张三",
    activities: [
      {
        id: "a1",
        date: "2024-11-18",
        type: "meeting",
        title: "方案演示会议",
        description: "向客户演示私有化部署方案，客户对技术架构表示认可",
      },
      {
        id: "a2",
        date: "2024-11-15",
        type: "proposal",
        title: "提交技术方案",
        description: "提交详细的技术方案和实施计划",
      },
      {
        id: "a3",
        date: "2024-11-10",
        type: "demo",
        title: "产品演示",
        description: "进行产品功能演示，重点展示安全性和扩展性",
      },
    ],
    quotes: [
      {
        id: "q1",
        name: "私有化部署标准版",
        amount: "80 万",
        validUntil: "2024-12-01",
        status: "sent",
        items: [
          {
            name: "私有化部署服务",
            description: "包含系统部署、环境配置、数据迁移",
            quantity: 1,
            unitPrice: "30 万",
            total: "30 万",
          },
          {
            name: "标准版授权（100用户）",
            description: "永久授权，包含核心功能模块",
            quantity: 1,
            unitPrice: "35 万",
            total: "35 万",
          },
          {
            name: "首年技术支持服务",
            description: "7x24小时技术支持，包含系统维护和升级",
            quantity: 1,
            unitPrice: "15 万",
            total: "15 万",
          },
        ],
        notes: "本报价有效期至2024年12月1日，超过有效期需重新评估价格。",
        terms: "付款方式：签约后支付50%，系统上线后支付30%，验收合格后支付20%。",
      },
      {
        id: "q2",
        name: "私有化部署企业版",
        amount: "120 万",
        validUntil: "2024-12-01",
        status: "draft",
        items: [
          {
            name: "私有化部署服务（高可用）",
            description: "包含集群部署、负载均衡、灾备配置",
            quantity: 1,
            unitPrice: "45 万",
            total: "45 万",
          },
          {
            name: "企业版授权（500用户）",
            description: "永久授权，包含全功能模块及定制开发",
            quantity: 1,
            unitPrice: "55 万",
            total: "55 万",
          },
          {
            name: "三年技术支持服务",
            description: "7x24小时专属技术支持，优先响应",
            quantity: 1,
            unitPrice: "20 万",
            total: "20 万",
          },
        ],
        notes: "企业版包含更多高级功能和更大并发支持。",
        terms: "付款方式：签约后支付40%，系统上线后支付40%，验收合格后支付20%。",
      },
    ],
  },
  {
    id: "2",
    name: "创新科技SaaS订阅",
    company: "创新科技有限公司",
    amount: "45 万/年",
    stage: "proposal",
    probability: 60,
    expectedClose: "2024-12-01",
    owner: "李四",
    activities: [
      {
        id: "a4",
        date: "2024-11-17",
        type: "email",
        title: "发送产品资料",
        description: "发送详细的产品功能说明和价格方案",
      },
      {
        id: "a5",
        date: "2024-11-12",
        type: "call",
        title: "需求确认电话",
        description: "确认客户的具体需求和预算范围",
      },
    ],
    quotes: [
      {
        id: "q3",
        name: "SaaS标准版年度订阅",
        amount: "45 万/年",
        validUntil: "2024-11-30",
        status: "sent",
        items: [
          {
            name: "SaaS平台年度订阅费",
            description: "支持200用户并发，包含核心业务功能",
            quantity: 1,
            unitPrice: "30 万/年",
            total: "30 万/年",
          },
          {
            name: "数据存储服务（1TB）",
            description: "云端数据存储及备份服务",
            quantity: 1,
            unitPrice: "8 万/年",
            total: "8 万/年",
          },
          {
            name: "标准技术支持",
            description: "工作日8小时技术支持服务",
            quantity: 1,
            unitPrice: "7 万/年",
            total: "7 万/年",
          },
        ],
        notes: "订阅期内享受所有功能更新和安全补丁。",
        terms: "年度订阅，一次性付清或按季度分期支付。",
      },
    ],
  },
];

const OpportunityDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oppId = searchParams.get("id");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  const opportunity = mockOpportunities.find(o => o.id === oppId);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-foreground mb-4">商机不存在</p>
          <Button onClick={() => navigate("/my-opportunities")}>返回列表</Button>
        </div>
      </div>
    );
  }

  const getStageBadge = (stage: string) => {
    const variants = {
      prospecting: { bg: "bg-muted", text: "text-muted-foreground", label: "初期接触" },
      qualification: { bg: "bg-info/10", text: "text-info", label: "需求确认" },
      proposal: { bg: "bg-primary/10", text: "text-primary", label: "方案提交" },
      negotiation: { bg: "bg-warning/10", text: "text-warning", label: "商务谈判" },
      closing: { bg: "bg-success/10", text: "text-success", label: "即将成交" },
    };
    return variants[stage as keyof typeof variants] || variants.prospecting;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      call: "📞",
      meeting: "🤝",
      email: "📧",
      demo: "🖥️",
      proposal: "📄",
    };
    return icons[type as keyof typeof icons] || "📌";
  };

  const getQuoteStatusBadge = (status: string) => {
    const variants = {
      draft: { bg: "bg-muted", text: "text-muted-foreground", label: "草稿" },
      sent: { bg: "bg-primary/10", text: "text-primary", label: "已发送" },
      accepted: { bg: "bg-success/10", text: "text-success", label: "已接受" },
      rejected: { bg: "bg-destructive/10", text: "text-destructive", label: "已拒绝" },
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const stageStyle = getStageBadge(opportunity.stage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-opportunities")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">商机详情</h1>
            <p className="text-xs text-muted-foreground">Opportunity Details</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Overview Card */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              商机概览
            </h2>
            <Badge className={cn(stageStyle.bg, stageStyle.text)} variant="outline">
              {stageStyle.label}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">商机名称</p>
              <p className="text-base font-medium text-foreground">{opportunity.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">客户公司</p>
              <p className="text-base font-medium text-foreground">{opportunity.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
            <div className="p-3 rounded-lg bg-primary/5 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">金额</p>
              <p className="text-sm font-bold text-primary">{opportunity.amount}</p>
            </div>
            <div className="p-3 rounded-lg bg-success/5 text-center">
              <Activity className="h-5 w-5 mx-auto mb-1 text-success" />
              <p className="text-xs text-muted-foreground mb-1">概率</p>
              <p className="text-sm font-bold text-success">{opportunity.probability}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-1">预计成交</p>
              <p className="text-xs font-medium text-foreground">{opportunity.expectedClose}</p>
            </div>
          </div>
        </Card>

        {/* Activities */}
        <Card className="p-5 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            活动记录
          </h2>

          <div className="space-y-3">
            {opportunity.activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-2xl flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{activity.title}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quotes */}
        <Card className="p-5 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            报价单
          </h2>

          <div className="space-y-3">
            {opportunity.quotes.map((quote) => {
              const statusStyle = getQuoteStatusBadge(quote.status);
              return (
                <div 
                  key={quote.id} 
                  className="p-4 rounded-lg border border-border hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                  onClick={() => setSelectedQuote(quote)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{quote.name}</h3>
                      <p className="text-lg font-bold text-primary">{quote.amount}</p>
                    </div>
                    <Badge className={cn(statusStyle.bg, statusStyle.text)} variant="outline">
                      {statusStyle.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>有效期至: {quote.validUntil}</span>
                    </div>
                    <span className="text-xs text-primary">点击查看详情 →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quote Detail Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {selectedQuote?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6">
              {/* Quote Header Info */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">总金额</p>
                  <p className="text-2xl font-bold text-primary">{selectedQuote.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">有效期</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">{selectedQuote.validUntil}</p>
                  </div>
                </div>
              </div>

              {/* Quote Items */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">报价明细</h3>
                <div className="space-y-3">
                  {selectedQuote.items.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">数量</p>
                          <p className="text-sm font-medium text-foreground">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">单价</p>
                          <p className="text-sm font-medium text-foreground">{item.unitPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">小计</p>
                          <p className="text-sm font-bold text-primary">{item.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedQuote.notes && (
                <div className="p-4 rounded-lg bg-info/5 border border-info/20">
                  <p className="text-xs font-medium text-info mb-2">备注说明</p>
                  <p className="text-sm text-foreground">{selectedQuote.notes}</p>
                </div>
              )}

              {/* Terms */}
              {selectedQuote.terms && (
                <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-xs font-medium text-warning mb-2">付款条款</p>
                  <p className="text-sm text-foreground">{selectedQuote.terms}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedQuote(null)}>
                  关闭
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-primary to-primary-glow">
                  导出PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpportunityDetail;
