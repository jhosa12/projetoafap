import { MenuLateral } from '@/components/menu';
import { AuthContext, AuthProvider, useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/apiClient';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { memo, StrictMode, useEffect } from 'react';
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const MemoizedMenuLateral = memo(MenuLateral);

function isLoginPage(pathname: string) {
  return pathname === '/' //|| pathname==='/sorteio';
}


function PrivateRouter({Component,pageProps,router}:AppProps){

  const {usuario,setPermissoes,userLogged} = useAuth()

async function GetPermissions() {
 
  try {
    const permissions = await api.post('/user/permissions',{
      id_usuario:usuario?.id
    })
    setPermissoes(permissions.data)
 
  } catch (error) {
    console.log(error)
  }
 

}


  useEffect(()=>{


    if( !userLogged() && !isLoginPage(router.pathname)){
      router.push('/')
    }
     
 !isLoginPage(router.pathname) &&  usuario?.id &&  GetPermissions()
  
    
   
   
  },[router.pathname,usuario])

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
