// client/src/components/PropertyChart.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CharacterDTO } from '../../shared/types';
import { getPercentageValue } from '../../shared/helpers';

import './PropertyChart.css';

interface PropertyChartProps {
  character: CharacterDTO;
}

interface HistoricalDataPoint {
  timestamp: number;
  sleepiness: number;
  hunger: number;
  thirst: number;
  toilet: number;
  dirtiness: number;
  pain: number;
  discomfort: number;
}

const colors = {
  sleepiness: '#8884d8',
  hunger: '#82ca9d',
  thirst: '#ffc658',
  toilet: '#ff7300',
  dirtiness: '#8dd1e1',
  pain: '#d084d0',
  discomfort: '#ff8042'
};

export const PropertyChart: React.FC<PropertyChartProps> = ({ character }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const maxDataPoints = 20;

  // Update historical data only when properties actually change
  useEffect(() => {
    setHistoricalData(prevData => {
      const lastDataPoint = prevData[prevData.length - 1];
      const propertiesChanged = !lastDataPoint ||
        Object.keys(character.properties).some(key =>
          lastDataPoint[key as keyof CharacterDTO['properties']] !==
          character.properties[key as keyof CharacterDTO['properties']]
        );

      if (propertiesChanged) {
        const newDataPoint: HistoricalDataPoint = {
          timestamp: Date.now(),
          ...character.properties
        };

        const newData = [...prevData, newDataPoint];
        return newData.slice(-maxDataPoints);
      }

      return prevData;
    });
  }, [character.properties]); // Only depend on properties, not the whole character object

  // Memoized chart data to prevent re-creation on every render
  const chartData = useMemo(() => {
    return historicalData.map(dataPoint => ({
      time: new Date(dataPoint.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      sleepiness: getPercentageValue(dataPoint.sleepiness),
      hunger: getPercentageValue(dataPoint.hunger),
      thirst: getPercentageValue(dataPoint.thirst),
      toilet: getPercentageValue(dataPoint.toilet),
      dirtiness: getPercentageValue(dataPoint.dirtiness),
      pain: getPercentageValue(dataPoint.pain),
      discomfort: getPercentageValue(dataPoint.discomfort),
    }));
  }, [historicalData]);

  const tooltipFormatter = useCallback((value: number) => {
    return [`${getPercentageValue(value).toFixed(1)}%`, 'Value'];
  }, []);

  const lineComponents = useMemo(() => (
    <>
      <Line
        type="monotone"
        dataKey="sleepiness"
        stroke={colors.sleepiness}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="hunger"
        stroke={colors.hunger}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="thirst"
        stroke={colors.thirst}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="discomfort"
        stroke={colors.discomfort}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="toilet"
        stroke={colors.toilet}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="dirtiness"
        stroke={colors.dirtiness}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey="pain"
        stroke={colors.pain}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </>
  ), [colors]);

  return (
    <div className="property-chart">
      <h3>Property Trends (Real-time)</h3>
      <div className="chart-info">
        Showing last {historicalData.length} of {maxDataPoints} data points
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          {lineComponents}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};