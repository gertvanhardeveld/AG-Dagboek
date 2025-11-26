import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MoodChart({ entries }) {
    // Process data: sort by date and take last 20 entries
    const data = [...entries]
        .filter(entry => entry.date && entry.mood)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-20)
        .map(entry => ({
            date: new Date(entry.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
            mood: entry.mood,
            fullDate: new Date(entry.date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
        }));

    if (data.length < 2) {
        return null; // Don't show chart if not enough data
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Jouw Stemming (Laatste 20 dagen)</h2>
            <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={[1, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                            labelStyle={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}
                            formatter={(value) => [`${value} sterren`, 'Stemming']}
                            labelFormatter={(label, payload) => {
                                if (payload && payload.length > 0) {
                                    return payload[0].payload.fullDate;
                                }
                                return label;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="mood"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--bg-card)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: 'var(--primary)' }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
