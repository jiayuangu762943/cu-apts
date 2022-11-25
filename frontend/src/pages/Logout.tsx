import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { queryCache } from 'src/app/App'
import useRouter from '../utils/useRouter';
import { logout } from '../utils/authSlice';

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    // queryCache.clear()
    router.push('/');
  }, [dispatch, router]);

  return null;
};

export default Logout;
