import { DocsThemeConfig } from "nextra-theme-docs";
import { Logo } from "./components/Logo";
import { IconHelp } from "@tabler/icons-react";
import { MainFooter } from "@/components/MainFooter";
import { brand, company, footerData } from "@/lib/const";
import { theme } from "./lib/theme";

const config: DocsThemeConfig = {
  primaryHue: 207,
  sidebar: {
    // defaultMenuCollapseLevel: 10000,
    titleComponent({ title: _title, type,  route }) {
      if (route == '/config') return <>{_title}</>;
      if (route.indexOf('/docs') == 0) return <>{_title}</>;

      const [title] = route.split('/').slice(-1);
      let prefix = (title.includes('Axis') || title.includes('series')) ? '[]' : '';
      return <>{title}{prefix}</>;
    }
  },
  logo: <Logo brand={brand} showBrandName iconSize={32} textSize={28} />,
  banner: {
    key: "1.0-release",
    text: (
      <a href="/docs/release/v1.0">🎉 RealChart 1.0 is released. Read more →</a>
    ),
  },
  editLink: {
    component: () => null,
  },
  feedback: {
    content: null,
  },
  search: {
    placeholder: "문서 및 데모 검색",
  },
  project: {
    link: "https://github.com/realgrid/realchart-examples",
  },
  chat: {
    link: "https://forum.realgrid.com/categories/f3SA78vS9G6cKiYht",
    icon: <IconHelp size={28} />,
  },
  footer: {
    component: (
      <MainFooter
        brand={brand}
        showBrandName
        themeSwitch={false}
        data={footerData}
        company={company}
        size={theme.other.contentMaxWidth as string} 
      />
    ),
  },
};

export default config;
