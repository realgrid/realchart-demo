import { Title } from "@mantine/core";
import Head from "next/head";
import { Banner } from "./Banner/Banner";
import { Container, Text } from "@mantine/core";

interface HomePageProps {
  componentsCountByCategory: Record<string, number>;
}
export const HomePage = () => {
  return (
    <>
      {/* <Banner /> */}
      <div id="main">
        <Container size='80rem'>
          {/* <Text size='lg' weight='bolder'>RealChart is Good Chart!</Text> */}
          <Title>RealChart Documentation</Title>
        </Container>
      </div>
    </>
  );
};
