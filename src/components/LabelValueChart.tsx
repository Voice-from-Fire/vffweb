/* eslint-disable prettier/prettier */
import { Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LabelCount } from "../screens/RecordingDetailScreen";

interface LabelValueChartProps {
  counts: LabelCount[];
  title: string;
  labels: { [value: number]: string };
  getColor: (value: number) => string;
}

const LabelValueChart = ({
  counts,
  title,
  labels,
  getColor,
}: LabelValueChartProps) => {
  const renderCustomAxisTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: number };
  }) => {
    const label = labels[payload.value].split(" ");
    return (
      <g transform={`translate(${x},${y})`}>
        {label.map((label, index) => (
          <text
            x={0}
            y={0}
            dy={index * 18}
            textAnchor="end"
            fill="#666"
            transform="rotate(-35)"
          >
            {label}
          </text>
        ))}
      </g>
    );
  };

  interface TooltipProps {
    active?: boolean;
    payload?: { payload?: LabelCount }[];
  }

  const renderTooltip = ({ active, payload }: TooltipProps) => {
    const labelCount: LabelCount | undefined = payload?.[0]?.payload;
    if (active && labelCount) {
      return (
        <div style={{ background: "white", padding: "5px" }}>
          {`${labels[labelCount.value]} : ${labelCount.count}x`}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <BarChart
        width={500}
        height={300}
        data={counts}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="value"
          tickFormatter={(tickItem) => labels[tickItem]}
          interval={0}
          height={60}
          tick={renderCustomAxisTick}
        />
        <YAxis
          interval={0}
          tickCount={
            Math.max(...counts.map((item: LabelCount) => item.count)) + 1
          }
          domain={[0, "dataMax + 1"]}
        />
        <Tooltip content={renderTooltip} />
        <Bar dataKey="count" barSize={10}>
          {counts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
          ))}
          <LabelList dataKey="count" position="top" />
        </Bar>
      </BarChart>
    </>
  );
};

export default LabelValueChart;
