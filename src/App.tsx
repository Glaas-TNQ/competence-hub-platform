import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { CompetenceAreas } from "./pages/CompetenceAreas";
import { MyLearning } from "./pages/MyLearning";
import { CourseView } from "./pages/CourseView";
import { ChapterView } from "./pages/ChapterView";
import { Badges } from "./pages/Badges";
import { Certificates } from "./pages/Certificates";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Auth } from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen bg-slate-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col min-w-0">
                      <Header />
                      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/areas" element={<CompetenceAreas />} />
                          <Route path="/my-learning" element={<MyLearning />} />
                          <Route path="/badges" element={<Badges />} />
                          <Route path="/course/:courseId" element={<CourseView />} />
                          <Route path="/course/:courseId/chapter/:chapterIndex" element={<ChapterView />} />
                          <Route path="/progress" element={<Dashboard />} />
                          <Route path="/certificates" element={<Certificates />} />
                          <Route path="/settings" element={<Dashboard />} />
                          <Route path="/admin" element={<AdminDashboard />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
