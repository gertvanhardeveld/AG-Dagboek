import { useState, useEffect } from 'react';
import { PlusCircle, Save, Star, X } from 'lucide-react';

export function DiaryForm({ onAdd, onUpdate, onCancel, hasEntryForDate, editingEntry }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        mood: 3,
        activities: '',
        learnings: '',
        challenges: '',
        nextSteps: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (editingEntry) {
            setFormData({
                ...editingEntry,
                date: editingEntry.date || editingEntry.createdAt.split('T')[0]
            });
            setError('');
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                mood: 3,
                activities: '',
                learnings: '',
                challenges: '',
                nextSteps: '',
            });
        }
    }, [editingEntry]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.activities.trim()) return;

        // Only check for duplicates if we are creating a NEW entry, 
        // or if we changed the date of an existing entry to a date that already exists (and isn't the original entry's date)
        const isDateChanged = editingEntry && (formData.date !== (editingEntry.date || editingEntry.createdAt.split('T')[0]));

        if ((!editingEntry || isDateChanged) && hasEntryForDate && hasEntryForDate(formData.date)) {
            // If editing, check if the conflicting entry is NOT the one we are editing
            if (!editingEntry || (editingEntry && hasEntryForDate(formData.date))) {
                // This logic is a bit tricky with the current hasEntryForDate implementation which just returns boolean.
                // Ideally hasEntryForDate should return the ID of the entry so we can compare.
                // For now, let's assume strict one-per-day.
                setError('Je hebt al een dagboek entry voor deze datum.');
                return;
            }
        }

        if (editingEntry) {
            onUpdate({ ...editingEntry, ...formData });
        } else {
            onAdd(formData);
        }

        if (!editingEntry) {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                mood: 3,
                activities: '',
                learnings: '',
                challenges: '',
                nextSteps: '',
            });
        }
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'date' && hasEntryForDate) {
            // Allow if it's the same date as the entry being edited
            if (editingEntry && value === (editingEntry.date || editingEntry.createdAt.split('T')[0])) {
                setError('');
                return;
            }

            if (hasEntryForDate(value)) {
                setError('Je hebt al een dagboek entry voor deze datum.');
            } else {
                setError('');
            }
        }
    };

    const handleMoodChange = (rating) => {
        setFormData((prev) => ({ ...prev, mood: rating }));
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', border: editingEntry ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: editingEntry ? 'var(--primary)' : 'var(--text-main)' }}>
                {editingEntry ? <Edit2Icon /> : <PlusCircle size={24} color="var(--primary)" />}
                {editingEntry ? 'Dag Bewerken' : 'Nieuwe Dag'}
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Datum
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Hoe voel je je vandaag?
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '42px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleMoodChange(star)}
                                    style={{
                                        padding: '0',
                                        color: star <= formData.mood ? '#fbbf24' : 'var(--border)',
                                        transition: 'transform 0.1s'
                                    }}
                                >
                                    <Star
                                        size={28}
                                        fill={star <= formData.mood ? '#fbbf24' : 'none'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Wat heb je vandaag gedaan?
                    </label>
                    <textarea
                        name="activities"
                        value={formData.activities}
                        onChange={handleChange}
                        placeholder="Beschrijf je activiteiten..."
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Wat heb je geleerd?
                    </label>
                    <textarea
                        name="learnings"
                        value={formData.learnings}
                        onChange={handleChange}
                        placeholder="Nieuwe inzichten of vaardigheden..."
                        rows={3}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Tegen welke uitdagingen liep je aan?
                    </label>
                    <textarea
                        name="challenges"
                        value={formData.challenges}
                        onChange={handleChange}
                        placeholder="Obstakels of moeilijkheden..."
                        rows={3}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Wat ga je daar morgen aan doen?
                    </label>
                    <textarea
                        name="nextSteps"
                        value={formData.nextSteps}
                        onChange={handleChange}
                        placeholder="Actiepunten voor morgen..."
                        rows={3}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {error ? (
                        <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '500' }}>
                            {error}
                        </span>
                    ) : <span></span>}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {editingEntry && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn-secondary"
                            >
                                <X size={20} />
                                Annuleren
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!!error}
                            style={{ opacity: error ? 0.5 : 1, cursor: error ? 'not-allowed' : 'pointer' }}
                        >
                            <Save size={20} />
                            {editingEntry ? 'Bijwerken' : 'Opslaan'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

function Edit2Icon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
    )
}
