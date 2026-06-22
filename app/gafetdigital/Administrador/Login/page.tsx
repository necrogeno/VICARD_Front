import LoginForm from '@/app/gafetdigital/Administrador/Login/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Sistema de Identificación',
  description: 'Acceso seguro al panel de control.',
};

export default function LoginPage() {
  return <LoginForm />;
}
