import { useState, useEffect } from 'react';
import { useDiary } from './hooks/useDiary';
import { useProfile } from './hooks/useProfile';
import { DiaryForm } from './components/DiaryForm';
import { DiaryList } from './components/DiaryList';
import { MoodChart } from './components/MoodChart';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Auth } from './components/Auth';
import { supabase } from './supabaseClient';
import { LogOut, User } from 'lucide-react';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const { profile, loading: profileLoading } = useProfile(session);
  const { entries, addEntry, deleteEntry, updateEntry, hasEntryForDate, loading: diaryLoading } = useDiary(session);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdate = (updatedEntry) => {
    updateEntry(updatedEntry);
    setEditingEntry(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  if (profileLoading) {
    return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Profiel laden...</div>;
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <User size={16} />
            {profile?.full_name || session.user.email} ({profile?.role === 'teacher' ? 'Docent' : 'Student'})
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
          >
            <LogOut size={16} />
            Uitloggen
          </button>
        </div>

        <h1 style={{
          fontSize: '3rem',
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          AG-Dagboek
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Reflecteer, leer en groei elke dag.
        </p>
      </header>

      <main>
        {profile?.role === 'teacher' ? (
          <TeacherDashboard />
        ) : (
          diaryLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Laden...</div>
          ) : (
            <>
              <MoodChart entries={entries} />
              <DiaryForm
                onAdd={addEntry}
                onUpdate={handleUpdate}
                onCancel={() => setEditingEntry(null)}
                hasEntryForDate={hasEntryForDate}
                editingEntry={editingEntry}
              />

              <div style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Jouw Reis</h2>
                <DiaryList
                  entries={entries}
                  onDelete={deleteEntry}
                  onEdit={setEditingEntry}
                />
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
}

export default App
