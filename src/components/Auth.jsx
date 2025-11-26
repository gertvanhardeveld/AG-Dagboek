import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { LogIn, UserPlus, Loader } from 'lucide-react'

export function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('student')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [isInvited, setIsInvited] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('register') === 'true') {
            setIsSignUp(true);
            if (params.get('email')) setEmail(params.get('email'));
            if (params.get('role')) {
                setRole(params.get('role'));
                setIsInvited(true);
            }
        }
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role,
                        },
                    },
                })
                if (error) throw error
                setMessage('Check je email voor de bevestigingslink!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>
                    {isSignUp ? 'Registreren' : 'Inloggen'}
                </h2>

                <form onSubmit={handleAuth} style={{ display: 'grid', gap: '1.5rem' }}>
                    {isSignUp && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Volledige Naam</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    placeholder="Jan Jansen"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Ik ben een...</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={isInvited}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        backgroundColor: isInvited ? 'var(--bg-body)' : 'white',
                                        cursor: isInvited ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Docent</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="jouw@email.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Wachtwoord</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div style={{ color: '#10b981', fontSize: '0.9rem', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? <Loader className="spin" size={20} /> : (isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />)}
                        {isSignUp ? 'Registreren' : 'Inloggen'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {isSignUp ? 'Heb je al een account?' : 'Nog geen account?'}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ color: 'var(--primary)', fontWeight: '600', marginLeft: '0.5rem', textDecoration: 'underline' }}
                    >
                        {isSignUp ? 'Log in' : 'Registreer hier'}
                    </button>
                </div>
            </div>
        </div>
    )
}
