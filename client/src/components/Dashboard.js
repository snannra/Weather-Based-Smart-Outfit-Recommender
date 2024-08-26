import React, { useEffect, useState } from 'react';
import OutfitRecommendation from './OutfitRecommendation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [weather, setWeather] = useState(null);
    const navigate = useNavigate();

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
                const weatherData = {
                    temp: response.data.main.temp,
                    main: response.data.weather[0].main,
                };
                setWeather(weatherData);
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

    const handleCreateOutfit = () => {
        navigate('/create-outfit');
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Outfit Recommender</h1>
            
            {user && weather && (
                <div style={styles.userInfoContainer}>
                    <div style={styles.profileImageContainer}>
                        {user.profileImagePath ? (
                            <img 
                                src={user.profileImagePath} 
                                alt={user.username} 
                                style={styles.profileImage} 
                            />
                            ) : (
                                <div style={styles.profileImagePlaceholder}>No Image</div>
                        )}
                    </div>
                    <div style={styles.userInfoContent}>
                        <div style={styles.infoSection}>
                            <p style={styles.infoText}>Email: <span style={styles.highlight}>{user.email}</span></p>
                            <p style={styles.infoText}>Location: <span style={styles.highlight}>{user.location}</span></p>
                        </div>
                        <div style={styles.infoSection}>
                            <p style={styles.infoText}>Temperature: <span style={styles.highlight}>{weather.temp}°C</span></p>
                            <p style={styles.infoText}>Condition: <span style={styles.highlight}>{weather.main}</span></p>
                        </div>
                    </div>
                </div>
            )}
    
            {weather?.main && <OutfitRecommendation weatherMain={weather.main}/>}

            <button 
                onClick={handleCreateOutfit} 
                style={styles.createOutfitButton}
            >
                Create New Outfit
            </button>

            <button 
                onClick={handleLogout} 
                style={styles.logoutButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.logoutButton.backgroundColor}
            >
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
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    },
    profileImageContainer: {
        width: '150px',
        height: '150px',
        marginRight: '40px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0'
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
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
    },
    infoSection: {
        flex: 1,
        padding: '0 10px',
        fontSize: '20px', 
        lineHeight: '1.6', 
        fontFamily: 'Arial, sans-serif', 
        color: '#333', 
    },
    infoText: {
        fontSize: '22px',
        fontWeight: '500', 
        color: '#333', 
        marginBottom: '8px',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', 
    },
    highlight: {
        color: '#007bff', 
        fontWeight: 'bold',
    },
    welcomeText: {
        marginBottom: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', 
    },
    weatherHeader: {
        marginBottom: '10px',
        fontSize: '20px', 
        fontWeight: '600',
        color: '#555',
    },
    createOutfitButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#28a745', 
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
    },
    logoutButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
    },
    logoutButtonHover: {
        backgroundColor: '#0056b3',
    },
};

export default Dashboard;