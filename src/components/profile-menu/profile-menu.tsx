import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logout } from '../../services/reducers/authReducer';
import { RootState, useDispatch, useSelector } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const nav = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    nav('/login');
    window.location.reload();
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
