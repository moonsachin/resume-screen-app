"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobsByStatusProps {
  data: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "#10b981",
  CLOSED: "#ef4444",
  DRAFT: "#6b7280",
};

export function JobsByStatus({ data }: JobsByStatusProps) {
  const formattedData = data.map((item) => ({
    name: item.status,
    value: item.count,
    fill: STATUS_COLORS[item.status] || "#6b7280",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
