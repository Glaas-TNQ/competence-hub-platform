
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { CompetenceAreas } from './pages/CompetenceAreas';
import { CourseView } from './pages/CourseView';
import { MyLearning } from './pages/MyLearning';
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
                <Route path="/" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <Dashboard />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/dashboard" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <Dashboard />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/course/:courseId" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <CourseView />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/competence-areas" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <CompetenceAreas />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/my-learning" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <MyLearning />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/goals" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <Goals />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/settings" element={<>
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <Settings />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                </>} />
                <Route path="/learning-paths" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <LearningPaths />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/learning-path/:id" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1">
                          <LearningPathView />
                        </main>
                      </div>
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <div className="flex">
                        <Sidebar />
                        <main className="flex-1 p-8">
                          <AdminDashboard />
                        </main>
                      </div>
                    </>
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
