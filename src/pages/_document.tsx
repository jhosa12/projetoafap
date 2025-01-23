
import { source_Sans_3 } from '@/fonts/fonts'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR" >

      <Head  id="site-header">  
      <meta name="robots" content="noindex, nofollow" /> {/*nao mostrar o botão de indexar, para os mecanismos de busca dos navegadores*/}
     {/* <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"/>
          <link rel="icon" type="image/png" href="/logo40x24.png" sizes="45x25" />*/}
         
      </Head>
      <body className={source_Sans_3.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
