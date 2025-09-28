import { FC, useEffect } from 'react';
import { TProtectedRouteProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserProfile,
  selectUserProfileLoading,
  fetchProfile
} from '../../services/profile';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserProfileLoading);
  const token = getCookie('accessToken');

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!token && !user) {
    return <Navigate to='/login' />;
  }

  return children;
};
