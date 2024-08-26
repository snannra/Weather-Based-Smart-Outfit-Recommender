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
                const weatherData = {
                    temp: response.data.main.temp,
                    main: response.data.weather[0].main,
                };
                console.log('Weather Data:', weatherData); // Debugging line
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
        navigate('/create-outfit'); // Navigate to the create outfit page
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
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added subtle shadow for depth
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
        flexDirection: 'row', // Row layout to place items side by side
        justifyContent: 'space-between', // Space between the two sections
        alignItems: 'flex-start', // Aligns items to the top
    },
    infoSection: {
        flex: 1, // Each section takes up equal space
        padding: '0 10px',
        fontSize: '20px', // Increased font size
        lineHeight: '1.6', // Adjusted line height for better readability
        fontFamily: 'Arial, sans-serif', // Improved font choice
        color: '#333', // Darker color for better contrast
    },
    infoText: {
        fontSize: '22px',
        fontWeight: '500', // Slightly bolder text
        color: '#333', // Text color
        marginBottom: '8px', // Add space between lines
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Subtle shadow for text
    },
    highlight: {
        color: '#007bff', // Blue color for highlights
        fontWeight: 'bold',
    },
    welcomeText: {
        marginBottom: '10px',
        fontSize: '24px', // Larger font size for welcome text
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    },
    weatherHeader: {
        marginBottom: '10px',
        fontSize: '20px', // Increased font size for weather headers
        fontWeight: '600',
        color: '#555',
    },
    createOutfitButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#28a745', // Green color for the button
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
        fontSize: '18px', // Larger font size for the button
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for the button
        transition: 'background-color 0.3s ease',
    },
    logoutButtonHover: {
        backgroundColor: '#0056b3', // Darker blue on hover
    },
};

export default Dashboard;
