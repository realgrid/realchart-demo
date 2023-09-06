import { DocsThemeConfig } from "nextra-theme-docs";
import { Logo } from "./components/Logo";

const config: DocsThemeConfig = {
  logo: (
    <Logo />
  ),
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  project: {
    link: 'https://github.com/realgrid/realchart-examples',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  // docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: "우리테크 RealChart",
  },
};

export default config;
