import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOutfit = () => {
    
    const [outfitData, setOutfitData] = useState({
        outfitName: '',
        temperatureRange: 'warm', // Default value
        weatherType: 'sunny', // Default value
        items: '',
    });

    const navigate = useNavigate();

    const { outfitName, temperatureRange, weatherType, items } = outfitData;

    const onChange = e => setOutfitData({ ...outfitData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/outfits/create-outfit', {
                ...outfitData,
                items: items.split(',').map(item => item.trim()) // Split items by commas and trim spaces
            });
            console.log(response.data);
            navigate('/dashboard'); // Navigate to the dashboard page after successful creation
        } catch (error) {
            console.error('Error creating outfit:', error);
            alert('Failed to create outfit');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Create New Outfit</h2>
            <form onSubmit={handleSubmit} style={{ width: '300px', textAlign: 'left' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Outfit Name:</label>
                    <input 
                        type="text" 
                        name="outfitName" // Added name attribute to bind with state
                        value={outfitName} 
                        onChange={onChange} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Temperature Range:</label>
                    <select 
                        name="temperatureRange" // Added name attribute to bind with state
                        value={temperatureRange} 
                        onChange={onChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="warm">Warm</option>
                        <option value="cold">Cold</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Weather Type:</label>
                    <select 
                        name="weatherType" // Added name attribute to bind with state
                        value={weatherType} 
                        onChange={onChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="sunny">Sunny</option>
                        <option value="cloudy">Cloudy</option>
                        <option value="rainy">Rainy</option>
                        <option value="snowy">Snowy</option>
                        <option value="misty">Misty</option>
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Items (comma separated):</label>
                    <input 
                        type="text" 
                        name="items" // Added name attribute to bind with state
                        value={items} 
                        onChange={onChange} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
                    />
                </div>
                <button type="submit" style={styles.submitButton}>Create Outfit</button>
            </form>
        </div>
    );
};

const styles = {
    submitButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }
};

export default CreateOutfit;
