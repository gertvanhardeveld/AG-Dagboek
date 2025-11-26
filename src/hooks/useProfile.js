import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProfile(session) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading };
}
