import { Title, Text, Textarea, Grid, ActionIcon, Stack, Flex, createStyles, rem, Skeleton, Card, Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

import { RealChartReact } from '@/components/RealChart';
import { useEffect, useRef, useState } from 'react';
import { getHotkeyHandler } from '@mantine/hooks';
import { Prism } from '@mantine/prism';
// import { CodeHighlight } from '@mantine/code-highlight'; // support mantime >= 7.0

import { highToReal, objectify, textify } from 'realchart-convert';
import { OpenAI } from '@langchain/openai';

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

    '&:focus-within': {
      // outline: 2px solid var(--mantine-color-blue-filled);
      borderColor: 'inherit'
    },

    '&::placeholder': {
      color: theme.colors.gray[5],
    },
  },
  controls: {
    display: 'flex',
    position: 'sticky',
    bottom: 0,
    alignItems: 'center',
    gap: theme.spacing.xs
  },
  inputWrapper: {
    width: '100%',
    flex: '1',
    margin: '0 !important',
  },
  control: {
    backgroundColor: '#439CE8 !important',
  },
  chatText: {
    boxShadow: theme.shadows.xs,
    borderRadius: theme.radius.md,
    padding: '0.5rem',
    backgroundColor: theme.colors.gray[0],
    fontSize: '1rem',
  },
  chatTextQuery: {
    textAlign: 'right',
    backgroundColor: theme.colors.blue[0]
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
    justifyContent: 'flex-start'
  },
  stack: {
    gap: 0,
    height: '100%',
    overflowY: 'auto',
    justifyContent: 'flex-start',
    paddingBottom: theme.spacing.xl
  },
  chat: {
    padding: theme.spacing.xs,
    paddingTop: 0,
  },
  code: {
    fontSize: '0.9rem',
    lineHeight: '1.375rem'
  },
}));

const style = {
  guide: {
    root: {
      paddingLeft: 0,
      paddingRight: 0
    },
    inner: {
      justifyContent: 'start'
    },
    label: {
      textWrap: 'pretty',
      lineHeight: '1.2rem',
    }
  }
}

interface Chat {
  type: 'query' |'text' | 'chart' | 'js' | 'awaiting' | 'error'
  contents?: string
}

/**
 * create .env.local file and set key, value pair
 * NEXT_PUBLIC_OPENAI_API_KEY=...
 */
if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) console.warn('OPENAI_API_KEY is required.')
const aiOptions = {
  // model: "gpt-3.5-turbo-instruct", // Defaults
  temperature: 0,
  max_tokens: 4096,
  // In Node.js defaults to process.env.OPENAI_API_KEY
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
}
const gpt = new OpenAI(aiOptions);

export const GPTPage = () => {
  const { classes } = useStyles();
  let dummyEnd: HTMLDivElement = null;

  const [awaiting, setAwaiting] = useState(false);
  const [chatList, setChatList] = useState(Array<Chat>);

  const queryRef = useRef<HTMLTextAreaElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const handleGuideClick = (evt) => {
    if (queryRef.current) {
      const query = (evt.target as HTMLSpanElement).textContent;
      queryRef.current.value = query;
      handleSend();
    }
  }

  const handleSend = async() => {
    if (awaiting || !queryRef.current?.value) return;

    const chat: Chat = {
      type: 'query',
      contents: queryRef.current.value
    }
    setChatList([...chatList, chat, { type: 'awaiting' }]);
    setAwaiting(true);
    queryRef.current.value = '';

    const augmented = `다음 질문은 highcharts를 활용한 javascript개발에서 차트를 생성하기 위한 요청이야.
highcharts 함수 호출에 필요한 JSON타입의 options 부분만 대답해.
Q: 기본 차트를 만들어
A: 
{
  chart: {
    type: 'line'
  },
  series: [{
    name: 'Series 1',
    data: [100, 200, 300], 
  }]
}
Q: ${chat.contents}
A:`;
   
    // const res = await gpt.stream(augmented);
    // let contents = 'const config = '
    // for await(const chunk of res) {
    //   contents += chunk;
    // }

    const res = await gpt.invoke(augmented);
    console.log(res)
    let newChats = [];
    try {
      const options = objectify(res);
      const config = highToReal(options);
      newChats.push({
        type: 'js',
        contents: res
      }, 
      {
        type: 'chart',
        contents: `const config = ${encodeURIComponent(textify(config))}`
      })
    } catch(err) {
      newChats.push({
        type: 'error',
        contents: err.message
      })
    }

    setChatList((chatList) => [
      ...chatList.slice(0, -1),
      ...newChats
    ])

    setAwaiting(false);
  };

  const onKeydownQuery = getHotkeyHandler(
    [['Enter', (evt) => {
      if (awaiting || (evt as KeyboardEvent).isComposing) return;
      handleSend();
    }]]
  ) 

  const scrollToBottom = () => {
    if (stackRef.current && dummyEnd) {
      dummyEnd.scrollIntoView({ behavior: 'smooth'})
      // stackRef.current.scrollTop = stackRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [chatList]);

  const guides = [
    '5년간 딸기, 배, 포도 수출량을 바차트로 그려줘',
    '연간 월 평균 온도를 라인차트로 그려줘',
    '3개의 라인 시리즈로 주식을 비교하는 차트를 그려줘'
  ]

  return (
    <div className={classes.wrapper}>
      <Grid className={classes.grid}>
        <Grid.Col span={3}>
          <Title className={classes.title}>RealChart GPT</Title>
          <Text className={classes.description} mt="sm" mb={30}>
            GPT로 리얼차트를 만들어보세요.
          </Text>
          {
            guides.map((guide, i) => {
              return <Card key={`guide-${i}`} shadow="sm" padding="xs" mb="sm" radius="md" withBorder>
                <Button variant="light" color="blue" fullWidth radius="xs" 
                  styles={ style.guide }
                  onClick={handleGuideClick}>{guide}
                </Button>
              </Card>
            })
          }
          
        </Grid.Col>

        <Grid.Col span={9} className={classes.chatWrapper}>
          <Flex direction="column" className={classes.stackWrapper}>
            <Stack ref={stackRef} className={classes.stack}>
              {
                chatList.map(({type, contents}, i) => {
                  let child;
                  switch(type) {
                    case 'chart':
                      child = <RealChartReact containerId={'realchart-' + i} configString={contents} tool={{ height: 450 }} compact={true}></RealChartReact>
                      break;
                    case 'js':
                      // return <Editor key={'chat-' + i} language="javascript" value={contents}></Editor>
                      child = <Prism colorScheme="light" language="javascript" classNames={{ code: classes.code }}>
                          {contents}
                        </Prism>
                      break;
                    case 'awaiting':
                      child = 
                      <>
                        <Skeleton height={8} radius="xl" />
                        <Skeleton height={8} mt={6} radius="xl" />
                        <Skeleton height={8} mt={6} width="70%" radius="xl" />
                      </>
                      break;
                    case 'query':
                      child = <Text size='lg'mt="sm" className={classes.chatText + ' ' + classes.chatTextQuery}>{contents}</Text>
                      break;
                    case 'error':
                      console.error(contents);
                      child = <Text size='lg'mt="sm" className={classes.chatText}>죄송해요, 차트 생성에 문제가 있어요.</Text>
                      break;
                    case 'text':
                    default:
                      child = <Text size='lg'mt="sm" className={classes.chatText}>{contents}</Text>
                  }

                  return <div className={classes.chat} key={'chat-' + i}>{child}</div>
                })
              }
              {/* dummy div */}
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { dummyEnd = el; }}>
              </div>
            </Stack>
            <div className={classes.controls}>
              <Textarea
                ref={queryRef}
                // required
                // label="Your message"
                size='lg'
                placeholder=""
                minRows={1}
                mt="sm"
                classNames={{ input: classes.input, root: classes.inputWrapper }}
                onKeyDown={onKeydownQuery}
              />
              <ActionIcon variant="filled" size="xl" disabled={awaiting} className={classes.control} onClick={handleSend}>
                <IconSend size="2rem"  />
              </ActionIcon>
            </div>
          </Flex>
          
        </Grid.Col>
      </Grid>
    </div>
  );
}