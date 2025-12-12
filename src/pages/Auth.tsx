import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft, Radio, Sparkles, LogOut, User, Settings } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // 检查是否已登录
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsCheckingSession(false);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session) {
        // 不自动跳转，让用户可以看到已登录状态
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("登录成功！");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast.success("注册成功！");
      }
    } catch (error: any) {
      toast.error(error.message || "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google登录失败");
    }
  };

  const handleThirdPartyNotice = (platform: string) => {
    toast.info(`${platform}登录需要额外配置`, {
      description: "请联系管理员开启此功能",
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("已退出登录");
    } catch (error: any) {
      toast.error(error.message || "退出失败");
    }
  };

  const handleDeleteAccount = async () => {
    toast.info("注销账号功能需要管理员权限", {
      description: "请联系管理员处理账号注销请求",
    });
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 已登录状态显示
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4 relative overflow-hidden">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-xl bg-card/95 border-2 shadow-2xl relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>

          {/* 用户信息区域 */}
          <div className="flex flex-col items-center space-y-4 pt-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-2xl shadow-primary/30">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                账号管理
              </h1>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                已登录
              </span>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* 账号信息 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">邮箱</span>
              </div>
              <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">账号创建时间</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
              onClick={() => navigate("/")}
            >
              进入应用
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 border-2 hover:bg-muted/50 transition-all"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-11 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  注销账号
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确定要注销账号吗？</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将永久删除您的账号和所有相关数据，且无法恢复。请谨慎操作。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    确认注销
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-xl bg-card/95 border-2 shadow-2xl relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>

        {/* Logo区域 */}
        <div className="flex flex-col items-center space-y-4 pt-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-2xl shadow-primary/30">
              <Radio className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {isLogin ? "欢迎回来" : "开始使用"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "登录您的 SalesCore 账号" : "创建您的 SalesCore 账号"}
            </p>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-primary" />
              邮箱地址
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-background/50 border-2 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" />
              密码
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? "输入密码" : "至少6位字符"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 bg-background/50 border-2 focus:border-primary transition-all"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/30 transition-all font-medium" 
            disabled={loading}
          >
            {loading ? "处理中..." : isLogin ? "立即登录" : "立即注册"}
          </Button>
        </form>

        <div className="relative">
          <Separator className="bg-border/50" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground font-medium">
            或使用第三方登录
          </span>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full h-11 border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
            onClick={handleGoogleAuth}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google 账号登录
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 border-2 opacity-60 hover:opacity-80 transition-all"
            onClick={() => handleThirdPartyNotice("微信")}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
            </svg>
            微信账号（需配置）
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 border-2 opacity-60 hover:opacity-80 transition-all"
            onClick={() => handleThirdPartyNotice("Line")}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            Line 账号（需配置）
          </Button>
        </div>

        <div className="text-center pt-2">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "还没有账号？" : "已有账号？"}
            <span className="ml-1 font-semibold text-primary">
              {isLogin ? "立即注册" : "立即登录"}
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
