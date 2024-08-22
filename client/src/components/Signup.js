import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        location: '',
        preferences: 'warm',
    });

    const navigate = useNavigate();

    const { username, email, password, location, preferences } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/outfits/signup', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
                <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                <input type="text" name="location" value={location} onChange={onChange} placeholder="Location" required />
                <select name="preferences" value={preferences} onChange={onChange}>
                    <option value="warm">Warm Weather</option>
                    <option value="cold">Cold Weather</option>
                    <option value="cold">Cloudy Weather</option>
                </select>
                <button type="submit">Signup</button>
            </form>
            <p>Already have an account?</p>
            <Link to="/login">
                <button>Login</button>
            </Link>
        </div>
    );
};

export default Signup;