import { MenuLateral } from '@/components/menu';
import { AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function isLoginPage(pathname: string) {
<<<<<<< HEAD
  return pathname === '/' || pathname==='/TI';
=======
  return pathname === '/';
>>>>>>> dc3e27855ed6fea9632d0334bf217af166253d4e
}
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return(
    <AuthProvider>  
      {!isLoginPage(router.pathname) && <MenuLateral/>}
      <Component {...pageProps} />
   
  
  <ToastContainer autoClose={4000} theme='light' closeOnClick transition={Zoom} toastStyle={{color:'black',backgroundColor:'#d5dad9'}}/>
    </AuthProvider>
  )
}
