'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { year: '2年', Google: 400, Tesla: 300, Nvidia: 200 },
  { year: '4年', Google: 700, Tesla: 500, Nvidia: 350 },
  { year: '6年', Google: 1100, Tesla: 700, Nvidia: 500 },
  { year: '8年', Google: 1600, Tesla: 900, Nvidia: 650 },
  { year: '10年', Google: 2300, Tesla: 1200, Nvidia: 800 },
];

const COLORS = {
  Google: '#16A34A', // success green
  Tesla: '#5965FF', // primary indigo
  Nvidia: '#94A3B8', // gray-400
};

export default function SimulationChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="#ECF9F3" strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tick={{ fill: '#334155', fontSize: 14, fontFamily: 'Inter, sans-serif' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#334155', fontSize: 14, fontFamily: 'Menlo, monospace' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v.toLocaleString()} 万円`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            background: '#fff',
            border: '1px solid #ECF9F3',
          }}
          labelStyle={{ color: '#334155', fontWeight: 600 }}
          formatter={(value: number, name: string) => [`${value.toLocaleString()} 万円`, name]}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ paddingBottom: 8, fontSize: 13, fontFamily: 'Inter, sans-serif' }}
        />
        <Line
          type="monotone"
          dataKey="Google"
          stroke={COLORS.Google}
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Tesla"
          stroke={COLORS.Tesla}
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Nvidia"
          stroke={COLORS.Nvidia}
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
