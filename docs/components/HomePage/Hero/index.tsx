import {
  Image,
  Container,
  Title,
  Group,
  Stack,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  hero: {
    padding: '0 2rem'
  },
  main: {
    margin: '0 auto'
  }
}));

export function HeroBullets() {
  const { classes } = useStyles();
  return (
    <Container my="10rem" size="lg">
      <Group align="top">
        <Image className={classes.hero} width="32rem" src={"/images/hero-image.png"} />
        <Stack>
          <Title fw={700} size={60}>
            RealChart
          </Title>
          <Title>Real chart component library</Title>
          <Title>성공을 위한 업무 데이터 시각화 파트너</Title>
        </Stack>
        <Image className={classes.main} width="40rem" src={"/images/main-01.png"} />
        <Image className={classes.main} width="40rem" src={"/images/main-02.png"} />
        <Image className={classes.main} width="40rem" src={"/images/main-03.png"} />
      </Group>
    </Container>
  );
}
