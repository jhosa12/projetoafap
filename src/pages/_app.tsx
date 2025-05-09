import { ModalLoading } from '@/components/modals/loading/modalLoading';
import { MenuLateral } from '@/components/layouts/menu';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { memo, StrictMode, useEffect } from 'react';

import { Toaster } from "@/components/ui/sonner";




const Header = memo(MenuLateral);

function isLoginPage(pathname: string) {
  return pathname === '/' || pathname === '_error';
}


function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div translate='no'  className="w-full">
      <Header />
      
     <div> {children}</div>
     
    </div>
  );
}

function PrivateRouter({ Component, pageProps }: AppProps) {
  const { usuario,loadingInfo,signOut} = useAuth();
  const router = useRouter();

  /*async function GetPermissions() {
    try {
      if (usuario?.id) {
        const permissions = await api.post('/user/permissions', {
          id_usuario: usuario.id,
        });
        setPermissoes(permissions.data);
      }
    } catch (error) {
      console.log('Erro ao carregar permissões');
      signOut()
     
    }
  }*/

  useEffect(() => {
    if (!isLoginPage(router.pathname)) {
      if (!usuario) {
        // Redireciona para a página inicial se o usuário não estiver autenticado
        signOut();
      } /*else {
        // Carrega as permissões quando o usuário está autenticado
        GetPermissions();
      }*/
    }
  }, [router.pathname, usuario]);

  // Renderiza a página de erro 404, se aplicável
  if (pageProps.statusCode === 404) {
    return <Error statusCode={404} />;
  }

  // Renderiza o layout privado apenas para rotas protegidas
  if (!isLoginPage(router.pathname)) {
    return (
      <PrivateLayout >
        <ModalLoading show={loadingInfo} />
        <Component  {...pageProps} />
      </PrivateLayout>
    );
  }

  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps,router }: AppProps) {
  return (
    <StrictMode>
      <AuthProvider >
        
        <PrivateRouter router={router} Component={Component} pageProps={pageProps} />
    
         <Toaster closeButton theme='system' visibleToasts={3} expand={true} richColors position="bottom-right" toastOptions={{ duration: 4000 }} />
      </AuthProvider>
    </StrictMode>
  );
}
