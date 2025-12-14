'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PracticeResult } from '@/lib/api';

interface ProgressChartProps {
  sessions: PracticeResult[];
}

interface ChartDataPoint {
  index: number;
  score: number;
  time: string;
  fullDate: string;
}

const formatTime = (isoString: string): string => {
  const timeValue = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
  const date = new Date(timeValue);
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok'
  });
};

const formatFullDate = (isoString: string): string => {
  const timeValue = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
  const date = new Date(timeValue);
  return date.toLocaleString('th-TH', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok'
  });
};

export default function ProgressChart({ sessions }: ProgressChartProps) {
  const chartData: ChartDataPoint[] = sessions.map((session, index) => ({
    index: index + 1,
    score: session.score,
    time: formatTime(session.practiced_at),
    fullDate: formatFullDate(session.practiced_at)
  }));

  const averageScore = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>
            Session #{data.index}
          </p>
          <p style={{ margin: '4px 0', color: '#666' }}>
            {data.fullDate}
          </p>
          <p style={{ margin: '4px 0', color: '#4F46E5', fontWeight: 'bold' }}>
            Score: {data.score.toFixed(1)}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            domain={[0, 10]}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Score',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '14px', fill: '#6B7280' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: '#4F46E5', r: 4 }}
            activeDot={{ r: 6 }}
            name="Your Score"
          />
          <Line
            type="monotone"
            dataKey={() => averageScore}
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name={`Average (${averageScore.toFixed(1)})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}