import { ModelObject } from "../Utils/ProtoUtil";
import { FC, useState } from "react";
import React from "react";
import { Checkbox, Empty } from 'antd';
import { Chart } from "react-google-charts";



export interface InferenceRun {
    model: ModelObject;
    input_type: string;
    output_type: string;
    queryMetadata: Record<string, string>;
}

function runToCheckBox(run: InferenceRun, id: number, pushChangedID: (id: number) => void, popChangedID: (id: number) => void): JSX.Element {
    return <div key={id}>
        <Checkbox onChange={(e) => {
            if (e.target.checked) {
                pushChangedID(id)
            } else {
                popChangedID(id)
            }
        }}>
            {run.model.name}, {run.input_type}, {run.output_type}, {JSON.stringify(run.queryMetadata)},
        </Checkbox> <br></br>
    </div>
}

export interface CompareProps {
    allRuns: InferenceRun[];
}

function createPlot(runs: InferenceRun[]): JSX.Element {
    if (runs.length === 0) {
        return <Empty description={"Please select an inference query."}></Empty>
    }

    const dataItems = runs.map((value, _, __) => [
        value.model.name,
        Number.parseFloat(value.queryMetadata["model_runtime_s"]),
        null,
        null])

    return <Chart
        width={'500px'}
        height={'300px'}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
            [
                'Element',
                'Latency (s)',
                { role: 'style' },
                {
                    sourceColumn: 0,
                    role: 'annotation',
                    type: 'string',
                    calc: 'stringify',
                },
            ],
            ...dataItems
            // ['Copper', 8.94, '#b87333', null],
            // ['Silver', 10.49, 'silver', null],
            // ['Gold', 19.3, 'gold', null],
            // ['Platinum', 21.45, 'color: #e5e4e2', null],
        ]}
        options={{
            title: 'Comparison',
            width: 600,
            height: 400,
            bar: { groupWidth: '95%' },
            legend: { position: 'none' },
        }}
    />
}

export const CompareRuntime: FC<CompareProps> = props => {
    const { allRuns } = props;
    const [selectedIndex, setSelectedIndex] = useState<number[]>([])

    if (allRuns.length === 0) {
        return <Empty description={"No data available"}></Empty>
    }

    const pushSelectedIndex = (i: number) => {
        setSelectedIndex((arr) => [...arr, i])
    }
    const popSelectedIndex = (i: number) => {
        setSelectedIndex((arr) => arr.slice().filter((val) => (i !== val)))
    }

    return <div>
        {allRuns.map((value, id, __) => runToCheckBox(value, id, pushSelectedIndex, popSelectedIndex))}

        {createPlot(selectedIndex.map((value, _, __) => allRuns[value]))}
    </div>
}