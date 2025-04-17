import { callAPi } from './http-common';

interface adminLogin {
  email: string;
  password: string;
}

const adminLogin = (data: adminLogin) => callAPi.post('/api/auth/login', data);

const authServices = {
  adminLogin,
};

export default authServices;
