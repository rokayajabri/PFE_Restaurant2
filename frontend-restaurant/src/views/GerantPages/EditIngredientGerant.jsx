import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditIngredientGerant() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nom: '',
        quantite_Stock: '',
        uniteMesure: '',
        seuil_Reapprovisionnement: '',
    });

    useEffect(() => {
        const fetchIngredient = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData) {
                    console.error('User data not found in localStorage');
                    return;
                }
            
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                const response = await axios.get(`http://127.0.0.1:8000/api/ingredients/${id}`, { headers });
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching ingredient:', error);
            }
        };

        fetchIngredient();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData) {
                console.error('User data not found in localStorage');
                return;
            }
        
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            await axios.put(`http://127.0.0.1:8000/api/edit_ingredients/${id}`, formData, { headers });
            console.log('Ingredient updated successfully!');
            setLoading(false);
            navigate("/allIngredientGerent");
        } catch (error) {
            console.error('Error updating ingredient:', error);
            setLoading(false);
        }
    };

    return (
        <div className="custom-container">
        <h2 className="custom-card-title">Modifier l'ingrédient</h2>
        <form onSubmit={handleSubmit} className="custom-form">
            <div className="custom-form-group">
                <label className="custom-form-label">Nom:</label>
                <input
                    type="text"
                    className="custom-form-control"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="custom-form-group">
                <label className="custom-form-label">Quantité en stock:</label>
                <input
                    type="number"
                    className="custom-form-control"
                    name="quantite_Stock"
                    value={formData.quantite_Stock}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="custom-form-group">
                <label className="custom-form-label">Unité de mesure:</label>
                <input
                    type="text"
                    className="custom-form-control"
                    name="uniteMesure"
                    value={formData.uniteMesure}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="custom-form-group">
                <label className="custom-form-label">Seuil de réapprovisionnement:</label>
                <input
                    type="number"
                    className="custom-form-control"
                    name="seuil_Reapprovisionnement"
                    value={formData.seuil_Reapprovisionnement}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="custom-form-group full-width">
                <button type="submit" className="custom-btn" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </div>
        </form>
    </div>
    );
}

export default EditIngredientGerant;
