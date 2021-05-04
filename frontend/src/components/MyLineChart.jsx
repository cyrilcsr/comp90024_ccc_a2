import React, { Component } from 'react'
import classes from "./myLineChart.module.css";

var Chart = require('chart.js/dist/chart');
let lineGraph;


export default class MyLineChart extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data, average, labels } = this.props;

        if (typeof lineGraph !== "undefined") lineGraph.destroy();

        lineGraph = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: labels,
                datasets: [
                    {
                        label: "Sales",
                        data: data,
                        fill: false,
                        borderColor: "#6610f2"
                    },
                    {
                        label: "National Average",
                        data: average,
                        fill: false,
                        borderColor: "#E0E0E0"
                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
    }
    
    render() {
        return (
        <div className={classes.graphContainer}>
            <canvas
                id="myChart"
                ref={this.chartRef}
            />
        </div>
        )
    }
}
