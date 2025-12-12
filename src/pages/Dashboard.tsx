import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, TrendingUp, Users, AlertCircle, Trophy, Award, Target, TrendingDown, Calendar, Phone, Mail, Building2, CheckCircle2, Clock, Mic, UserPlus, Briefcase, FileText, BarChart3 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Funnel, FunnelChart, Cell, Tooltip, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Localized data
  const salesCompetencyData = useMemo(() => [
    { subject: t('competency.speech_compliance'), value: 85, fullMark: 100 },
    { subject: t('competency.objection_handling'), value: 72, fullMark: 100 },
    { subject: t('competency.needs_discovery'), value: 90, fullMark: 100 },
    { subject: t('competency.product_intro'), value: 78, fullMark: 100 },
    { subject: t('competency.closing_skills'), value: 68, fullMark: 100 },
    { subject: t('competency.relationship'), value: 88, fullMark: 100 },
  ], [language, t]);

  const teamMembersData = useMemo(() => [
    { 
      name: language === 'zh' ? "张三" : "John", 
      data: [
        { subject: t('competency.speech_compliance'), value: 85 },
        { subject: t('competency.objection_handling'), value: 72 },
        { subject: t('competency.needs_discovery'), value: 90 },
        { subject: t('competency.product_intro'), value: 78 },
        { subject: t('competency.closing_skills'), value: 68 },
        { subject: t('competency.relationship'), value: 88 },
      ],
      score: 80
    },
    { 
      name: language === 'zh' ? "李四" : "Mike", 
      data: [
        { subject: t('competency.speech_compliance'), value: 92 },
        { subject: t('competency.objection_handling'), value: 85 },
        { subject: t('competency.needs_discovery'), value: 78 },
        { subject: t('competency.product_intro'), value: 88 },
        { subject: t('competency.closing_skills'), value: 82 },
        { subject: t('competency.relationship'), value: 90 },
      ],
      score: 86
    },
    { 
      name: language === 'zh' ? "王五" : "David", 
      data: [
        { subject: t('competency.speech_compliance'), value: 70 },
        { subject: t('competency.objection_handling'), value: 65 },
        { subject: t('competency.needs_discovery'), value: 72 },
        { subject: t('competency.product_intro'), value: 68 },
        { subject: t('competency.closing_skills'), value: 60 },
        { subject: t('competency.relationship'), value: 75 },
      ],
      score: 68
    },
  ], [language, t]);

  const funnelData = useMemo(() => [
    { name: t('funnel.total_leads'), value: 1000, fill: '#8B5CF6' },
    { name: t('funnel.contacted'), value: 750, fill: '#7C3AED' },
    { name: t('funnel.confirmed'), value: 450, fill: '#6D28D9' },
    { name: t('funnel.opportunity'), value: 280, fill: '#5B21B6' },
    { name: t('funnel.proposal'), value: 180, fill: '#4C1D95' },
    { name: t('funnel.closed'), value: 85, fill: '#3B0764' },
  ], [language, t]);

  const wordCloudData = useMemo(() => [
    { text: t('word.price_high'), count: 156, color: "#EF4444" },
    { text: t('word.consider'), count: 128, color: "#F59E0B" },
    { text: t('word.budget_low'), count: 95, color: "#EF4444" },
    { text: t('word.need_approval'), count: 87, color: "#F59E0B" },
    { text: t('word.competitor_cheaper'), count: 76, color: "#EF4444" },
    { text: t('word.feature_lacking'), count: 64, color: "#10B981" },
    { text: t('word.very_interested'), count: 142, color: "#10B981" },
    { text: t('word.contact_next_week'), count: 58, color: "#6B7280" },
    { text: t('word.no_time'), count: 52, color: "#F59E0B" },
    { text: t('word.good_proposal'), count: 118, color: "#10B981" },
    { text: t('word.need_compare'), count: 48, color: "#6B7280" },
    { text: t('word.boss_decide'), count: 45, color: "#6B7280" },
  ], [language, t]);

  const heatmapData = useMemo(() => [
    { name: language === 'zh' ? "张三" : "John", lat: 31.2304, lng: 121.4737, visits: 8, location: t('location.shanghai_pudong'), lastVisit: language === 'zh' ? "2小时前" : "2 hours ago" },
    { name: language === 'zh' ? "李四" : "Mike", lat: 39.9042, lng: 116.4074, visits: 6, location: t('location.beijing_chaoyang'), lastVisit: language === 'zh' ? "30分钟前" : "30 min ago" },
    { name: language === 'zh' ? "王五" : "David", lat: 22.5431, lng: 114.0579, visits: 5, location: t('location.shenzhen_nanshan'), lastVisit: language === 'zh' ? "1小时前" : "1 hour ago" },
    { name: language === 'zh' ? "赵六" : "Sarah", lat: 31.2304, lng: 121.5000, visits: 4, location: t('location.shanghai_jingan'), lastVisit: language === 'zh' ? "3小时前" : "3 hours ago" },
    { name: language === 'zh' ? "钱七" : "Emily", lat: 30.5728, lng: 104.0668, visits: 7, location: t('location.chengdu_gaoxin'), lastVisit: language === 'zh' ? "45分钟前" : "45 min ago" },
  ], [language, t]);

  const leaderboardData = useMemo(() => [
    {
      rank: 1,
      name: language === 'zh' ? "李四" : "Mike",
      avatar: "👨‍💼",
      monthTarget: 500000,
      monthAchieved: 486000,
      completionRate: 97.2,
      dealsCount: 12,
      newLeads: 45,
      trend: "up",
      trendValue: 15.3,
      phone: "138-0000-1234",
      email: "mike@company.com",
      department: language === 'zh' ? "企业客户部" : "Enterprise Sales",
      deals: [
        { id: 1, customer: language === 'zh' ? "星河科技" : "StarTech Inc", amount: 80000, date: "2024-11-20", status: t('dashboard.closed') },
        { id: 2, customer: language === 'zh' ? "创新科技" : "InnoTech Ltd", amount: 65000, date: "2024-11-18", status: t('dashboard.closed') },
        { id: 3, customer: language === 'zh' ? "未来科技" : "Future Tech", amount: 52000, date: "2024-11-15", status: t('dashboard.closed') },
        { id: 4, customer: language === 'zh' ? "智慧科技" : "Smart Solutions", amount: 48000, date: "2024-11-12", status: t('dashboard.following') },
        { id: 5, customer: language === 'zh' ? "云端科技" : "CloudTech", amount: 42000, date: "2024-11-10", status: t('dashboard.closed') },
      ],
      customers: [
        { name: language === 'zh' ? "王总" : "Mr. Wang", company: language === 'zh' ? "星河科技" : "StarTech Inc", status: t('dashboard.deal_closed'), lastContact: "2024-11-20" },
        { name: language === 'zh' ? "张经理" : "Mr. Zhang", company: language === 'zh' ? "创新科技" : "InnoTech Ltd", status: t('dashboard.deal_closed'), lastContact: "2024-11-18" },
        { name: language === 'zh' ? "李总监" : "Ms. Li", company: language === 'zh' ? "未来科技" : "Future Tech", status: t('dashboard.deal_closed'), lastContact: "2024-11-15" },
        { name: language === 'zh' ? "赵经理" : "Mr. Zhao", company: language === 'zh' ? "智慧科技" : "Smart Solutions", status: t('dashboard.following'), lastContact: "2024-11-19" },
        { name: language === 'zh' ? "钱总" : "Mr. Qian", company: language === 'zh' ? "云端科技" : "CloudTech", status: t('dashboard.deal_closed'), lastContact: "2024-11-10" },
      ],
      monthlyTrend: [
        { month: language === 'zh' ? "7月" : "Jul", amount: 380 },
        { month: language === 'zh' ? "8月" : "Aug", amount: 420 },
        { month: language === 'zh' ? "9月" : "Sep", amount: 395 },
        { month: language === 'zh' ? "10月" : "Oct", amount: 445 },
        { month: language === 'zh' ? "11月" : "Nov", amount: 486 },
      ],
    },
    {
      rank: 2,
      name: language === 'zh' ? "张三" : "John",
      avatar: "👨‍💻",
      monthTarget: 500000,
      monthAchieved: 425000,
      completionRate: 85.0,
      dealsCount: 10,
      newLeads: 38,
      trend: "up",
      trendValue: 8.7,
      phone: "139-0000-5678",
      email: "john@company.com",
      department: language === 'zh' ? "中小企业部" : "SMB Sales",
      deals: [
        { id: 1, customer: language === 'zh' ? "博远集团" : "Boyuan Group", amount: 72000, date: "2024-11-19", status: t('dashboard.closed') },
        { id: 2, customer: language === 'zh' ? "鼎盛科技" : "Dingsheng Tech", amount: 58000, date: "2024-11-16", status: t('dashboard.closed') },
        { id: 3, customer: language === 'zh' ? "华远实业" : "Huayuan Industrial", amount: 45000, date: "2024-11-13", status: t('dashboard.closed') },
      ],
      customers: [
        { name: language === 'zh' ? "刘总" : "Mr. Liu", company: language === 'zh' ? "博远集团" : "Boyuan Group", status: t('dashboard.deal_closed'), lastContact: "2024-11-19" },
        { name: language === 'zh' ? "陈经理" : "Mr. Chen", company: language === 'zh' ? "鼎盛科技" : "Dingsheng Tech", status: t('dashboard.deal_closed'), lastContact: "2024-11-16" },
        { name: language === 'zh' ? "林总监" : "Ms. Lin", company: language === 'zh' ? "华远实业" : "Huayuan Industrial", status: t('dashboard.deal_closed'), lastContact: "2024-11-13" },
      ],
      monthlyTrend: [
        { month: language === 'zh' ? "7月" : "Jul", amount: 350 },
        { month: language === 'zh' ? "8月" : "Aug", amount: 375 },
        { month: language === 'zh' ? "9月" : "Sep", amount: 390 },
        { month: language === 'zh' ? "10月" : "Oct", amount: 405 },
        { month: language === 'zh' ? "11月" : "Nov", amount: 425 },
      ],
    },
    {
      rank: 3,
      name: language === 'zh' ? "钱七" : "Emily",
      avatar: "👩‍💼",
      monthTarget: 450000,
      monthAchieved: 360000,
      completionRate: 80.0,
      dealsCount: 9,
      newLeads: 42,
      trend: "up",
      trendValue: 12.1,
      phone: "137-0000-9012",
      email: "emily@company.com",
      department: language === 'zh' ? "政企客户部" : "Government & Enterprise",
      deals: [
        { id: 1, customer: language === 'zh' ? "政务云平台" : "Gov Cloud Platform", amount: 95000, date: "2024-11-17", status: t('dashboard.closed') },
        { id: 2, customer: language === 'zh' ? "教育信息化" : "EduTech Solutions", amount: 68000, date: "2024-11-14", status: t('dashboard.closed') },
      ],
      customers: [
        { name: language === 'zh' ? "周主任" : "Director Zhou", company: language === 'zh' ? "政务云平台" : "Gov Cloud Platform", status: t('dashboard.deal_closed'), lastContact: "2024-11-17" },
        { name: language === 'zh' ? "吴处长" : "Director Wu", company: language === 'zh' ? "教育信息化" : "EduTech Solutions", status: t('dashboard.deal_closed'), lastContact: "2024-11-14" },
      ],
      monthlyTrend: [
        { month: language === 'zh' ? "7月" : "Jul", amount: 280 },
        { month: language === 'zh' ? "8月" : "Aug", amount: 310 },
        { month: language === 'zh' ? "9月" : "Sep", amount: 295 },
        { month: language === 'zh' ? "10月" : "Oct", amount: 335 },
        { month: language === 'zh' ? "11月" : "Nov", amount: 360 },
      ],
    },
    {
      rank: 4,
      name: language === 'zh' ? "王五" : "David",
      avatar: "👨",
      monthTarget: 480000,
      monthAchieved: 340000,
      completionRate: 70.8,
      dealsCount: 7,
      newLeads: 31,
      trend: "down",
      trendValue: 5.2,
      phone: "136-0000-3456",
      email: "david@company.com",
      department: language === 'zh' ? "渠道销售部" : "Channel Sales",
      deals: [
        { id: 1, customer: language === 'zh' ? "合作伙伴A" : "Partner A", amount: 55000, date: "2024-11-18", status: t('dashboard.closed') },
        { id: 2, customer: language === 'zh' ? "合作伙伴B" : "Partner B", amount: 48000, date: "2024-11-11", status: t('dashboard.closed') },
      ],
      customers: [
        { name: language === 'zh' ? "郑经理" : "Mr. Zheng", company: language === 'zh' ? "合作伙伴A" : "Partner A", status: t('dashboard.deal_closed'), lastContact: "2024-11-18" },
        { name: language === 'zh' ? "孙总" : "Mr. Sun", company: language === 'zh' ? "合作伙伴B" : "Partner B", status: t('dashboard.deal_closed'), lastContact: "2024-11-11" },
      ],
      monthlyTrend: [
        { month: language === 'zh' ? "7月" : "Jul", amount: 320 },
        { month: language === 'zh' ? "8月" : "Aug", amount: 360 },
        { month: language === 'zh' ? "9月" : "Sep", amount: 385 },
        { month: language === 'zh' ? "10月" : "Oct", amount: 370 },
        { month: language === 'zh' ? "11月" : "Nov", amount: 340 },
      ],
    },
    {
      rank: 5,
      name: language === 'zh' ? "赵六" : "Sarah",
      avatar: "👩",
      monthTarget: 420000,
      monthAchieved: 280000,
      completionRate: 66.7,
      dealsCount: 6,
      newLeads: 25,
      trend: "up",
      trendValue: 3.5,
      phone: "135-0000-7890",
      email: "sarah@company.com",
      department: language === 'zh' ? "行业客户部" : "Industry Sales",
      deals: [
        { id: 1, customer: language === 'zh' ? "制造企业" : "Manufacturing Co", amount: 62000, date: "2024-11-16", status: t('dashboard.closed') },
        { id: 2, customer: language === 'zh' ? "物流公司" : "Logistics Inc", amount: 38000, date: "2024-11-09", status: t('dashboard.closed') },
      ],
      customers: [
        { name: language === 'zh' ? "胡总" : "Mr. Hu", company: language === 'zh' ? "制造企业" : "Manufacturing Co", status: t('dashboard.deal_closed'), lastContact: "2024-11-16" },
        { name: language === 'zh' ? "马经理" : "Mr. Ma", company: language === 'zh' ? "物流公司" : "Logistics Inc", status: t('dashboard.deal_closed'), lastContact: "2024-11-09" },
      ],
      monthlyTrend: [
        { month: language === 'zh' ? "7月" : "Jul", amount: 250 },
        { month: language === 'zh' ? "8月" : "Aug", amount: 265 },
        { month: language === 'zh' ? "9月" : "Sep", amount: 270 },
        { month: language === 'zh' ? "10月" : "Oct", amount: 285 },
        { month: language === 'zh' ? "11月" : "Nov", amount: 280 },
      ],
    },
  ], [language, t]);

  const [selectedMember, setSelectedMember] = useState(teamMembersData[0]);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<typeof leaderboardData[0] | null>(null);

  const getRankBadgeText = (rank: number) => {
    if (language === 'zh') {
      return rank === 1 ? '🥇 冠军' : rank === 2 ? '🥈 亚军' : '🥉 季军';
    }
    return rank === 1 ? '🥇 Champion' : rank === 2 ? '🥈 Runner-up' : '🥉 3rd Place';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-8">
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
            <h1 className="text-xl font-bold text-foreground">{t('dashboard.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('dashboard.subtitle')}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t('dashboard.realtime')}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="w-full flex overflow-x-auto">
            <TabsTrigger value="map" className="flex-1 min-w-fit text-xs px-2">{t('dashboard.tab.map')}</TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 min-w-fit text-xs px-2">{t('dashboard.tab.stats')}</TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex-1 min-w-fit text-xs px-2">{t('dashboard.tab.leaderboard')}</TabsTrigger>
            <TabsTrigger value="competency" className="flex-1 min-w-fit text-xs px-2">{t('dashboard.tab.competency')}</TabsTrigger>
            <TabsTrigger value="trends" className="flex-1 min-w-fit text-xs px-2">{t('dashboard.tab.trends')}</TabsTrigger>
          </TabsList>

          {/* 数据统计 */}
          <TabsContent value="stats" className="space-y-4">
            {/* 总览卡片 */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <Mic className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1,248</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.stats.voice_records')}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.5% {t('dashboard.stats.vs_last_month')}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-500/20">
                      <UserPlus className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">386</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.stats.leads')}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.3% {t('dashboard.stats.vs_last_month')}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <Briefcase className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">142</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.stats.opportunities')}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+15.2% {t('dashboard.stats.vs_last_month')}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-orange-500/20">
                      <FileText className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">89</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.stats.quotes')}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+6.7% {t('dashboard.stats.vs_last_month')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 转化率卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t('dashboard.stats.conversion_rates')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.stats.voice_to_lead')}</span>
                    <span className="font-medium">30.9%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '30.9%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.stats.lead_to_opportunity')}</span>
                    <span className="font-medium">36.8%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '36.8%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.stats.opportunity_to_quote')}</span>
                    <span className="font-medium">62.7%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '62.7%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('dashboard.stats.quote_to_deal')}</span>
                    <span className="font-medium">48.3%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '48.3%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 本月趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('dashboard.stats.monthly_trend')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Mic className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                    <p className="text-lg font-bold">312</p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.stats.this_week')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <UserPlus className="h-4 w-4 mx-auto mb-1 text-green-500" />
                    <p className="text-lg font-bold">96</p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.stats.this_week')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Briefcase className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                    <p className="text-lg font-bold">35</p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.stats.this_week')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                    <p className="text-lg font-bold">22</p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.stats.this_week')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 销售排行榜 */}
          <TabsContent value="leaderboard" className="space-y-4">
            {/* 概览卡片 */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold text-foreground">{language === 'zh' ? '¥486万' : '$486K'}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.champion_sales')}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-foreground">82.5%</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.team_avg_rate')}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-success/10 to-success/5">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold text-foreground">44</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.monthly_deals')}</p>
                </CardContent>
              </Card>
            </div>

            {/* 排行榜列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {t('dashboard.monthly_leaderboard')}
                  </span>
                  <Badge variant="secondary" className="text-xs">{t('dashboard.month')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboardData.map((member) => (
                  <Card 
                    key={member.rank}
                    className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                      member.rank <= 3 ? 'border-2' : ''
                    } ${
                      member.rank === 1 ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/5 to-transparent' :
                      member.rank === 2 ? 'border-gray-400/50 bg-gradient-to-r from-gray-400/5 to-transparent' :
                      member.rank === 3 ? 'border-orange-600/50 bg-gradient-to-r from-orange-600/5 to-transparent' :
                      ''
                    }`}
                    onClick={() => setSelectedMemberDetail(member)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* 排名徽章 */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                          member.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white' :
                          member.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                          member.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {member.rank <= 3 ? (
                            <Trophy className="h-5 w-5" />
                          ) : (
                            member.rank
                          )}
                        </div>

                        {/* 成员信息 */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          {/* 名字行 */}
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xl flex-shrink-0">{member.avatar}</span>
                              <span className="font-semibold text-foreground truncate">{member.name}</span>
                              {member.rank <= 3 && (
                                <Badge className={`text-xs flex-shrink-0 ${
                                  member.rank === 1 ? 'bg-yellow-500' :
                                  member.rank === 2 ? 'bg-gray-400' :
                                  'bg-orange-600'
                                }`}>
                                  {getRankBadgeText(member.rank)}
                                </Badge>
                              )}
                            </div>
                            {/* 趋势指示 */}
                            <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${
                              member.trend === 'up' ? 'text-success' : 'text-destructive'
                            }`}>
                              {member.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span>{member.trendValue}%</span>
                            </div>
                          </div>
                          
                          {/* 统计行 */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{t('dashboard.deals')} {member.dealsCount} {t('dashboard.deals_count')}</span>
                            <span>·</span>
                            <span>{t('dashboard.new_leads')} {member.newLeads} {t('dashboard.leads_unit')}</span>
                          </div>

                          {/* 业绩数据 */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm gap-2">
                              <span className="text-muted-foreground flex-shrink-0">{t('dashboard.monthly_performance')}</span>
                              <span className="font-medium text-foreground text-right">
                                {language === 'zh' ? `¥${(member.monthAchieved / 10000).toFixed(1)}万 / ¥${(member.monthTarget / 10000).toFixed(0)}万` : `$${(member.monthAchieved / 1000).toFixed(0)}K / $${(member.monthTarget / 1000).toFixed(0)}K`}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{t('dashboard.completion_rate')}</span>
                                <span className={`font-semibold ${
                                  member.completionRate >= 90 ? 'text-success' :
                                  member.completionRate >= 70 ? 'text-warning' :
                                  'text-destructive'
                                }`}>
                                  {member.completionRate}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    member.completionRate >= 90 ? 'bg-success' :
                                    member.completionRate >= 70 ? 'bg-warning' :
                                    'bg-destructive'
                                  }`}
                                  style={{ width: `${Math.min(member.completionRate, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* 团队总览 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.team_monthly_overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{t('dashboard.team_target')}</span>
                      <span className="text-sm font-medium text-foreground">{language === 'zh' ? '¥235万' : '$2.35M'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{t('dashboard.completed')}</span>
                      <span className="text-sm font-bold text-primary">{language === 'zh' ? '¥189.1万' : '$1.89M'}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                        style={{ width: '82.5%' }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{t('dashboard.remaining')} {language === 'zh' ? '¥45.9万' : '$459K'}</span>
                      <span className="text-xs font-medium text-primary">82.5%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div className="text-center p-3 rounded-lg bg-success/5">
                      <p className="text-xs text-muted-foreground mb-1">{t('dashboard.on_target')}</p>
                      <p className="text-xl font-bold text-success">3{t('dashboard.person')}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-warning/5">
                      <p className="text-xs text-muted-foreground mb-1">{t('dashboard.sprint_needed')}</p>
                      <p className="text-xl font-bold text-warning">2{t('dashboard.person')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 销售地图 */}
          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('dashboard.team_map')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 地图占位符 */}
                <div className="relative w-full h-[400px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-border overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 mx-auto text-primary/50" />
                      <p className="text-sm text-muted-foreground">{t('dashboard.map_view')}</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.map_integration')}</p>
                    </div>
                  </div>
                  
                  {/* 模拟地图标记 */}
                  {heatmapData.map((point, index) => (
                    <div
                      key={index}
                      className="absolute w-3 h-3 bg-primary rounded-full animate-pulse"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + (index % 3) * 20}%`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 拜访热力统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.visit_heatmap')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {heatmapData.map((point, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{point.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {point.visits} {t('dashboard.visits')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{point.location}</span>
                          <span>·</span>
                          <span>{point.lastVisit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 胜任力模型 */}
          <TabsContent value="competency" className="space-y-4">
            {/* 团队成员选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.team_members')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {teamMembersData.map((member) => (
                    <Button
                      key={member.name}
                      variant={selectedMember.name === member.name ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="text-center">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs">{member.score}{t('dashboard.points')}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 雷达图 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {selectedMember.name} - {t('dashboard.competency_analysis')}
                  </span>
                  <Badge variant="secondary">{t('dashboard.overall_score')}: {selectedMember.score}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={selectedMember.data}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Radar 
                      name={selectedMember.name}
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 能力详情 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.detail_scores')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedMember.data.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground">{item.subject}</span>
                        <span className="text-sm font-medium text-primary">{item.value}{t('dashboard.points')}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI 建议 */}
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertCircle className="h-5 w-5" />
                  {t('dashboard.ai_suggestions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 text-sm">
                  <span className="text-warning">•</span>
                  <span className="text-foreground">{t('dashboard.suggestion_1')}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-warning">•</span>
                  <span className="text-foreground">{t('dashboard.suggestion_2')}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span className="text-foreground">{t('dashboard.suggestion_3')}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 业务趋势 */}
          <TabsContent value="trends" className="space-y-4">
            {/* 转化漏斗 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('dashboard.global_funnel')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <FunnelChart>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
                
                {/* 转化率统计 */}
                <div className="mt-4 space-y-2">
                  {funnelData.map((stage, index) => {
                    if (index === 0) return null;
                    const prevValue = funnelData[index - 1].value;
                    const rate = ((stage.value / prevValue) * 100).toFixed(1);
                    return (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {funnelData[index - 1].name} → {stage.name}
                        </span>
                        <Badge variant="secondary">{rate}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 高频词云 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.keyword_analysis')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('dashboard.keyword_source')}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center p-4">
                  {wordCloudData.map((word, index) => {
                    const fontSize = 12 + (word.count / 15);
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:scale-110"
                        style={{
                          fontSize: `${fontSize}px`,
                          backgroundColor: `${word.color}15`,
                          color: word.color,
                          fontWeight: word.count > 100 ? 'bold' : 'normal',
                        }}
                      >
                        <span>{word.text}</span>
                        <span className="text-xs opacity-70">({word.count})</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 词频分类统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('dashboard.objection_types')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">{t('dashboard.price_objection')}</span>
                      <span className="text-sm font-medium text-destructive">327{t('dashboard.times')} (42%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive transition-all" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">{t('dashboard.time_process_objection')}</span>
                      <span className="text-sm font-medium text-warning">242{t('dashboard.times')} (31%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-warning transition-all" style={{ width: '31%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">{t('dashboard.positive_feedback')}</span>
                      <span className="text-sm font-medium text-success">260{t('dashboard.times')} (33%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success transition-all" style={{ width: '33%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">{t('dashboard.feature_request')}</span>
                      <span className="text-sm font-medium text-info">64{t('dashboard.times')} (8%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-info transition-all" style={{ width: '8%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 成员详情弹窗 */}
      <Dialog open={!!selectedMemberDetail} onOpenChange={() => setSelectedMemberDetail(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-3xl">{selectedMemberDetail?.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span>{selectedMemberDetail?.name}</span>
                  {selectedMemberDetail && selectedMemberDetail.rank <= 3 && (
                    <Badge className={`text-xs ${
                      selectedMemberDetail.rank === 1 ? 'bg-yellow-500' :
                      selectedMemberDetail.rank === 2 ? 'bg-gray-400' :
                      'bg-orange-600'
                    }`}>
                      {t('dashboard.rank')} {selectedMemberDetail.rank} {t('dashboard.rank_suffix')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-normal mt-1">
                  {selectedMemberDetail?.department}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedMemberDetail && (
            <div className="space-y-4 mt-4">
              {/* 联系方式 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('dashboard.basic_info')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('dashboard.phone')}</p>
                      <p className="text-sm font-medium">{selectedMemberDetail.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('dashboard.email')}</p>
                      <p className="text-sm font-medium">{selectedMemberDetail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('dashboard.department')}</p>
                      <p className="text-sm font-medium">{selectedMemberDetail.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('dashboard.monthly_target')}</p>
                      <p className="text-sm font-medium">{language === 'zh' ? `¥${(selectedMemberDetail.monthTarget / 10000).toFixed(0)}万` : `$${(selectedMemberDetail.monthTarget / 1000).toFixed(0)}K`}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 业绩统计 */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">
                      {language === 'zh' ? `¥${(selectedMemberDetail.monthAchieved / 10000).toFixed(1)}万` : `$${(selectedMemberDetail.monthAchieved / 1000).toFixed(0)}K`}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.monthly_sales')}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-success/10 to-success/5">
                  <CardContent className="p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                    <p className="text-2xl font-bold text-foreground">
                      {selectedMemberDetail.dealsCount}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.closed_deals')}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <p className="text-2xl font-bold text-foreground">
                      {selectedMemberDetail.newLeads}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.new_leads_count')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* 月度趋势图 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('dashboard.monthly_trend')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selectedMemberDetail.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 成交记录 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {t('dashboard.deal_records')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedMemberDetail.deals.map((deal) => (
                      <div 
                        key={deal.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{deal.customer}</span>
                            <Badge variant={deal.status === t('dashboard.closed') ? 'default' : 'secondary'} className="text-xs">
                              {deal.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{deal.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {language === 'zh' ? `¥${(deal.amount / 10000).toFixed(1)}万` : `$${(deal.amount / 1000).toFixed(0)}K`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 客户列表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {t('dashboard.customer_list')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedMemberDetail.customers.map((customer, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{customer.name}</span>
                              <Badge variant={customer.status === t('dashboard.deal_closed') ? 'default' : 'secondary'} className="text-xs">
                                {customer.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              <span>{customer.company}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{customer.lastContact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
