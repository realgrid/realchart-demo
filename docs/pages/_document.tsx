import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';
const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link
            rel=" shortcut icon"
            href="/realchart-logo-fill.svg"
            type="image/x-icon"
            sizes="any"
          />
          <script src="/realchart/realchart-lic.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <Analytics />
        </body>
      </Html>
    );
  }
}
