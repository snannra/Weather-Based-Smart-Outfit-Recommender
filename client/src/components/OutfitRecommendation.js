import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OutfitRecommendation = ({ weatherMain }) => {  
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/outfits/outfits', {
                    headers: { 'x-auth-token': localStorage.getItem('token') },
                    params: { weatherMain }
                });
                console.log('Outfits:', response.data);
                response.data.forEach(outfit => {
                    console.log('Image Path:', outfit.imagePath);
                });
                setOutfits(response.data);
            } catch (error) {
                console.error('Error fetching outfit recommendations:', error);
            }
        };

        if (weatherMain) {
            fetchOutfits();
        }
    }, [weatherMain]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Recommended Outfits:</h2>
            {outfits.length > 0 ? (
                <ul style={styles.outfitList}>
                    {outfits.map(outfit => (
                        <li key={outfit._id} style={styles.outfitItem}>
                            <div style={styles.imageContainer}>
                                {outfit.imagePath ? (
                                    <img 
                                        src={outfit.imagePath} 
                                        alt={outfit.outfitName} 
                                        style={styles.outfitImage} 
                                    />
                                ) : (
                                    <div style={styles.placeholder}>No Image</div>
                                )}
                            </div>
                            <div style={styles.outfitDetails}>
                                <h3 style={styles.outfitName}>{outfit.outfitName}</h3>
                                <p style={styles.itemsList}>{outfit.items.join(', ')}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noRecommendations}>No recommendations available at the moment.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
    },
    outfitList: {
        listStyleType: 'none',
        padding: 0,
    },
    outfitItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        width: '200px',
        height: '200px',
        marginRight: '30px',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outfitImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
    },
    placeholder: {
        color: '#aaa',
    },
    outfitDetails: {
        flex: 1,
    },
    outfitName: {
        fontSize: '22px',
        marginBottom: '10px',
        color: '#2c3e50',
    },
    itemsList: {
        fontSize: '16px',
        color: '#7f8c8d',
    },
    noRecommendations: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#95a5a6',
    },
};

export default OutfitRecommendation;
