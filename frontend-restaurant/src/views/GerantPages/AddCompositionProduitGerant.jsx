import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCompositionProduitGerant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_Produit: '',
        id_Ingredient: '',
        quantite_necessaire: ''
    });
    const [produits, setProduits] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredientUnit, setSelectedIngredientUnit] = useState(''); // Ajout de l'état pour l'unité de mesure

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
                setLoading(true);
                const responseProduits = await axios.get('http://127.0.0.1:8000/api/produits', { headers });
                setProduits(responseProduits.data);
                const responseIngredients = await axios.get('http://127.0.0.1:8000/api/ingredients', { headers });
                setIngredients(responseIngredients.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchInitialData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'id_Ingredient') {
            const selectedIngredient = ingredients.find(ing => ing.id.toString() === e.target.value);
            if (selectedIngredient) {
                setSelectedIngredientUnit(selectedIngredient.uniteMesure); // Mise à jour de l'unité de mesure en fonction de l'ingrédient sélectionné
            }
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
            await axios.post('http://127.0.0.1:8000/api/add_composition', formData, { headers });
            console.log('Composition ajoutée avec succès !');
            navigate("/compositions");
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la composition:', error);
        }
    };

    return (
        <div>
            <h2>Ajouter une composition de produit</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id_Produit">Produit:</label>
                    <select id="id_Produit" name="id_Produit" value={formData.id_Produit} onChange={handleChange}>
                        <option value="">Sélectionnez un produit</option>
                        {produits.map(produit => (
                            <option key={produit.id} value={produit.id}>{produit.nom}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="id_Ingredient">Ingrédient:</label>
                    <select id="id_Ingredient" name="id_Ingredient" value={formData.id_Ingredient} onChange={handleChange}>
                        <option value="">Sélectionnez un ingrédient</option>
                        {ingredients.map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>{ingredient.nom}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="quantite_necessaire">Quantité nécessaire ({selectedIngredientUnit}):</label>
                    <input type="number" id="quantite_necessaire" name="quantite_necessaire" value={formData.quantite_necessaire} onChange={handleChange} />
                </div>
                <button type="submit">Ajouter Composition</button>
            </form>
        </div>
    );
};

export default AddCompositionProduitGerant;
