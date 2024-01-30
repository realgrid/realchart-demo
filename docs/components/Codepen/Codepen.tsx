import { Button, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";

export const Codepen = ({ configString }) => {
  const createForm = (configString) => {

    let data = {
      title: "Cool Pen",
      description: "",
      html: '<script>var realChartLic = \'upVcPE+wPOkOR/egW8JuxkM/nBOseBrflwxYpzGZyYmhB+vWdw2W7OeKriArSGg/tcphfKS2Musnm9T+R9R8ZnQHkEFeJWIE\';</script><script src="https://unpkg.com/realchart"></script>\n<div id="realchart"></div>',
      html_pre_processor: "none",
      css: '@import url("https://unpkg.com/realchart/dist/realchart-style.css");\n#realchart {\n    width: 800px;\n    height: 500px;\n    border: 1px solid lightgray;\n    margin: 20px auto;\n}',
      css_pre_processor: "none",
      css_starter: "neither",
      css_prefix_free: false,
      js:
        "var realChartLic = 'upVcPE+wPOkOR/egW8JuxkM/nBOseBrflwxYpzGZyYmhB+vWdw2W7OeKriArSGg/tcphfKS2Musnm9T+R9R8ZnQHkEFeJWIE';\n" +
        `${configString}` +
        ';\nchart = RealChart.createChart(document, "realchart", config);',
      js_pre_processor: "none",
      js_modernizr: false,
      js_library: "",
      html_classes: "",
      css_external: "",
      js_external: "",
      template: true,
    };

    const JSONstring = JSON.stringify(data)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    let form = document.createElement("form");
    form.setAttribute("action", "https://codepen.io/pen/define");
    form.setAttribute("method", "POST");
    form.setAttribute("target", "_blank");
    form.setAttribute("id", "codepenForm");

    let inputData = document.createElement("input");
    inputData.setAttribute("type", "hidden");
    inputData.setAttribute("name", "data");
    inputData.setAttribute("value", JSONstring);
    form.appendChild(inputData);

    let inputSubmit = document.createElement("input");
    inputSubmit.setAttribute("type", "submit");
    inputSubmit.setAttribute("value", "Code Pen");
    form.appendChild(inputSubmit);

    document.body.appendChild(form);

    return form;
  }
  // useEffect(() => {
  //   createForm(config);
  // }, [config]);

  const handleSubmit = () => {
    // let form = document.getElementById("codepenForm") as HTMLFormElement | null;
    let form = createForm(configString);
    form.submit();
    const parent = form.parentNode;
    parent.removeChild(form);
  };

  return (
    <div>
      <Button compact variant="outline" onClick={handleSubmit}>
        CodePen
      </Button>
      {/* 
        아래 코드 사용시 form 중첩 에러가 발생.
      <form
        hidden={true}
        action="https://codepen.io/pen/define"
        method="POST"
        target="_blank"
        id="codepenForm"
      >
        <input type="hidden" name="data" value={JSONstring} />
        <input type="submit" value="Code Pen" />
      </form> */}
    </div>
  );
};
