import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Calendar, DollarSign, Activity, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Opportunity {
  id: string;
  name: string;
  company: string;
  amount: string;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closing";
  probability: number;
  expectedClose: string;
  owner: string;
}

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
  },
];

const MyOpportunities = () => {
  const navigate = useNavigate();
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-xl font-bold text-foreground">我的商机</h1>
            <p className="text-xs text-muted-foreground">My Opportunities</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {opportunities.length} 个商机
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索商机名称或公司..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Opportunities List */}
        <div className="space-y-3">
          {filteredOpportunities.map((opp) => {
            const stageStyle = getStageBadge(opp.stage);

            return (
              <Card
                key={opp.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/opportunity-detail?id=${opp.id}`)}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{opp.name}</h3>
                      <p className="text-sm text-muted-foreground">{opp.company}</p>
                    </div>
                    <Badge className={cn(stageStyle.bg, stageStyle.text)} variant="outline">
                      {stageStyle.label}
                    </Badge>
                  </div>

                  {/* Amount & Probability */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">金额</p>
                      <p className="text-lg font-bold text-primary">{opp.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">成功概率</p>
                      <p className="text-lg font-bold text-success">{opp.probability}%</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>预计成交: {opp.expectedClose}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{opp.owner}</span>
                    </div>
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

export default MyOpportunities;
