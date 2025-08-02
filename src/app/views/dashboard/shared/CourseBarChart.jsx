import React from "react";
import ReactECharts from "echarts-for-react";

const CourseBarChart = () => {
  const option = {
    title: {
      text: "Course A, Course B, Course C"
    },
    tooltip: {},
    legend: {
      data: ["Course A", "Course B", "Course C"]
    },
    xAxis: {
      data: ["Level 1", "Level 2", "Level 3", "Level 4"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "Course A",
        type: "bar",
        data: [5500, 6300, 3700, 4600],
        itemStyle: { color: "#5470C6" }
      },
      {
        name: "Course B",
        type: "bar",
        data: [3600, 4400, 4300, 4500],
        itemStyle: { color: "#91CC75" }
      },
      {
        name: "Course C",
        type: "bar",
        data: [4800, 5200, 4000, 3900],
        itemStyle: { color: "#EE6666" }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default CourseBarChart;
