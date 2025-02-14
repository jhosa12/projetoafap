import {Inter, Roboto_Mono,Source_Sans_3,Geist} from 'next/font/google';
import localFont from 'next/font/local';

export const timesNewRoman = localFont({
  src: '../../public/fonts/times.ttf', // Caminho do arquivo da fonte
  display: 'swap',
  weight: '400', // Ajuste conforme necessário
  style: 'normal',
});

export const source_Sans_3 = Source_Sans_3({
    subsets:['latin'],
    display:'swap',
})

export const inter = Inter({
    subsets:['latin'],
    display:'swap',
})

export const roboto_Mono = Roboto_Mono({
    subsets:['latin'],
    display:'swap',
})

export const geist = Geist({
    subsets:['latin'],
   
})