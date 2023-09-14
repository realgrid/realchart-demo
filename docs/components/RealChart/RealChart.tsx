import {
  Title,
  Overlay,
  Group,
  Grid,
  Text,
  Paper,
  Button,
  Divider,
  ThemeIcon,
  SimpleGrid,
  Container,
  Box,
  useMantineTheme,
  createStyles,
  rem,
} from "@mantine/core";

import { ChartControl, Chart, getVersion } from "realchart";
import { useEffect, useRef, useState } from "react";
import "node_modules/realchart/dist/realchart-style.css";
import Editor from "@monaco-editor/react";
import { Panel } from "../Panels";

/**
 * DOM API 사용 문제
 * - Chart 등 DOM api를 사용하는 모듈의 경우 SSR 등에서 로딩시 DOM 을 찾지 못하는 오류 발생
 * - React.lazy 를 써서 DOM이 렌더링 될때 컴포넌트를 호출 해야 한다.
 * - nextjs에서는 dynamic(..., { ssr: false }) 로 호출 해야 한다.
 * - ts에서는 ComponentType<{}>에 맞춰주기 위해 import(..).then(({Type}) => ({default: Type})) 으로 처리
 */

type RealChartConfig = unknown;

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '2px solid',
    borderTopColor: theme.colors.gray[2],
  },
}));

export function RealChartReact({
  config,
  showEditor,
  autoUpdate,
}: {
  config: RealChartConfig;
  showEditor: boolean;
  autoUpdate: boolean;
}) {
  const chartRef = useRef(null);
  const editorRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [code, setCode] = useState(config);
  const {classes} = useStyles();
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (!chartRef.current) return;
    document.getElementById("realchart").innerHTML = "";
    const chart = new ChartControl(document, chartRef.current);
    chart.model = new Chart(config);
    setChart(chart);
    setVersion(getVersion());

    if (editorRef) {
    }
  }, [chartRef, editorRef]);

  const handleDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    console.log(chart, code, getVersion());
    chart.model = new Chart(code);
  };

  const onChangeEditor = (value, evnet) => {
    setCode(JSON.parse(value));
  };

  return (
    <Panel
      title={`RealChart ${version}`}
      stackSpacing={0}
      contentPadding="8px"
      headerActions={
        <>
          <Button compact onClick={handleSave} variant="outline">
            적용
          </Button>
        </>
      }
    >
      <Grid>
        {showEditor ? (
          <Editor
            height="300px"
            language="json"
            // theme="vs-gray"
            value={JSON.stringify(config, null, 1)}
            onChange={onChangeEditor}
            onMount={handleDidMount}
          />
        ) : null}
        <div
          id="realchart"
          ref={chartRef}
          className={classes.wrapper}
          style={{ width: "100%", height: "500px" }}
        />
      </Grid>
    </Panel>
  );
}
