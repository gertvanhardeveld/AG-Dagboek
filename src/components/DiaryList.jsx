import { Edit2, Trash2, Star } from 'lucide-react';

export function DiaryList({ entries, onDelete, onEdit }) {
    if (entries.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Nog geen dagboek items.</p>
                <p>Begin met het schrijven van je eerste dag!</p>
            </div>
        );
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return dateB - dateA;
    });

    return (
        <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-body)' }}>
                        <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>Datum</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>Stemming</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>Activiteiten</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>Acties</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>Opties</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedEntries.map((entry) => {
                        const date = new Date(entry.date || entry.createdAt).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'short',
                            weekday: 'short'
                        });

                        return (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{date}</td>
                                <td style={{ padding: '1rem' }}>
                                    {entry.mood && (
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < entry.mood ? '#fbbf24' : 'none'}
                                                    color={i < entry.mood ? '#fbbf24' : 'var(--border)'}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {entry.activities}
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {entry.nextSteps}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => onEdit(entry)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem', color: 'var(--primary)', borderColor: 'transparent' }}
                                            title="Bewerken"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(entry.id)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem', color: 'var(--secondary)', borderColor: 'transparent' }}
                                            title="Verwijderen"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
