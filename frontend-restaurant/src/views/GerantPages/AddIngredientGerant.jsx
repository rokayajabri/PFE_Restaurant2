import axios from 'axios';
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

function AddIngredientGerant() {
    const navigate = useNavigate();
    const [nom, setNom] = useState('');
    const [quantiteStock, setQuantiteStock] = useState('');
    const [uniteMesure, setUniteMesure] = useState('');
    const [seuilReapprovisionnement, setSeuilReapprovisionnement] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
    
            // Set loading state
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/add_ingredients', {
                nom,
                quantite_Stock: quantiteStock,
                uniteMesure,
                seuil_Reapprovisionnement: seuilReapprovisionnement
            },{headers});
            console.log('Ingredient added:', response.data);
            // Réinitialiser les champs après l'ajout réussi
            setNom('');
            setQuantiteStock('');
            setUniteMesure('');
            setSeuilReapprovisionnement('');

            navigate("/allIngredientGerent");
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    return (
        <div className="custom-container">
            <h2 className="custom-card-title">Add new ingredient</h2>
            <form onSubmit={handleSubmit} className="custom-form">
                <div className="custom-form-group">
                    <label className="custom-form-label">Nom:</label>
                    <input
                        type="text"
                        className="custom-form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </div>

                <div className="custom-form-group">
                    <label className="custom-form-label">Quantité en stock:</label>
                    <input
                        type="number"
                        className="custom-form-control"
                        value={quantiteStock}
                        onChange={(e) => setQuantiteStock(e.target.value)}
                    />
                </div>

                <div className="custom-form-group">
                    <label className="custom-form-label">Unité de mesure:</label>
                    <input
                        type="text"
                        className="custom-form-control"
                        value={uniteMesure}
                        onChange={(e) => setUniteMesure(e.target.value)}
                    />
                </div>

                <div className="custom-form-group">
                    <label className="custom-form-label">Seuil de réapprovisionnement:</label>
                    <input
                        type="number"
                        className="custom-form-control"
                        value={seuilReapprovisionnement}
                        onChange={(e) => setSeuilReapprovisionnement(e.target.value)}
                    />
                </div>

                <div className="custom-form-group full-width">
                    <button type="submit" className="custom-btn">Add</button>
                </div>
            </form>
        </div>
    );
}

export default AddIngredientGerant;
