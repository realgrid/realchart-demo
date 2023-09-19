import { ActionIcon, Anchor, Container, Group, Text } from '@mantine/core';
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { CompanyInfo, FooterDataType, HoverItemInfo } from '@/lib/types';
import { ColorSchemeToggler } from '../ColorSchemeToggler';
import { Logo } from '../Logo';
import { useStyles } from './styles';

interface FooterLinksProps {
  data?: {
    title: string;
    links: { label: string; link: string }[];
  }[];
}

export function MainFooter({
  brand,
  data,
  showBrandName,
  company,
  size = '70rem',
  themeSwitch = true,
}: {
  // 로고 및 브랜드명 표시
  brand: HoverItemInfo;
  // 제품메뉴 표시
  data: FooterDataType;
  // 브랜드명 표시
  showBrandName: boolean;
  company: CompanyInfo;
  size?: string;
  themeSwitch?: boolean;
}) {
  const { classes } = useStyles();
  const router = useRouter();

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Anchor
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
      >
        {link.label}
      </Anchor>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner} size={size}>
        <div className={classes.logo}>
          <Logo
            iconSize={28}
            textSize={22}
            showBrandName={showBrandName}
            brand={brand}
          />
          <Text size="xs" color="dimmed" className={classes.description}>
            {company.address1} {company.address2}
            <Text>
              {company.phone ? `전화: ${company.phone}` : null}
              {company.mail ? `이메일: ${company.mail}` : null}
            </Text>
          </Text>
          <Text size="xs" color="dimmed" className={classes.description}></Text>
          <Text size="xs" color="dimmed" className={classes.description}></Text>
          {themeSwitch ? <ColorSchemeToggler /> : null}
        </div>
        <div className={classes.groups}> {groups}</div>
      </Container>
      <Container className={classes.afterFooter} size={size}>
        <Text color="dimmed" size="sm">
          {company.copyright}
        </Text>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon size="lg">
            <IconBrandTwitter size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            component="a"
            target="new"
            href="https://www.youtube.com/@realreport"
          >
            <IconBrandYoutube size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <IconBrandInstagram size="1.05rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
