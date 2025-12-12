import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Inbox, Smartphone, Wrench, Menu, Radio, ClipboardList, TrendingUp, BarChart3, LogIn, MessageSquare, LogOut, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartInbox from "./SmartInbox";
import AIChat from "./AIChat";
import FieldToolkit from "./FieldToolkit";

const Index = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("inbox");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(language === "zh" ? "已退出登录" : "Logged out successfully");
      setMenuOpen(false);
    } catch (error: any) {
      toast.error(error.message || (language === "zh" ? "退出失败" : "Logout failed"));
    }
  };

  const getUserInitial = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  const menuItems = [
    {
      icon: Smartphone,
      title: t("menu.hardware"),
      description: t("menu.hardware_desc"),
      path: "/hardware-companion",
      color: "from-info to-info/80",
    },
    {
      icon: ClipboardList,
      title: t("menu.leads"),
      description: t("menu.leads_desc"),
      path: "/my-leads",
      color: "from-warning to-warning/80",
    },
    {
      icon: TrendingUp,
      title: t("menu.opportunities"),
      description: t("menu.opportunities_desc"),
      path: "/my-opportunities",
      color: "from-success to-success/80",
    },
    {
      icon: BarChart3,
      title: t("menu.dashboard"),
      description: t("menu.dashboard_desc"),
      path: "/dashboard",
      color: "from-purple-500 to-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                    <Radio className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{t("app.name")}</h2>
                    <p className="text-xs text-muted-foreground">{t("app.subtitle")}</p>
                  </div>
                </div>
                
                {/* User info section */}
                {user ? (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white font-semibold">
                          {getUserInitial()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">{t("auth.logged_in")}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      {t("auth.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm text-muted-foreground text-center mb-3">
                      {t("auth.sync_data")}
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        navigate("/auth");
                        setMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      {t("auth.login")}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-100"
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
                    }}
                  >
                    <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                    <div className="p-4 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t("app.name")}</h1>
              <p className="text-xs text-muted-foreground">{t("app.subtitle")}</p>
            </div>
          </div>

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
          >
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b border-border bg-background h-14 p-0">
          <TabsTrigger 
            value="inbox" 
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary gap-2"
          >
            <Inbox className="h-4 w-4" />
            <span className="hidden sm:inline">{t("tab.inbox")}</span>
            <span className="sm:hidden">{t("tab.inbox")}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai-chat" 
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">{t("tab.ai_chat_full")}</span>
            <span className="sm:hidden">{t("tab.ai_chat")}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="toolkit" 
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary gap-2"
          >
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">{t("tab.toolkit_full")}</span>
            <span className="sm:hidden">{t("tab.toolkit")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="flex-1 m-0">
          <SmartInbox />
        </TabsContent>

        <TabsContent value="ai-chat" className="flex-1 m-0">
          <AIChat />
        </TabsContent>

        <TabsContent value="toolkit" className="flex-1 m-0">
          <FieldToolkit />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
