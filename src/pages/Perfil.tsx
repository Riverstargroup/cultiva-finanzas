import { motion } from "framer-motion";
import { User, LogOut, BookOpen, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageTransition from "@/components/PageTransition";
import StatCard from "@/components/StatCard";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Perfil() {
  const { profile, loading } = useProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleEdit = () => {
    setName(profile?.full_name || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Nombre actualizado" });
      setEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-3xl font-bold text-primary">Perfil</h1>

        {/* Avatar + Info */}
        <Card className="border-border/50">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl">
              {loading ? "..." : initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="max-w-xs"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} className="min-h-[44px]">Guardar</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="min-h-[44px]">Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-lg text-foreground">
                    {loading ? "Cargando..." : profile?.full_name || "Sin nombre"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Button variant="ghost" size="sm" className="mt-1" onClick={handleEdit}>
                    Editar nombre
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-3">
          <motion.div variants={item}>
            <StatCard title="Escenarios" value="0" icon={BookOpen} accentClass="text-primary" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard title="Cursos" value="0" icon={Award} accentClass="text-secondary" />
          </motion.div>
          <motion.div variants={item}>
            <StatCard title="Logros" value="0/8" icon={Trophy} accentClass="text-accent" />
          </motion.div>
        </motion.div>

        {/* Sign Out */}
        <Button
          variant="destructive"
          size="lg"
          className="w-full min-h-[44px] rounded-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" /> Cerrar sesión
        </Button>
      </div>
    </PageTransition>
  );
}
