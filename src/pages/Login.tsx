import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FlameIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { t } = useTranslation();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t("login.failed"),
                description: error.message || t("login.failedDescription"),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] bg-accent/20 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-y-[-50%]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 dark:bg-primary/10 rounded-full blur-[80px] pointer-events-none translate-y-[20%]" />

            <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl">
                <CardHeader className="space-y-3 text-center pt-8">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                        <FlameIcon className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">{t("login.title")}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t("login.subtitle")}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 pt-4 pb-6 px-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                {t("login.email")}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium flex justify-between">
                                {t("login.password")}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-background/50 border-border/50 focus-visible:ring-primary/50 transition-all"
                                autoComplete="current-password"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="px-8 pb-8">
                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                                    {t("login.signingIn")}
                                </span>
                            ) : (
                                t("login.signIn")
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="mt-8 text-sm text-muted-foreground/60 font-medium">
                {t("login.secureAuth")}
            </div>
        </div>
    );
}
