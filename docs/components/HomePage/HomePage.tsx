import Head from 'next/head';
import { Banner } from './Banner/Banner';
import { Container, Text } from '@mantine/core';

interface HomePageProps {
  componentsCountByCategory: Record<string, number>;
}
export const HomePage = () => {
  return (
    <>
      <Banner />
      <div id="main">
        <Container size={'xl'}>
          <Text size='lg' weight='bolder'>RealChart is Good Chart!</Text>
        </Container>
      </div>
    </>
  )
}