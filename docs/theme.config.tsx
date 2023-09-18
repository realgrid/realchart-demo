import { DocsThemeConfig } from "nextra-theme-docs";
import { Logo } from "./components/Logo";
import { IconHelp } from "@tabler/icons-react";

const config: DocsThemeConfig = {
  sidebar: {
    defaultMenuCollapseLevel: 10000,
  },
  logo: (
    <Logo />
  ),
  banner: {
    key: '1.0-release',
    text: (
      <a href="/docs/release/v1.0">
        🎉 RealChart 1.0 is released. Read more →
      </a>
    )
  },
  editLink: {
    component: () => null,
  },
  feedback: {
    content: null,
  },
  search: {
    placeholder: '문서 및 데모 검색'
  },
  project: {
    link: 'https://github.com/realgrid/realchart-examples',
  },
  chat: {
    link: 'https://forum.realgrid.com/categories/f3SA78vS9G6cKiYht',
    icon: <IconHelp size={28}/>
  },
  // docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: "우리테크 RealChart",
  },
};

export default config;
