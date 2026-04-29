"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopSkillsChartProps {
  data: Array<{ skill: string; count: number }>;
}

export function TopSkillsChart({ data }: TopSkillsChartProps) {
  // Capitalize first letter of each skill
  const formattedData = data.map((item) => ({
    ...item,
    skill: item.skill.charAt(0).toUpperCase() + item.skill.slice(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Skills Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis
              type="category"
              dataKey="skill"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
