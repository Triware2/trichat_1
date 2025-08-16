import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { ChatProvider } from './contexts/ChatContext.js';

// Components
import Layout from './components/Layout/Layout.jsx';
import Loading from './components/Common/Loading.jsx';
import ErrorBoundary from './components/Common/ErrorBoundary.jsx';

// Pages
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Conversations from './pages/Conversations/Conversations.jsx';
import ConversationDetail from './pages/Conversations/ConversationDetail.jsx';
import Settings from './pages/Settings/Settings.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';
import Customers from './pages/Customers/Customers.jsx';
import CustomerDetail from './pages/Customers/CustomerDetail.jsx';
import Install from './pages/Install/Install.jsx';
import Login from './pages/Auth/Login.jsx';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/install" element={<Install />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/conversations"
        element={
          <ProtectedRoute>
            <Layout>
              <Conversations />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/conversations/:conversationId"
        element={
          <ProtectedRoute>
            <Layout>
              <ConversationDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Layout>
              <Customers />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customers/:customerId"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ChatProvider>
              <Router>
                <div className="app">
                  <AppRoutes />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#10B981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: '#EF4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </ChatProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App; 