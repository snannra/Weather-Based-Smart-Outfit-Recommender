import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOutfit = () => {
    
    const [outfitData, setOutfitData] = useState({
        outfitName: '',
        temperatureRange: 'warm', 
        weatherType: 'sunny', 
        items: '',
        imageFile: null,
    });

    const navigate = useNavigate();

    const { outfitName, temperatureRange, weatherType, items, imageFile } = outfitData;

    const onChange = e => setOutfitData({ ...outfitData, [e.target.name]: e.target.value });
    const onFileChange = e => setOutfitData({ ...outfitData, imageFile: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('outfitName', outfitName);
        formData.append('temperatureRange', temperatureRange);
        formData.append('weatherType', weatherType);
        formData.append('items', items.split(',').map(item => item.trim()));
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        
        try {
            const response = await axios.post('http://localhost:5001/api/outfits/create-outfit', formData, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                }
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
                        name="outfitName" 
                        value={outfitName} 
                        onChange={onChange} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Temperature Range:</label>
                    <select 
                        name="temperatureRange" 
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
                        name="weatherType" 
                        value={weatherType} 
                        onChange={onChange} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="sun">Sun</option>
                        <option value="clouds">Clouds</option>
                        <option value="rain">Rain</option>
                        <option value="snow">Snow</option>
                        <option value="mist">Mist</option>
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Items (comma separated):</label>
                    <input 
                        type="text" 
                        name="items" 
                        value={items} 
                        onChange={onChange} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Upload Outfit Image:</label>
                    <input 
                        type="file" 
                        name="imageFile" 
                        onChange={onFileChange} 
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
