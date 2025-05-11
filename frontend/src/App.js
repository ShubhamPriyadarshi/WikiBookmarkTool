import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './pages/Search';
import Saved from './pages/Saved';
import MyAppBar from './components/AppBar';
import { WebSocketProvider } from './components/WebSocketContext';
import ArticleDetail from './components/ArticleDetail';
import SavedArticleDetail from './components/SavedArticleDetail';
//import './App.css';

import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
function App() {
  return (
    <WebSocketProvider>
        <MyAppBar />
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
               {/* Protected route for Home */}
          <Route
          path="/"
          element={
            <ProtectedRoute>
              <Search />
             </ProtectedRoute>
          }
        />



        {/* Protected route for Saved */}
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          }
        />

        {/* Protected route for Article Detail */}
        <Route
          path="/article/:pageid"
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved/page/:pageid"
          element={
            <ProtectedRoute>
              <SavedArticleDetail />
            </ProtectedRoute>
          }
        />
        </Routes>
    </WebSocketProvider>
  );
}

export default App;
