import {
  Title,
  Overlay,
  Group,
  Text,
  Button,
  ThemeIcon,
  SimpleGrid,
  Container,
  useMantineTheme,
  rem,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import useStyles from "./Banner.styles";

export const Banner = () => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  return (
    <div className={classes.wrapper}>
      <Container size="xl" px="md">
        <div className={classes.image} />
        <Overlay
          gradient={`linear-gradient(45deg, ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[2]
          } 25%, rgba(0, 0, 0, 0) 95%)`}
          opacity={0.5}
          zIndex={1}
        />
      </Container>
    </div>
  );
};
