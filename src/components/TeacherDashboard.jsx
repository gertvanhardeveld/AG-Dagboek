import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { DiaryList } from './DiaryList';
import { Users, ChevronLeft } from 'lucide-react';

export function TeacherDashboard() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentEntries, setStudentEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            fetchStudentEntries(selectedStudent.id);
        }
    }, [selectedStudent]);

    const fetchStudents = async () => {
        try {
            // Fetch all profiles with role 'student'
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student');

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Error fetching students:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentEntries = async (studentId) => {
        try {
            const { data, error } = await supabase
                .from('entries')
                .select('*')
                .eq('user_id', studentId)
                .order('date', { ascending: false });

            if (error) throw error;
            setStudentEntries(data || []);
        } catch (error) {
            console.error('Error fetching student entries:', error.message);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Laden...</div>;

    if (selectedStudent) {
        return (
            <div>
                <button
                    onClick={() => setSelectedStudent(null)}
                    className="btn-secondary"
                    style={{ marginBottom: '1.5rem' }}
                >
                    <ChevronLeft size={20} />
                    Terug naar overzicht
                </button>

                <h2 style={{ marginBottom: '1.5rem' }}>Dagboek van {selectedStudent.full_name || 'Student'}</h2>

                <DiaryList
                    entries={studentEntries}
                    onDelete={() => { }} // Teachers can't delete student entries for now
                    onEdit={() => { }} // Teachers can't edit student entries for now
                />
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={24} color="var(--primary)" />
                Studenten Overzicht
            </h2>

            <div className="card" style={{ marginBottom: '2rem', border: '1px dashed var(--primary)', backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)' }}>Nieuwe Student Uitnodigen</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email van student</label>
                        <input
                            type="email"
                            placeholder="student@school.nl"
                            id="invite-email"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            const email = document.getElementById('invite-email').value;
                            if (!email) return alert('Vul een emailadres in');

                            const url = `${window.location.origin}/?register=true&email=${encodeURIComponent(email)}&role=student`;
                            navigator.clipboard.writeText(url);
                            alert('Uitnodigingslink gekopieerd naar klembord!');
                        }}
                    >
                        Link Genereren & Kopiëren
                    </button>
                </div>
            </div>

            {students.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Nog geen studenten geregistreerd.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="card"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}
                            onClick={() => setSelectedStudent(student)}
                        >
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{student.full_name || 'Naamloos'}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Student</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
