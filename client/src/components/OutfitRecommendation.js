import React, {useEffect, useState} from 'react';
import axios from 'axios';

const OutfitRecommendation = () => {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const fetchOufits = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/outfits/recommendations', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setOutfits(response.data);
            } catch (error) {
                console.error('Error fetching outfit recommendations:', error);
            }
        };

        fetchOufits();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Recommended Outfits:</h3>
            {outfits.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {outfits.map(outfit => (
                        <li key={outfit._id} style={{ marginBottom: '10px' }}>
                            <strong>{outfit.outfitName}</strong>: {outfit.items.join(', ')}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recommendations available at the moment.</p>
            )}
        </div>
    );

};

export default OutfitRecommendation;