import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        location: '',
        preferences: '',
        imageFile: null,
    });

    const navigate = useNavigate();

    const { username, email, password, location, preferences, imageFile } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = e => setFormData({ ...formData, imageFile: e.target.files[0] });

    const onSubmit = async e => {
        e.preventDefault();

        const data = new FormData(); 
        data.append('username', username);
        data.append('email', email);
        data.append('password', password);
        data.append('location', location);
        data.append('preferences', preferences);
        if (imageFile) {
            data.append('imageFile', imageFile);
        }

        try {
            const res = await axios.post('http://localhost:5001/api/outfits/signup', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error signing up:', err);
            console.error(err.response.data);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <h1 style={{ marginBottom: '20px', color: '#333' }}>Create Your Account</h1>
            
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <input 
                    type="text" 
                    name="username" 
                    value={username} 
                    onChange={onChange} 
                    placeholder="Username" 
                    required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={onChange} 
                    placeholder="Email" 
                    required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={onChange} 
                    placeholder="Password" 
                    required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <input 
                    type="text" 
                    name="location" 
                    value={location} 
                    onChange={onChange} 
                    placeholder="Location" 
                    required 
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <select 
                    name="preferences" 
                    value={preferences} 
                    onChange={onChange} 
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="clear">Clear</option>
                    <option value="clouds">Clouds</option>
                    <option value="thunderstorm">Thunderstorm</option>
                    <option value="drizzle">Drizzle</option>
                    <option value="rain">Rain</option>
                    <option value="snow">Snow</option>
                    <option value="mist">Mist</option>
                    <option value="smoke">Smoke</option>
                    <option value="haze">Haze</option>
                    <option value="dust">Dust</option>
                    <option value="fog">Fog</option>
                    <option value="sand">Sand</option>
                    <option value="ash">Ash</option>
                    <option value="squall">Squall</option>
                    <option value="tornado">Tornado</option>
                </select>
                <input 
                    type="file" 
                    name="imageFile" 
                    onChange={onFileChange} 
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                <button 
                    type="submit" 
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Signup
                </button>
            </form>
            
            <p style={{ marginTop: '20px', color: '#555' }}>Already have an account?</p>
            <Link to="/login">
                <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                </button>
            </Link>
        </div>
    );    
};

export default Signup;