import React, { useEffect, useState } from 'react';
import OutfitRecommendation from './OutfitRecommendation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [weather, setWeather] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUser(prevUser => ({
                    ...prevUser,
                    profileImage: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5001/api/outfits/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
                fetchWeather(res.data.location);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchWeather = async (location) => {
            try {
                const response = await axios.get(`http://localhost:5001/api/outfits/weather/${location}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token')}
                });
                console.log('Weather Data:', response.data);
                setWeather({
                    temp: response.data.main.temp,
                    description: response.data.weather[0].description
                });
            } catch (error) {
                console.error('Error fetching Weather data: ', error);
            }
        };
        
        fetchUser();

    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Outfit Recommender</h1>
          
            {user && weather && (
            <div style={styles.userInfoContainer}>
                <div style={styles.profileImageContainer}>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    />
                    <label htmlFor="profile-image-upload" style={styles.profileImageLabel}>
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" style={styles.profileImage} />
                        ) : (
                            <div style={styles.profileImagePlaceholder}>Upload Image</div>
                        )}
                    </label>
                </div>
                <div style={styles.userInfoContent}>
                    <div style={styles.infoSection}>
                        <h2 style={styles.welcomeText}>Welcome, {user.username}!</h2>
                        <p>Email: {user.email}</p>
                        <p>Location: {user.location}</p>
                    </div>
                    <div style={styles.infoSection}>
                        <h3 style={styles.weatherHeader}>Current Weather:</h3>
                        <p>Temperature: {weather.temp}°C</p>
                        <p>Condition: {weather.description}</p>
                    </div>
                    </div>
                </div>
            )}
      
          <OutfitRecommendation />
          <button onClick={handleLogout} style={styles.logoutButton}>
            Sign Out
          </button>
        </div>
    );    
};

const styles = {
    userInfoContainer: {
      width: '60%',
      height: 'auto',
      backgroundColor: '#e0e0e0',
      borderRadius: '100px 100px 0 0',
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      marginBottom: '20px',
      border: '4px solid #4a4a4a',
    },
    profileImageContainer: {
      width: '150px',
      height: '150px',
      marginRight: '40px',
    },
    profileImageLabel: {
      display: 'block',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    profileImagePlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ccc',
      color: '#666',
      fontSize: '14px',
      borderRadius: '50%',
    },
    userInfoContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row', // Changed to row to place items side by side
      justifyContent: 'space-between', // Distributes space between the two sections
      alignItems: 'flex-start', // Aligns items to the top
    },
    infoSection: {
      flex: 1, // Each section takes up equal space
      padding: '0 10px'
    },
    welcomeText: {
      marginBottom: '10px',
    },
    weatherHeader: {
      marginBottom: '10px',
    },
    logoutButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

export default Dashboard;