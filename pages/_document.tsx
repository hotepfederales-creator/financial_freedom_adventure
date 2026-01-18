import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;700&family=VT323&display=swap" rel="stylesheet" />
        {/* Using CDN for simple portability as per original setup */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <body className="bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}