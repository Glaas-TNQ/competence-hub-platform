
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { MyLearning } from './pages/MyLearning';
import { CourseView } from './pages/CourseView';
import { CompetenceAreas } from './pages/CompetenceAreas';
import { Settings } from './pages/Settings';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Goals } from './pages/Goals';
import { AdminDashboard } from './pages/AdminDashboard';
import { LearningPaths } from '@/pages/LearningPaths';
import { LearningPathView } from '@/pages/LearningPathView';
import { Auth } from './pages/Auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/my-learning" element={<MyLearning />} />
                            <Route path="/course/:courseId" element={<CourseView />} />
                            <Route path="/competence-areas" element={<CompetenceAreas />} />
                            <Route path="/learning-paths" element={<LearningPaths />} />
                            <Route path="/learning-path/:id" element={<LearningPathView />} />
                            <Route path="/goals" element={<Goals />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
