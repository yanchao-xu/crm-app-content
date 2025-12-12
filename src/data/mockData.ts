// Shipping/Freight forwarding related mock data

export interface Mark {
  id: string;
  time: string;
  content: { zh: string; en: string };
  marked: boolean;
}

export interface AIExtractedData {
  phone?: string;
  email?: string;
  budget?: string;
  nextFollowUp?: { zh: string; en: string };
  amount?: string;
  probability?: string;
  expectedClose?: string;
  requirements?: { zh: string; en: string };
  decisionMaker?: { zh: string; en: string };
  risk?: { zh: string; en: string };
}

export interface InboxItem {
  id: string;
  type: "voice-memo" | "phone-call" | "meeting-record";
  targetType: "lead" | "opportunity";
  audioUrl?: string;
  transcript: { zh: string; en: string };
  customerName: { zh: string; en: string };
  company: { zh: string; en: string };
  confidence: "high" | "medium" | "low";
  status: "pending" | "analyzing" | "approved" | "archived";
  timestamp: { zh: string; en: string };
  duration?: string;
  marks?: Mark[];
  extractedData?: AIExtractedData;
  hasLocation?: boolean;
  aiSuggestions?: { zh: string; en: string }[];
}

export const shippingMockData: InboxItem[] = [
  {
    id: "1",
    type: "meeting-record",
    targetType: "opportunity",
    audioUrl: "/audio/meeting-sample.mp3",
    transcript: {
      zh: "陈总：我们每月有大约200个20尺柜从上海发往洛杉矶，目前的海运费在每柜4500美金左右。你们能给到什么价格？另外，我们需要门到门服务，包括美国那边的清关和内陆运输。预计明年一季度的货量还会增加30%，所以需要一个长期稳定的合作伙伴。",
      en: "Mr. Chen: We ship about 200 TEUs monthly from Shanghai to Los Angeles. Current ocean freight is around $4,500 per container. What rates can you offer? We also need door-to-door service including US customs clearance and inland transport. We expect 30% volume increase in Q1 next year, so we need a long-term reliable partner."
    },
    customerName: { zh: "陈总 (物流总监)", en: "Mr. Chen (Logistics Director)" },
    company: { zh: "环球贸易集团", en: "Global Trade Group" },
    confidence: "high",
    status: "pending",
    timestamp: { zh: "2分钟前", en: "2 min ago" },
    duration: "12:35",
    marks: [
      { id: "m1", time: "02:15", content: { zh: "提到月运量200柜", en: "Mentioned 200 TEU monthly volume" }, marked: false },
      { id: "m2", time: "05:42", content: { zh: "需要门到门服务", en: "Requires door-to-door service" }, marked: true },
      { id: "m3", time: "08:20", content: { zh: "明年货量增加30%", en: "30% volume increase next year" }, marked: false },
    ],
    extractedData: {
      amount: "$900,000/year",
      probability: "70%",
      expectedClose: "2024-12-20",
      risk: { zh: "价格竞争激烈", en: "Intense price competition" },
      decisionMaker: { zh: "陈总最终审批", en: "Mr. Chen final approval" },
    },
    aiSuggestions: [
      { zh: "准备上海-洛杉矶航线的详细报价方案，包含不同船公司选项", en: "Prepare detailed Shanghai-LA route quote with different carrier options" },
      { zh: "联系美国代理确认清关和内陆运输成本", en: "Contact US agent to confirm customs and inland transport costs" },
    ],
    hasLocation: true
  },
  {
    id: "2",
    type: "phone-call",
    targetType: "lead",
    audioUrl: "/audio/call-sample.mp3",
    transcript: {
      zh: "李经理：我们是做跨境电商的，主要发FBA头程到美国。现在每周大概有50立方的货，走的是快船，时效要求12-15天到港。你们有拼箱服务吗？价格怎么算？我的电话是138-8888-9999，邮箱是li@crossborder.com，下周可以详细聊。",
      en: "Manager Li: We're in cross-border e-commerce, mainly FBA shipments to the US. About 50 CBM weekly, using express services, need 12-15 days port delivery. Do you offer LCL services? What are the rates? My phone is 138-8888-9999, email li@crossborder.com. Let's talk in detail next week."
    },
    customerName: { zh: "李经理", en: "Manager Li" },
    company: { zh: "跨境优选电商", en: "CrossBorder E-commerce Co." },
    confidence: "medium",
    status: "analyzing",
    timestamp: { zh: "15分钟前", en: "15 min ago" },
    duration: "8:24",
    marks: [
      { id: "m4", time: "01:30", content: { zh: "FBA头程需求", en: "FBA first-leg requirement" }, marked: false },
      { id: "m5", time: "04:15", content: { zh: "时效要求12-15天", en: "12-15 days transit time required" }, marked: false },
    ],
    extractedData: {
      phone: "138-8888-9999",
      email: "li@crossborder.com",
      budget: "$15-20/CBM",
      nextFollowUp: { zh: "下周详谈", en: "Discuss next week" },
      requirements: { zh: "FBA头程拼箱服务，时效12-15天", en: "FBA LCL service, 12-15 days transit" },
    },
    aiSuggestions: [
      { zh: "发送FBA头程拼箱报价至 li@crossborder.com", en: "Send FBA LCL quote to li@crossborder.com" },
      { zh: "创建日程：下周与李经理详细沟通拼箱方案", en: "Create schedule: Discuss LCL solution with Manager Li next week" },
    ],
    hasLocation: false
  },
  {
    id: "3",
    type: "voice-memo",
    targetType: "lead",
    transcript: {
      zh: "刚和赵总聊完，他们公司做东南亚专线，需要从深圳发往新加坡和马来西亚。整柜和拼箱都有需求，月货量大概100柜左右，约个时间详谈合作模式。",
      en: "Just finished talking with Mr. Zhao. Their company does Southeast Asia routes, shipping from Shenzhen to Singapore and Malaysia. Need both FCL and LCL, about 100 TEU monthly. Schedule a time to discuss partnership."
    },
    customerName: { zh: "赵总", en: "Mr. Zhao" },
    company: { zh: "东南亚物流专线", en: "SEA Logistics Express" },
    confidence: "low",
    status: "pending",
    timestamp: { zh: "1小时前", en: "1 hour ago" },
    duration: "2:15",
    extractedData: {
      nextFollowUp: { zh: "约时间详谈", en: "Schedule detailed discussion" },
    },
    aiSuggestions: [
      { zh: "准备深圳-新加坡/马来西亚航线报价", en: "Prepare Shenzhen-Singapore/Malaysia route quotes" },
      { zh: "创建日程：与赵总预约详谈时间", en: "Create schedule: Book meeting with Mr. Zhao" },
    ],
    hasLocation: true
  },
];

export interface ChatMessage {
  role: "user" | "assistant";
  content: { zh: string; en: string };
}

export const chatMockData: ChatMessage[] = [
  {
    role: "user",
    content: {
      zh: "帮我创建一条线索：客户是王经理，电话13900139000，公司是深圳华运国际货代，需求是东南亚整柜海运服务",
      en: "Create a lead: Contact is Manager Wang, phone 13900139000, company is Shenzhen Huayun International Freight, need Southeast Asia FCL ocean freight service"
    }
  },
  {
    role: "assistant",
    content: {
      zh: "✅ 已为您创建新线索\n\n📋 **线索详情**\n• 客户姓名：王经理\n• 联系电话：13900139000\n• 公司名称：深圳华运国际货代\n• 需求描述：东南亚整柜海运服务\n• 状态：待跟进\n\n🔗 [查看线索详情](/lead/123)",
      en: "✅ New lead created\n\n📋 **Lead Details**\n• Contact: Manager Wang\n• Phone: 13900139000\n• Company: Shenzhen Huayun International Freight\n• Requirements: Southeast Asia FCL ocean freight\n• Status: Pending follow-up\n\n🔗 [View Lead Details](/lead/123)"
    }
  },
  {
    role: "user",
    content: {
      zh: "更新客户张总的信息，把他的职位改成采购总监，备注这个客户月货量约150柜",
      en: "Update client Mr. Zhang's info, change title to Procurement Director, note that this client ships about 150 TEU monthly"
    }
  },
  {
    role: "assistant",
    content: {
      zh: "✅ 客户信息已更新\n\n👤 **客户档案**\n• 姓名：张总\n• 职位：采购总监 ⬆️\n• 备注：月货量约150柜 ⬆️\n• 更新时间：刚刚\n\n💡 建议：该客户货量较大，可考虑提供VIP专属运价方案",
      en: "✅ Client info updated\n\n👤 **Client Profile**\n• Name: Mr. Zhang\n• Title: Procurement Director ⬆️\n• Note: ~150 TEU monthly volume ⬆️\n• Updated: Just now\n\n💡 Suggestion: High-volume client, consider offering VIP exclusive rates"
    }
  }
];

export interface ToolkitNote {
  id: string;
  type: "voice" | "card";
  content: { zh: string; en: string };
  timestamp: { zh: string; en: string };
  status: "processing" | "completed";
}

export const toolkitMockData: ToolkitNote[] = [
  {
    id: "1",
    type: "voice",
    content: {
      zh: "刚才陈总说运费预算在每柜4000-4500美金，要求周三前给出详细报价...",
      en: "Mr. Chen mentioned freight budget is $4000-4500 per container, needs detailed quote by Wednesday..."
    },
    timestamp: { zh: "5分钟前", en: "5 min ago" },
    status: "completed",
  },
  {
    id: "2",
    type: "card",
    content: {
      zh: "李经理 - 远洋国际货运代理",
      en: "Manager Li - Ocean International Freight Forwarding"
    },
    timestamp: { zh: "1小时前", en: "1 hour ago" },
    status: "completed",
  },
];
