import { AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>  
  <Component {...pageProps} />
  <ToastContainer autoClose={4000} theme='light' closeOnClick transition={Zoom} toastStyle={{color:'black',backgroundColor:'#d5dad9'}}/>
    </AuthProvider>
  )
}
