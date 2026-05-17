import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy-load non-landing pages for smaller initial bundle
const Accommodations = lazy(() => import("./pages/Accommodations"));
const Ecotourism = lazy(() => import("./pages/Ecotourism"));
const Fishing = lazy(() => import("./pages/Fishing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages — lazy-loaded, only downloaded when admin accesses them
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AccommodationsManager = lazy(() => import("./pages/admin/AccommodationsManager"));
const BannersManager = lazy(() => import("./pages/admin/BannersManager"));
const TestimonialsManager = lazy(() => import("./pages/admin/TestimonialsManager"));
const FAQsManager = lazy(() => import("./pages/admin/FAQsManager"));
const SiteConfigManager = lazy(() => import("./pages/admin/SiteConfigManager"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min cache
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

const PublicChrome = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <PublicChrome>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Index />} />
                  <Route path="/acomodacoes" element={<Accommodations />} />
                  <Route path="/ecoturismo" element={<Ecotourism />} />
                  <Route path="/pesca" element={<Fishing />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/contato" element={<Contact />} />

                  {/* Admin — login page fora do layout protegido */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin — todas as sub-rotas dentro do layout protegido */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="acomodacoes" element={<AccommodationsManager />} />
                    <Route path="banners" element={<BannersManager />} />
                    <Route path="depoimentos" element={<TestimonialsManager />} />
                    <Route path="faqs" element={<FAQsManager />} />
                    <Route path="configuracoes" element={<SiteConfigManager />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PublicChrome>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
