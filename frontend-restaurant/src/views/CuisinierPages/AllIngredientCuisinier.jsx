import axios from 'axios';
import React, { useState, useEffect } from 'react';

function AllIngredientCuisinier() {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));

        const headers = {
            Authorization: `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
        };

        setLoading(true);
        axios.get('http://127.0.0.1:8001/api/ingredients', { headers })
            .then(response => {
                setIngredients(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching ingredients:', error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
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
            const response = await axios.get(`http://127.0.0.1:8001/api/recherche_ingredient?q=${searchTerm}`, { headers });

            setIngredients(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for ingredients:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Liste des ingrédients</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={searchTerm} onChange={handleChange} placeholder="Search by name or id" />
                <button type="submit">Search</button>
            </form>
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Quantité en stock</th>
                        <th>Unité de mesure</th>
                        <th>Seuil de réapprovisionnement</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map(ingredient => (
                        <tr key={ingredient.id}>
                            <td>{ingredient.id}</td>
                            <td>{ingredient.nom}</td>
                            <td>{ingredient.quantite_Stock}</td>
                            <td>{ingredient.uniteMesure}</td>
                            <td>{ingredient.seuil_Reapprovisionnement}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllIngredientCuisinier;
