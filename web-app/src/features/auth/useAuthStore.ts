import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser, loginUser } from '../../api/userApi';
import { signUpUserWithGoogle } from '../../api/authApi';
import { ISignupSchema } from '@/schemas/signupSchema';
import { ILoginSchema } from '@/schemas/loginSchema';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSignupSubmit = async (data: ISignupSchema) => {
    try {
      await signUpUser(data.email, data.password);
      navigate('/app/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const onLoginSubmit = async (data: ILoginSchema) => {
    try {
      await loginUser(data.email, data.password);
      navigate('/app/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSignupWithGoogle = async () => {
    try {
      const data = await signUpUserWithGoogle();
      window.location.href = data.url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return {
    onSignupSubmit,
    onLoginSubmit,
    handleSignupWithGoogle,
    error,
  };
};