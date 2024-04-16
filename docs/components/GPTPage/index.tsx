import { Title, Text, TextInput, Textarea, Button, Group, Grid, createStyles, useMantineTheme, rem, ActionIcon, Stack, Flex } from '@mantine/core';
import { IconSend } from '@tabler/icons-react'

const useStyles = createStyles((theme) => ({
  wrapper: {
    // display: 'flex',
    // flexDirection: 'column',
    height: 'calc(100vh - var(--nextra-navbar-height))',
    width: '100%',
    maxWidth: '1400px',
    boxSizing: 'border-box',
    // backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][0]} 0%, ${
    //   theme.colors[theme.primaryColor][1]
    // } 100%)`,
    backgroundColor: '#439CE8',
    borderRadius: theme.radius.md,
    margin: '0 auto',
    padding: `calc(${theme.spacing.xl} * 1.5)`,
    paddingBottom: 0,
    // padding: theme.spacing.xl,

    [theme.fn.smallerThan('sm')]: {
      padding: theme.spacing.xl,
    },
  },

  grid: {
    height: '100%',
    margin: '-1rem'
  },

  title: {
    fontFamily: `${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: rem(300),

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
    },
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    '&::placeholder': {
      color: theme.colors.gray[5],
    },

    // borderTopRightRadius: 0,
    // borderBottomRightRadius: 0,
    // borderRight: 0,
  },

  controls: {
    display: 'flex',
    position: 'sticky',
    bottom: 0,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },

  inputWrapper: {
    width: '100%',
    flex: '1',
    margin: '0 !important',
  },

  control: {
    backgroundColor: '#439CE8 !important',
  },

  chatWrapper: {
    paddingTop: theme.spacing.md,
    backgroundColor: theme.white,
    // padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
    height: '100%'
  },

  stackWrapper: {
    // width: '100%',
    height: '100%',
  },

  stack: {
    gap: 0,
    // height: '100%',
    overflowY: 'auto',
    justifyContent: 'flex-start',
    paddingBottom: theme.spacing.xl
  },

}));

export const GPTPage = () => {
  const { classes } = useStyles();

  const list = Array(30).fill(`Sure! Here is an example configuration for a donut chart showing the world's top 5 car manufacturers in dark mode:`);
  return (
    <div className={classes.wrapper}>
      <Grid className={classes.grid}>
        <Grid.Col span={3}>
          <Title className={classes.title}>RealChart GPT</Title>
          <Text className={classes.description} mt="sm" mb={30}>
            GPT로 리얼차트를 만들어보세요.
          </Text>
        </Grid.Col>

        <Grid.Col span={9} className={classes.chatWrapper}>
          <Flex direction="column" justify="flex-end" className={classes.stackWrapper}>
            <Stack className={classes.stack}>
              <Text
                size='lg'
                mt="sm"
              >
              Sure! Here is an example configuration for a donut chart showing the world's top 5 car manufacturers in dark mode:
              </Text>
              <div style={{height: '40px', backgroundColor: 'yellow'}}>
              </div>
              {
                list.map((text) => {
                  return <Text
                    size='lg'
                    mt="sm"
                  >{text}</Text>
                })
              }
            </Stack>
            <div className={classes.controls}>
              <Textarea
                // required
                // label="Your message"
                size='lg'
                placeholder="바차트를 만들어"
                minRows={1}
                mt="sm"
                classNames={{ input: classes.input, root: classes.inputWrapper }}
              />
              <ActionIcon variant="filled" size="xl" className={classes.control}>
                <IconSend size="2rem"  />
              </ActionIcon>
            </div>
          </Flex>
          
        </Grid.Col>
      </Grid>
    </div>
  );
}