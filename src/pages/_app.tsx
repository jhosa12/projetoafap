import { MenuLateral } from '@/components/menu';
import { AuthContext, AuthProvider, useAuth } from '@/contexts/AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { memo, StrictMode, useEffect } from 'react';
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const MemoizedMenuLateral = memo(MenuLateral);

function isLoginPage(pathname: string) {
  return pathname === '/' //|| pathname==='/sorteio';
}


function PrivateRouter({Component,pageProps,router}:AppProps){

  const {isAuthenticated} = useAuth()
  useEffect(()=>{
    if(!isAuthenticated && !isLoginPage(router.pathname)){
      router.push('/')
    }
  },[isAuthenticated,router])

  return <Component {...pageProps}/>
}




export default function App({ Component, pageProps,router }: AppProps) {
 
  
  return (
    <StrictMode>
    <AuthProvider>
      {!isLoginPage(router.pathname) && <MemoizedMenuLateral />}
     <PrivateRouter router={router} Component={Component} pageProps={pageProps}/>
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
