import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head id="site-header">  
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"/>
          <link rel="icon" type="image/png" href="/logo40x24.png" sizes="45x25" />
         
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
