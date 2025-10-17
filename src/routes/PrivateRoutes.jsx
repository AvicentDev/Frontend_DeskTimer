import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/auth/AuthContext'; // Asegúrate de que la ruta sea correcta

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
