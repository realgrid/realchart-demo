import React from "react";
import Image from "next/image";
import { Group, Title } from "@mantine/core";

export const Logo = () => {
  return (
    <div>
      <Group>
        <Image
          alt="리얼차트 로고"
          src="/realchart-logo-fill.svg"
          width={32}
          height={32}
        ></Image>
        <Title size={28}>RealChart</Title>
      </Group>
    </div>
  );
};
