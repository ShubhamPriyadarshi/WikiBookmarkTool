// components/RootRedirect.js
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

export default function RootRedirect() {
const token = localStorage.getItem('token');
  return (

    <Navigate to={token ? '/search' : '/login'} replace />
  );
}
