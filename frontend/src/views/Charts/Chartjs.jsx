import React, { Component } from 'react';
import classes from "./Chartjs.module.css";
import { managerData, nationalAverageData, yearLabels, managerQuarterData, nationalAverageQuarterData, quarterLabels } from "../../mockData";
import MyLineChart from "../../components/MyLineChart";

export default class Chartjs extends Component {
    state = {
        data: managerData,
        average: nationalAverageData,
        labels: yearLabels
    }

    handleButtonClick = e => {
        const { value } = e.target;
        const isAnnual = value === "annual";

        const newData = isAnnual ? managerData : managerQuarterData;
        const newLabels = isAnnual ? yearLabels : quarterLabels;
        const newAverage = isAnnual ? nationalAverageData : nationalAverageQuarterData;

        this.setState({
            data: newData,
            average: newAverage,
            labels: newLabels
        })
    }

    render() {
        const { data, labels, average } = this.state;
        return (
            <div className={classes.container}>
                <header>
                    <h1>Sales Dashboard</h1>
                </header>

                <div className={classes.buttonContainer}>
                    <button
                        value="annual"
                        onClick={this.handleButtonClick}
                    >
                        Annual
                    </button>

                    <button
                        value="lastquarter"
                        onClick={this.handleButtonClick}
                    >
                        Last Quarter
                    </button>
                </div>

                <MyLineChart
                    data={data}
                    labels={labels}
                    average={average} />
            </div>
        )
    }
}