import React, { useRef, useLayoutEffect, ReactNode } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import IComponentProps from "../interfaces/IComponentProps";
import { IObjectData } from "../interfaces/IMWData";

declare var manywho: any;

am4core.useTheme(am4themes_animated);

interface IChartProps extends IComponentProps{};

export const EnspirePieChart: ReactNode = (props: IChartProps) => {

  const chart = useRef(null);
  const model = manywho.model.getComponent(props.id, props.flowKey);

  console.log("model", model);
  console.log("props", props);

  useLayoutEffect(() => {

    am4core.addLicense("CH80285461");

    let pieChart = am4core.create("chartdiv", am4charts.PieChart) as any; // as any required because Amcharts doesn't yet support TS strict mode

    // x.paddingRight = 20;

    // get chart data from model

    if ( model.objectData === null || model.objectData === undefined) return;
    
    let data: IPieChartData[] = [];

    model.objectData.map((od: IObjectData) => {
        let name = manywho.utils.getObjectDataProperty(od.properties, model.columns[0].developerName).contentValue;
        name = name.substr(0, 1).toUpperCase() + name.substr(1);
        data.push({
            "name": name,
            "value": manywho.utils.getObjectDataProperty(od.properties, model.columns[1].developerName).contentValue
        });
    });

    pieChart.data = data;

    // Add and configure Series
    var pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.value = "value";
    // layout
    pieSeries.labels.template.wrap = true;
    // pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{category} {value.percent.formatNumber('#.0')}%";
    // set in Flow config
    if (model.attributes.innerRadius) pieChart.innerRadius = am4core.percent(model.attributes.innerRadius);
    if (model.attributes.labelsTemplateMaxWidth) pieSeries.labels.template.maxWidth = model.attributes.labelsTemplateMaxWidth;
    if (model.attributes.labelsTemplateFontsize) pieSeries.labels.template.fontSize = model.attributes.labelsTemplateFontsize;

    // set the chart instance
    chart.current = pieChart;

    return () => {
        pieChart.dispose();
    };

  }, [model]);

  const style = {
      width: model.width > 0 ? model.width : "",
      height: model.height > 0 ? model.height : ""
  };

  return ( <div>
                <h4 className="text-center">{model.label}</h4>
                <div id="chartdiv" style={style}>
                </div>
            </div>
  );

};

manywho.component.register("EnspirePieChart", EnspirePieChart);

export default EnspirePieChart;
