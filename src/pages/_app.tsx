import { MenuLateral } from '@/components/menu';
import { AuthContext, AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { memo, StrictMode } from 'react';
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const MemoizedMenuLateral = memo(MenuLateral);

function isLoginPage(pathname: string) {
  return pathname === '/' //|| pathname==='/sorteio';
}
export default function App({ Component, pageProps }: AppProps) {
 
  const router = useRouter();
  return (
    <StrictMode>
    <AuthProvider>
      {!isLoginPage(router.pathname) && <MemoizedMenuLateral />}
      <Component {...pageProps} />
      <ToastContainer
       autoClose={4000}
       theme='light' 
       closeOnClick 
       transition={Zoom}
        toastStyle={{ color: 'black', backgroundColor: '#d5dad9' }} />
    </AuthProvider>
    </StrictMode>
  )
}
