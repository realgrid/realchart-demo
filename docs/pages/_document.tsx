import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

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
          {/* <link rel="stylesheet" href="https://unpkg.com/realchart/dist/realchart-style.css" /> */}
          <link rel="stylesheet" href="/realchart/realchart-export.css"/>
          <script src="/realchart/realchart-lic.js"></script>
          <script src="/realchart/realchart-export.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
