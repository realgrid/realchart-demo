import {
  Image,
  Container,
  Title,
  Group,
  Stack,
} from "@mantine/core";

export function HeroBullets() {
  return (
    <Container my="10rem" size="lg">
      <Group align="top">
        <Stack>
          <Title fw={700} size={60}>
            RealChart
          </Title>
          <Title>Real chart component library</Title>
        </Stack>
        <Image width="35rem" src={"/images/hero-image.svg"} />
      </Group>
    </Container>
  );
}
