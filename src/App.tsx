
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import pages
import { Index } from './pages/Index';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { CompetenceAreas } from './pages/CompetenceAreas';
import { CourseView } from './pages/CourseView';
import { ChapterView } from './pages/ChapterView';
import { MyLearning } from './pages/MyLearning';
import { Certificates } from './pages/Certificates';
import { Badges } from './pages/Badges';
import { AdminDashboard } from './pages/AdminDashboard';
import { Notes } from './pages/Notes';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex h-screen bg-gray-50">
                      <Sidebar />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/areas" element={<CompetenceAreas />} />
                            <Route path="/course/:courseId" element={<CourseView />} />
                            <Route path="/course/:courseId/chapter/:chapterIndex" element={<ChapterView />} />
                            <Route path="/my-learning" element={<MyLearning />} />
                            <Route path="/certificates" element={<Certificates />} />
                            <Route path="/badges" element={<Badges />} />
                            <Route path="/notes" element={<Notes />} />
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
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
