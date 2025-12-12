import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Building2, Phone, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
}

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
  },
];

const MyLeads = () => {
  const navigate = useNavigate();
  const [leads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredLeads = leads.filter(
    (lead) =>
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-xl font-bold text-foreground">我的线索</h1>
            <p className="text-xs text-muted-foreground">My Leads</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {leads.length} 个线索
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索客户或公司..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Leads List */}
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const statusStyle = getStatusBadge(lead.status);
            const confidenceStyle = getConfidenceBadge(lead.confidence);

            return (
              <Card
                key={lead.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/lead-detail?id=${lead.id}`)}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{lead.customerName}</h3>
                        <Badge className={cn(statusStyle.bg, statusStyle.text)} variant="outline">
                          {statusStyle.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {lead.company}
                      </p>
                    </div>
                    <Badge className={cn(confidenceStyle.bg, confidenceStyle.text)} variant="outline">
                      {confidenceStyle.label}
                    </Badge>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>下次跟进: {lead.nextFollowUp}</span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5">
                    <span className="text-xs text-muted-foreground">预算</span>
                    <span className="text-sm font-medium text-primary">{lead.budget}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyLeads;
