import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.roles?.find(role => allowedRoles?.includes(role))
      //This outlet represents all the children of RequireAuth (so it can protect all the child components nested)
      ? <Outlet />
      : auth?.accessToken //changed from user to accessToken to persist login after refresh
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;