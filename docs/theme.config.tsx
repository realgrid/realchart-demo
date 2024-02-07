import { DocsThemeConfig, Link } from "nextra-theme-docs";
import { Logo } from "./components/Logo";
import { IconHelp } from "@tabler/icons-react";
import { MainFooter } from "@/components/MainFooter";
import { brand, company, footerData } from "@/lib/const";
import { theme } from "./lib/theme";
import { Content, FiddleLink, DefaultValue } from "./components/DocsPage";

const config: DocsThemeConfig = {
  components: {
    FiddleLink,
    Content,
    DefaultValue
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s - RealChart'
    }
  },
  primaryHue: 207,
  sidebar: {
    // defaultMenuCollapseLevel: 10000,
    titleComponent({ title, type,  route }) {
      
      if (route.startsWith('/config/config')) {
        const [opt] = route.split('/').slice(3);
        const [chartType] = route.split('/').slice(-1);
        let prefix = ['xAxis', 'yAxis', 'series', 'gauge', 'annotation', 'asset'].some(v => opt == chartType && opt == v ) ? '[]' : '';
        return <>{chartType}{prefix}</>;
      } else if (route.startsWith('/guide/series/')) {
        const [_, type] = route.split('-');
        return <><img src={`/icons/series/${type}.png`} className="sidebar"/>{title}</>
      } else if (route.startsWith('/guide/gauges/')) {
        const [_, type] = route.split('-');
        return <><img src={`/icons/gauges/${type}.png`} className="sidebar"/> {title}</>
      } else if (route.startsWith('/guide/annotations/')) {
        const [_, type] = route.split('-');
        return <><img src={`/icons/annotations/${type}.png`} className="sidebar"/> {title}</>
      } else if (type == 'separator') {
        return <>{title}</>;
      } else {
        return <>{title}</>;
      }
    }
  },
  logo: <Logo brand={brand} showBrandName iconSize={32} textSize={28} />,
  toc: {
    headingComponent({id, children }) {
      // remove codeblock format
      const esc = children.replace(/{:.*}/g, '');
      return <>{esc}</>;
    }
  },
  banner: {
    key: "1.0.0-release",
    text: (
      <a href="/guide/release/v1.0.0">🎉 RealChart v1.0.0 is released. Read more →</a>
    ),
  },
  editLink: {
    component: () => null
  },
  feedback: {
    content: null
  },
  search: {
    placeholder: "문서 및 데모 검색",
  },
  project: {
    link: "https://github.com/realgrid/realchart-examples",
  },
  chat: {
    link: "https://forum.realgrid.com/tickets/categories/f3SA78vS9G6cKiYht",
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
