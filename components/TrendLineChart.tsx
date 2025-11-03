
import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendLineChartProps {
    transactions: Transaction[];
}

const TrendLineChart: React.FC<TrendLineChartProps> = ({ transactions }) => {
    const data = useMemo(() => {
        const monthlyData: { [key: string]: { income: number; expense: number } } = {};

        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 };
            }
            if (t.type === TransactionType.INCOME) {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expense += t.amount;
            }
        });
        
        const sortedMonths = Object.keys(monthlyData).sort((a,b) => {
            const dateA = new Date(`01 ${a}`);
            const dateB = new Date(`01 ${b}`);
            return dateA.getTime() - dateB.getTime();
        });


        return sortedMonths.map(month => ({
            name: month,
            Income: monthlyData[month].income,
            Expense: monthlyData[month].expense,
        }));
    }, [transactions]);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Not enough data for a trend.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#10b981" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Expense" stroke="#ef4444" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TrendLineChart;
