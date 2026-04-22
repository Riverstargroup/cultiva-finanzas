import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
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

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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
          <Route path="/jardin" element={<Suspense fallback={sk}><Jardin /></Suspense>} />
          <Route path="/polinizacion" element={<Suspense fallback={sk}><Polinizacion /></Suspense>} />
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
