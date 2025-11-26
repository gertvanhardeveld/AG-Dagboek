import { Calendar, Trash2, BookOpen, AlertCircle, ArrowRight, Star } from 'lucide-react';

export function DiaryCard({ entry, onDelete }) {
    const date = new Date(entry.date || entry.createdAt).toLocaleDateString('nl-NL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="card" style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Calendar size={18} />
                        <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{date}</span>
                    </div>

                    {entry.mood && (
                        <div style={{ display: 'flex', gap: '2px' }} title={`Stemming: ${entry.mood}/5`}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < entry.mood ? '#fbbf24' : 'none'}
                                    color={i < entry.mood ? '#fbbf24' : 'var(--border)'}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => onDelete(entry.id)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem', color: 'var(--secondary)', borderColor: 'transparent' }}
                    title="Verwijderen"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <Section
                    icon={<BookOpen size={20} color="var(--primary)" />}
                    title="Activiteiten"
                    content={entry.activities}
                />

                {entry.learnings && (
                    <Section
                        icon={<span style={{ fontSize: '1.2rem' }}>💡</span>}
                        title="Geleerd"
                        content={entry.learnings}
                    />
                )}

                {entry.challenges && (
                    <Section
                        icon={<AlertCircle size={20} color="var(--secondary)" />}
                        title="Uitdagingen"
                        content={entry.challenges}
                    />
                )}

                {entry.nextSteps && (
                    <Section
                        icon={<ArrowRight size={20} color="var(--primary)" />}
                        title="Actie voor morgen"
                        content={entry.nextSteps}
                    />
                )}
            </div>
        </div>
    );
}

function Section({ icon, title, content }) {
    return (
        <div>
            <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-main)'
            }}>
                {icon}
                {title}
            </h3>
            <p style={{
                color: 'var(--text-muted)',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6'
            }}>
                {content}
            </p>
        </div>
    );
}
