import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useDiary(session) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchEntries();
        } else {
            setEntries([]);
            setLoading(false);
        }
    }, [session]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('entries')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching entries:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const addEntry = async (entry) => {
        try {
            const { data, error } = await supabase
                .from('entries')
                .insert([{ ...entry, user_id: session.user.id }])
                .select();

            if (error) throw error;
            setEntries([data[0], ...entries]);
        } catch (error) {
            console.error('Error adding entry:', error.message);
            alert('Fout bij opslaan: ' + error.message);
        }
    };

    const deleteEntry = async (id) => {
        try {
            const { error } = await supabase
                .from('entries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setEntries(entries.filter((entry) => entry.id !== id));
        } catch (error) {
            console.error('Error deleting entry:', error.message);
        }
    };

    const updateEntry = async (updatedEntry) => {
        try {
            const { error } = await supabase
                .from('entries')
                .update(updatedEntry)
                .eq('id', updatedEntry.id);

            if (error) throw error;
            setEntries(entries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
        } catch (error) {
            console.error('Error updating entry:', error.message);
        }
    };

    const hasEntryForDate = (date) => {
        return entries.some((entry) => entry.date === date);
    };

    return {
        entries,
        addEntry,
        deleteEntry,
        updateEntry,
        hasEntryForDate,
        loading,
    };
}
