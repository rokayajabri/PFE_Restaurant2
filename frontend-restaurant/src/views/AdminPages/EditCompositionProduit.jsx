import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCompositionProduit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Récupérer l'ID de la composition depuis les paramètres de l'URL
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_Produit: '',
        id_Ingredient: '',
        quantite_necessaire: ''
    });
    const [produits, setProduits] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(''); // State pour l'unité de mesure

    useEffect(() => {
        const fetchCompositionDetails = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                setLoading(true);
                const responseComposition = await axios.get(`http://127.0.0.1:8001/api/show_compositions/${id}`, { headers });
                const composition = responseComposition.data;
                setFormData({
                    id_Produit: composition.produit.id,
                    id_Ingredient: composition.ingredient.id,
                    quantite_necessaire: composition.quantite_necessaire
                });
                setSelectedUnit(composition.ingredient.uniteMesure);
                
                const responseProduits = await axios.get('http://127.0.0.1:8001/api/produits', { headers });
                setProduits(responseProduits.data);

                const responseIngredients = await axios.get('http://127.0.0.1:8001/api/ingredients', { headers });
                setIngredients(responseIngredients.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching composition details:', error);
                setLoading(false);
            }
        };

        fetchCompositionDetails();
    }, [id]); // Effectue le chargement des données une fois que le component est chargé et à chaque changement de l'ID

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'id_Ingredient') {
            const selectedIngredient = ingredients.find(ing => ing.id.toString() === e.target.value);
            setSelectedUnit(selectedIngredient ? selectedIngredient.uniteMesure : ''); // Mettre à jour l'unité de mesure
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            await axios.put(`http://127.0.0.1:8001/api/edit_compositions/${id}`, formData, { headers });
            console.log('Composition updated successfully!');
            navigate("/compositions");
            setLoading(false);
        } catch (error) {
            console.error('Error updating composition:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Edit Composition Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id_Produit">Produit:</label>
                    <select id="id_Produit" name="id_Produit" value={formData.id_Produit} onChange={handleChange}>
                        {produits.map(produit => (
                            <option key={produit.id} value={produit.id}>{produit.nom}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="id_Ingredient">Ingrédient:</label>
                    <select id="id_Ingredient" name="id_Ingredient" value={formData.id_Ingredient} onChange={handleChange}>
                        {ingredients.map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>{ingredient.nom}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="quantite_necessaire">Quantité nécessaire ({selectedUnit}):</label>
                    <input type="number" id="quantite_necessaire" name="quantite_necessaire" value={formData.quantite_necessaire} onChange={handleChange} />
                </div>
                <button type="submit">Update Composition</button>
            </form>
        </div>
    );
};

export default EditCompositionProduit;
