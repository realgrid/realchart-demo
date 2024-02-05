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
  Flex,
} from "@mantine/core";

import beautify from 'js-beautify';

import { createChart, getVersion } from "realchart";
import { useEffect, useRef, useState } from "react";
import "node_modules/realchart/dist/realchart-style.css";
import Editor from "@monaco-editor/react";
import { Panel } from "../Panels";
import { Codepen } from "../Codepen/Codepen";

/**
 * DOM API 사용 문제
 * - Chart 등 DOM api를 사용하는 모듈의 경우 SSR 등에서 로딩시 DOM 을 찾지 못하는 오류 발생
 * - React.lazy 를 써서 DOM이 렌더링 될때 컴포넌트를 호출 해야 한다.
 * - nextjs에서는 dynamic(..., { ssr: false }) 로 호출 해야 한다.
 * - ts에서는 ComponentType<{}>에 맞춰주기 위해 import(..).then(({Type}) => ({default: Type})) 으로 처리
 */

// type RealChartConfig = unknown;

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
    alignItems: "center",
    // justifyContent: 'end',
    // borderBottom: '1px solid #eee'
  },
  menuDiv: {
    display: "contents",
  },
  button: {
    // marginLeft: 'auto'
  },
  label: {
    fontSize: "0.875rem"
  }
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

/**
 * const config = {} 로 지정된 config object를 반환한다.
 */
const evalCode = (text: string) => {
  try {
    const found = text.indexOf('=');
    const conf = text.slice(found + 1).trim();
    return window['config'] = eval(`(() => {return ${conf};})()`);;
  } catch(err) {
    console.error(err);
    return null;
  }
}

export function RealChartReact({
  // config,
  configString,
  tool,
  showEditor,
  autoUpdate,
}: {
  // config: RealChartConfig;
  configString: string;
  tool: unknown;
  showEditor: boolean;
  autoUpdate: boolean;
}) {
  configString = beautify(decodeURI(configString));
  const config = evalCode(configString);
  const chartRef = useRef(null);
  const editorRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [code, setCode] = useState(config);
  const { classes } = useStyles();
  const [version, setVersion] = useState("");
  tool = tool ?? {};

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

  }, [chartRef]);

  const handleSave = () => {
    chart.load(code);
  };

  const handleDidMount = (editor, monaco) => {
    // ctrl(cmd) + s 로 적용
    editor.addAction({
      id: 'apply',
      label: 'Apply',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      ],
      run: ((ed) => {
        // @TODO: 코드 개선
        // handleSave에서 chart, code 변수를 사용할 수 없다.. 
        window['chart']?.load(evalCode(ed.getValue()));
      })
    });

    editorRef.current = editor;
  };

  const onChangeEditor = (value, event) => {
    // 'const config =' 에서 뒷 문자열만 사용한다.
    setCode(evalCode(value));
    // setCode(value);
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

  const _height = tool["height"];
  const _width = tool["width"];

  const height = _height
    ? typeof _height === "number"
      ? _height + "px"
      : _height
    : "500px";
  const width = _width
    ? typeof _width === "number"
      ? _width + "px"
      : _width
    : "800px";

  const hasPieOrGauge =
    config["type"] == "pie" ||
    config["series"]?.type == "pie" ||
    (config["series"] &&
      config["series"] instanceof Array &&
      config["series"]?.some((m) => m.type == "pie")) ||
    config["gauge"];

  const isSplit = config["split"]?.visible || config["split"] === true;

  const sliders = tool["actions"]?.filter((m) => m.type == "slider");
  const inputs = tool["actions"]?.filter((m) => m.type != "slider");
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
          action.action && action.action({ tool, config, value });
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

      <Grid
        hidden={!inputs?.length}
        className={classes.menu}
        style={hasPieOrGauge ? {} : { paddingBottom: 0 }}
      >
        {inputs?.map((action, idx) => {
          const { label, value, data } = action;
          switch (action.type) {
            case "check":
              return (
                <Checkbox
                  key={idx}
                  label={label}
                  defaultChecked={value}
                  onChange={(event) => {
                    action.action({ tool, config, value: event.currentTarget.checked });
                  }}
                />
              );
            case "button":
              return (
                <Button
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
              );
            case "select":
              return (
                <Flex
                  key={idx}
                  align={"center"}
                  wrap={"wrap"}
                  direction={"row"}
                  gap={"md"}>
                  <label className={classes.label}>{label}</label>
                  <Select
                    data={data}
                    defaultValue={value || data[0]}
                    size={"xs"}
                    onChange={(value) => {
                      action.action({ tool, config, value });
                    }}
                  />
                </Flex>
              );
          }
        })}
      </Grid>
      <Grid className={classes.menu}>
        <div className={classes.menuDiv} hidden={hasPieOrGauge}>
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
          {
            inputs?.some(i => i.type == 'config.polar') &&
              <Checkbox
                style={isSplit ? { display: "none" } : {}}
                label="Polar"
                checked={polarChecked}
                onChange={onChangePolar}
              />
          }
        </div>

        <Button
          compact
          hidden={!showEditor}
          className={classes.button}
          onClick={handleSave}
          variant="outline"
        >
          적용
        </Button>
        <Codepen configString={configString} />
      </Grid>
      {showEditor ? (
        <Grid>
          <Editor
            height="400px"
            language="javascript"
            // options - https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html
            options={{ autoIndent: true }}
            value={configString}
            onChange={onChangeEditor}
            onMount={handleDidMount}
          />
        </Grid>
      ) : null}
    </Panel>
  );
}
