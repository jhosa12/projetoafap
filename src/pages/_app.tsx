import { MenuLateral } from '@/components/menu';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/apiClient';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { memo, StrictMode, useEffect } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function isLoginPage(pathname: string) {
  return pathname === '/' || pathname === '_error';
}

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MenuLateral />
      <div>{children}</div>
    </div>
  );
}

function PrivateRouter({ Component, pageProps }: AppProps) {
  const { usuario, setPermissoes} = useAuth();
  const router = useRouter();

  async function GetPermissions() {
    try {
      if (usuario?.id) {
        const permissions = await api.post('/user/permissions', {
          id_usuario: usuario.id,
        });
        setPermissoes(permissions.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!isLoginPage(router.pathname)) {
      if (!usuario) {
        // Redireciona para a página inicial se o usuário não estiver autenticado
        router.push('/');
      } else {
        // Carrega as permissões quando o usuário está autenticado
        GetPermissions();
      }
    }
  }, [router.pathname, usuario]);

  // Renderiza a página de erro 404, se aplicável
  if (pageProps.statusCode === 404) {
    return <Error statusCode={404} />;
  }

  // Renderiza o layout privado apenas para rotas protegidas
  if (!isLoginPage(router.pathname)) {
    return (
      <PrivateLayout>
        <Component {...pageProps} />
      </PrivateLayout>
    );
  }

  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps,router }: AppProps) {
  return (
    <StrictMode>
      <AuthProvider>
        <PrivateRouter router={router} Component={Component} pageProps={pageProps} />
        <ToastContainer
          autoClose={4000}
          theme="light"
          closeOnClick
          transition={Zoom}
          toastStyle={{ color: 'black', backgroundColor: '#d5dad9' }}
        />
      </AuthProvider>
    </StrictMode>
  );
}
