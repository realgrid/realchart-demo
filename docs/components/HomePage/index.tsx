import { Title } from "@mantine/core";
// import Head from "next/head";
import { Container, Text } from "@mantine/core";
import { theme } from "@/lib/theme";
import { HeroBullets } from "./Hero";

interface HomePageProps {
  componentsCountByCategory: Record<string, number>;
}
export const HomePage = () => {
  return (
    <>
      <HeroBullets />
      <div id="main">
        <Container size={theme.other.contentMaxWidth}>
          {/* <Text size='lg' weight='bolder'>RealChart is Good Chart!</Text> */}
          {/* <Title>RealChart Documentation</Title> */}
        </Container>
      </div>
    </>
  );
};
