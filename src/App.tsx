import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import PageSkeleton from "./components/PageSkeleton";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Cursos = lazy(() => import("./pages/Cursos"));
const CursoDetalle = lazy(() => import("./pages/CursoDetalle"));
const Escenario = lazy(() => import("./pages/Escenario"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Logros = lazy(() => import("./pages/Logros"));
const Calculadora = lazy(() => import("./pages/Calculadora"));
const Jardin = lazy(() => import("./pages/Jardin"));
const Polinizacion = lazy(() => import("./pages/Polinizacion"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const Ejercicios = lazy(() => import("./pages/Ejercicios"));
const Juegos = lazy(() => import("./pages/Juegos"));
const TicketDashboard = lazy(() =>
  import("./components/GotItTickets/TicketDashboard").then((m) => ({ default: m.TicketDashboard }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const sk = <PageSkeleton />;

// Home route: authenticated users see the Garden (new home);
// unauthenticated users see the public landing page (Index).
function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Index />;
  }

  return (
    <AppLayout>
      <Suspense fallback={sk}>
        <Jardin />
      </Suspense>
    </AppLayout>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Legacy redirect: /jardin -> / (garden is now home) */}
        <Route path="/jardin" element={<Navigate to="/" replace />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Suspense fallback={sk}><Dashboard /></Suspense>} />
          <Route path="/cursos" element={<Suspense fallback={sk}><Cursos /></Suspense>} />
          <Route path="/cursos/:id" element={<Suspense fallback={sk}><CursoDetalle /></Suspense>} />
          <Route path="/cursos/:courseId/escenario/:scenarioId" element={<Suspense fallback={sk}><Escenario /></Suspense>} />
          <Route path="/perfil" element={<Suspense fallback={sk}><Perfil /></Suspense>} />
          <Route path="/logros" element={<Suspense fallback={sk}><Logros /></Suspense>} />
          <Route path="/calculadora" element={<Suspense fallback={sk}><Calculadora /></Suspense>} />
          <Route path="/polinizacion" element={<Suspense fallback={sk}><Polinizacion /></Suspense>} />
          <Route path="/flashcards" element={<Suspense fallback={sk}><Flashcards /></Suspense>} />
          <Route path="/ejercicios" element={<Suspense fallback={sk}><Ejercicios /></Suspense>} />
          <Route path="/juegos" element={<Suspense fallback={sk}><Juegos /></Suspense>} />
          <Route path="/gotit" element={<Suspense fallback={sk}><TicketDashboard /></Suspense>} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
