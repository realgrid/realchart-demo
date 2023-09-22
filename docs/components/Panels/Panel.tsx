import {
  Box,
  Grid,
  Group,
  MantineNumberSize,
  MantineSize,
  Stack,
  Title,
  createStyles,
  rem,
} from '@mantine/core';
import { FormEventHandler } from 'react';

const useStyles = createStyles((theme) => ({
  panel: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    backgroundColor: `${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white'
    }`,
    borderRadius: theme.radius.sm,
  },
  panelHeader: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  },
  formBox: {},
}));

export const Panel = ({
  title,
  children,
  span,
  contentPadding = 'lg',
  stackSpacing = 'md',
  onSubmit,
  headerActions,
  noForm = false,
}: {
  /* grid의 span과 같은 기능으로 n/12 만큼 너비를 차지한다. */
  span?: number;
  title?: string;
  contentPadding?: MantineSize;
  stackSpacing?: MantineNumberSize;
  headerActions?: React.ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
  children: React.ReactNode;
  noForm?: boolean;
}) => {
  const { classes } = useStyles();

  return (
    <Grid gutter={0}>
      <Grid.Col span={span}>
        <Box className={classes.panel}>
          <Stack spacing={stackSpacing}>
            {title || headerActions ? (
              <Group className={classes.panelHeader} position="apart">
                {title ? (
                  <Title order={4} size={'h5'}>
                    {title}
                  </Title>
                ) : null}
                {headerActions ? (
                  <Group spacing="xs">{headerActions}</Group>
                ) : null}
              </Group>
            ) : null}
            <Stack p={contentPadding}>
              {noForm ? (
                <Box className={classes.formBox}>
                  <Stack>{children}</Stack>
                </Box>
              ) : (
                <Box
                  className={classes.formBox}
                  component="form"
                  onSubmit={onSubmit}
                >
                  <Stack>{children}</Stack>
                </Box>
              )}
            </Stack>
          </Stack>
        </Box>
      </Grid.Col>
    </Grid>
  );
};
