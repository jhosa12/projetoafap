import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>  
          <link rel="icon" type="image/png" href="/logo40x24.png" sizes="45x25" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
