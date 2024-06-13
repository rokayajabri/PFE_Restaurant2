import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style.css';
import 'boxicons/css/boxicons.min.css';

const AllProduitCuisinier = () => {
    const [produits, setProduits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchProduits = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
    
            // Set loading state
            setLoading(true);
    
            const response = await axios.get('http://127.0.0.1:8001/api/produits', { headers });
            
            setProduits(response.data);
    
            const categoriesResponse = await axios.get('http://127.0.0.1:8001/api/categories', { headers });
            
            setCategories(categoriesResponse.data);
            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            // Handle errors (e.g., display error message)
        }
    };

    useEffect(() => {
        fetchProduits();
    }, []);
    
    const handleChange = async (e) => {
        setSearchTerm(e.target.value);
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8001/api/recherche_produit?q=${e.target.value}`, { headers });
            setProduits(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for product.');
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.nom : 'Introuvable';
    };

    return (
        <div>
            <div className="heading">
                <span>Recettes</span>
                <h3 className='plate'>Nos plats spéciaux</h3>
            </div>  
      
            <input 
                type="text" 
                value={searchTerm} 
                onChange={handleChange}  
                placeholder="Search by name"
                className='search'
            />    

            <div className="list">
                {produits.length === 0 ? (
                    <h1>Liste des produits est vide</h1>
                ) : (
                    <div className="grid-container">
                        {produits.map(produit => (
                            <div key={produit.id} className="card">
                                
                                <div className="image-container">
                                    <img src={`http://127.0.0.1:8001/${produit.image}`} alt={produit.nom} />
                                    <h3 className="card-title">{produit.nom}</h3>
                                </div>
                                <div className="card-content">
                                    <p className="description">{produit.description}</p>
                                    <div className="price-and-icons">
                                        <h6 className="price">{produit.prix} €</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProduitCuisinier;
