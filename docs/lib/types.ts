import { HTMLAttributeAnchorTarget, MouseEventHandler } from 'react';

export interface HoverItemInfo {
  // full name
  name: string;
  // name의 가능 폰트 부분
  nameLight?: string;
  // name의 굵은 폰트 부분
  nameBold?: string;
  // 짧은 설명, 이미지 alt
  shortDesc?: string;
  // 긴설명
  longDesc?: string;
  // 아이콘 파일
  iconFile?: string;
  // 클릭 링크
  link?: string;
}

export type MenuInfo = {
  title: string;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  hoverItems?: HoverItemInfo[];
};

export type FooterDataType = {
  title: string;
  links: {
    label: string;
    link: string;
  }[];
}[];

export interface CompanyInfo {
  address1: string;
  address2?: string;
  phone?: string;
  mail?: string;
  copyright?: string;
}

export enum CSTType {
  'default',
}

export type ActionButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};
