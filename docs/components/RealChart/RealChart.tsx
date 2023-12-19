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
  Checkbox,
  Slider,
  Select,
} from "@mantine/core";

import { createChart, getVersion } from "realchart";
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
    display: "flex",
    margin: "0 auto",
    borderBottom: "1px solid",
    borderBottomColor: theme.colors.gray[2],
  },
  menu: {
    gap: "16px",
    padding: "10px",
  },
  button: {
    // marginLeft: 'auto'
  },
}));

const parseOptionsByConfig = (
  config: unknown
): {
  inverted: boolean;
  polar: boolean;
  xReversed: boolean;
  yReversed: boolean;
} => {
  const axisReversed = (axis: any | Array<any> | undefined) => {
    if (axis instanceof Array && axis.length) {
      return axis[0].reversed;
    }
    return !!axis?.reversed;
  };
  return {
    inverted: !!config["inverted"],
    polar: !!config["polar"],
    xReversed: axisReversed(config["xAxis"]),
    yReversed: axisReversed(config["yAxis"]),
  };
};

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
  const { classes } = useStyles();
  const [version, setVersion] = useState("");

  const { inverted, polar, xReversed, yReversed } =
    parseOptionsByConfig(config);
  const [invertedChecked, setInvertedChecked] = useState(inverted);
  const [xReversedChecked, setXReversedChecked] = useState(xReversed);
  const [yReversedChecked, setYReversedChecked] = useState(yReversed);
  const [polarChecked, setPolarChecked] = useState(polar);
  const [intervalId, setIntervalId] = useState();


  useEffect(() => {
  
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]); 
  useEffect(() => {
    if (!chartRef.current) return;
    document.getElementById("realchart").innerHTML = "";
    const chart = createChart(document, chartRef.current, config);
    setChart(chart);
    window["chart"] = chart;
    setVersion(getVersion());

    if (editorRef) {
    }
  }, [chartRef, editorRef]);

  const handleDidMount = (editor, monaco) => {
    // monaco.model.updateOptions({ tabSize: 2})
    console.log({ monaco });
    editorRef.current = editor;
  };

  const handleSave = () => {
    chart.load(code);
  };

  const onChangeEditor = (value, evnet) => {
    setCode(JSON.parse(value));
  };

  const applyChart = (option) => {
    Object.assign(code, option);
    chart.load(code);
  };

  const applyAxisReversed = (axisKey, reversed) => {
    const axis = code[axisKey];
    if (axis) {
      if (axis instanceof Array) {
        axis[0].reversed = reversed;
      } else if (typeof axis == "object") {
        axis.reversed = reversed;
      }
      applyChart(code);
    }
  };

  const onChangeInverted = (event) => {
    const checked = event.currentTarget.checked;
    setInvertedChecked(checked);
    applyChart({ inverted: checked });
  };

  const onChangeXReversed = (event) => {
    const checked = event.currentTarget.checked;
    setXReversedChecked(checked);
    applyAxisReversed("xAxis", checked);
  };
  const onChangeYReversed = (event) => {
    const checked = event.currentTarget.checked;
    setYReversedChecked(checked);
    applyAxisReversed("yAxis", checked);
  };
  const onChangePolar = (event) => {
    const checked = event.currentTarget.checked;
    setPolarChecked(checked);
    applyChart({ polar: checked });
  };

  const _height = code["height"];
  const _width = code["width"];

  const height = _height
    ? typeof _height === "number"
      ? _height + "px"
      : _height
    : "500px";
  const width = _width
    ? typeof _width === "number"
      ? _width + "px"
      : _width
    : "100%";

  const sliders = code["actions"]?.filter(m => m.type == 'slider');
  const inputs = code["actions"]?.filter(m => m.type != 'slider');
  return (
    <Panel
      title={`RealChart ${version}`}
      stackSpacing={0}
      contentPadding="8px"
      headerActions={<></>}
    >
      <Grid>
        <div
          id="realchart"
          ref={chartRef}
          className={classes.wrapper}
          style={{ width, height }}
        />
      </Grid>
      {sliders?.map((action, idx) => {
        const { min, max, step, label, value } = action;
        const onSliderChanged = (value) => {
          action.action && action.action({ value });
        };
        // const marks = [min, max].map((v) => {
        //   return { value: v, label: v.toString() };
        // });
        return (
          <Grid align={"center"} key={idx}>
            <Grid.Col span={2}>
              <Text align={"right"}>{label}: </Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Slider
                min={min}
                max={max}
                step={step}
                defaultValue={value || min}
                color="blue"
                onChangeEnd={onSliderChanged}
              />
            </Grid.Col>
          </Grid>
        );
      })}

      <Grid hidden={!inputs?.length} className={classes.menu}>
      {inputs?.map((action, idx) => {
        const { label, value, data } = action;
        switch (action.type) {
          case 'button':
            return <Button
              compact
              hidden={!showEditor}
              className={classes.button}
              onClick={() => {
                setIntervalId(action.action());
              }}
              variant="outline"
              key={idx}
            >
              {action.label}
            </Button>
          case 'select': 
              return <Select key={idx} label={label} data={data} defaultValue={data[0]}
                size={"xs"}
                onChange={(value) => { action.action({value})}} />
        }
      })}
      </Grid>
      <Grid className={classes.menu}>
        <Checkbox
          label="Inverted"
          checked={invertedChecked}
          onChange={onChangeInverted}
        />
        <Checkbox
          label="X Reversed"
          checked={xReversedChecked}
          onChange={onChangeXReversed}
        />
        <Checkbox
          label="Y Reversed"
          checked={yReversedChecked}
          onChange={onChangeYReversed}
        />
        <Checkbox
          label="Polar"
          checked={polarChecked}
          onChange={onChangePolar}
        />
        <Button
          compact
          hidden={!showEditor}
          className={classes.button}
          onClick={handleSave}
          variant="outline"
        >
          적용
        </Button>
      </Grid>
      {showEditor ? (
        <Grid>
          <Editor
            height="400px"
            language="json"
            // options - https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html
            options={{ autoIndent: true }}
            value={JSON.stringify(config, null, 2)}
            onChange={onChangeEditor}
            onMount={handleDidMount}
          />
        </Grid>
      ) : null}
    </Panel>
  );
}
