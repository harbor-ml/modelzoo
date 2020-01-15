import { ModelObject } from "../Utils/ProtoUtil";
import { FC, useState } from "react";
import React from "react";
import { Checkbox, Empty, Tag } from 'antd';
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
            {id}:
            <Tag>{run.model.metadata.framework}</Tag>
            <Tag>{run.model.name}</Tag>
            <Tag>{run.input_type}</Tag>
            <Tag>{run.output_type}</Tag>
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
        value.model.metadata.framework + " " + value.model.name,
        Number.parseFloat(value.queryMetadata["model_runtime_s"]) * 1000,
        null,
        null])

    return <Chart
        width={'1000px'}
        height={'400px'}
        chartType="BarChart"
        loader={<div>Loading Chart</div>}
        data={[
            [
                'Element',
                'Latency (ms)',
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
            hAxis: {
                title: "Latency(ms)",
                viewWindow: { min: 0, max: 25 }
            },
            yAxis: {
                title: "Query"
            }
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
        <h1>Compare (earliest on top)</h1>
        {allRuns.map((value, id, __) => runToCheckBox(value, id, pushSelectedIndex, popSelectedIndex))}

        {createPlot(selectedIndex.map((value, _, __) => allRuns[value]))}
    </div>
}