import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllCompositionProduitGerant = () => {
    const [compositions, setCompositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    
    const fetchCompositions = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
    
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8001/api/compositions', { headers });
            setCompositions(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching compositions:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompositions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this composition?')) {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
        
                setLoading(true);
                await axios.delete(`http://127.0.0.1:8001/api/delete_compositions/${id}`, { headers });
                setCompositions(compositions.filter(comp => comp.id !== id));
                setLoading(false);
            } catch (error) {
                console.error("Error deleting composition:", error);
                setLoading(false);
            }
        }
    };

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
            const response = await axios.get(`http://127.0.0.1:8001/api/recherche_composition?q=${searchTerm}`, { headers });
            setCompositions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for compositions:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>List of Composition Products</h2>
            <Link to="/addCompositionProduit">Add Composition</Link>
            <form onSubmit={handleSubmit}>
                <input type="text" value={searchTerm} onChange={handleChange} placeholder="Search by product name or ID"/>
                <button type="submit">Search</button>
            </form>
            <table border='1px'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Ingredient Name</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {compositions.map(composition => (
                        <tr key={composition.id}>
                            <td>{composition.id}</td>
                            <td>{composition.produit ? composition.produit.nom : 'Product not found'}</td>
                            <td>{composition.ingredient ? `${composition.ingredient.nom} (${composition.ingredient.uniteMesure})` : 'Ingredient not found'}</td>
                            <td>{`${composition.quantite_necessaire} ${composition.ingredient ? composition.ingredient.uniteMesure : ''}`}</td>
                            <td>
                                <Link to={`/editCompositionProduit/${composition.id}`}>Edit</Link>
                                <button onClick={() => handleDelete(composition.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllCompositionProduitGerant;
