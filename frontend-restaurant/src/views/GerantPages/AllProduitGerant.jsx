import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';

const AllProduitGerant = () => {
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
    
            const response = await axios.get('http://127.0.0.1:8000/api/produits', { headers });
            
            setProduits(response.data);
    
            const categoriesResponse = await axios.get('http://127.0.0.1:8000/api/categories', { headers });
            
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


    const deleteProduit = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Assurez-vous que userData est bien défini
    
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
    
            // Set loading state
            setLoading(true);
    
            // Effectuer la requête de suppression
            await axios.delete(`http://127.0.0.1:8000/api/delete_produits/${id}`, { headers });
    
            // Mettre à jour l'état produits en supprimant le produit avec l'ID spécifié
            setProduits(produits.filter(produit => produit.id !== id));
    
            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            // Gérer l'erreur (afficher un message d'erreur, etc.)
        }
    };
    
    const handleDeleteConfirmation = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduit(id);
        }
    };

    

    const handleChange = async (e) => {
        setSearchTerm(e.target.value);
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/recherche_produit?q=${e.target.value}`, { headers });
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
             <div className="button-container">
                <Link to="/addProduitGerent" className="add-button">
                    <i className='bx bx-plus' style={{ marginRight: '5px' }}></i>
                    Add Product
                </Link>
            </div>
             <div class="heading">
                <span>Recettes</span>
                <h3>Nos plats spéciaux</h3>
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
                                    <img src={`http://127.0.0.1:8000/${produit.image}`} alt={produit.nom} />
                                    <h3 className="card-title">{produit.nom}</h3>
                                </div>
                                <div className="card-content">
                                    <p className="description">{produit.description}</p>
                                    <div className="price-and-icons">
                                        <h6 className="price">{produit.prix} €</h6>
                                        <ul className="icon-list">
                                            <li className="list-inline-item">
                                                <Link to={`/editProduitGerent/${produit.id}`}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title="Edit"
                                                    className="text-primary">
                                                    <i className="bx bxs-edit font-size-18"></i>
                                                </Link>
                                            </li>
                                            <li className="list-inline-item">
                                                <button onClick={() => handleDeleteConfirmation(produit.id)}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title="Delete"
                                                    className="text-danger"
                                                    style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit', fontSize: 15 }}>
                                                    <i className="bx bxs-trash font-size-18"></i>
                                                </button>
                                            </li>
                                        </ul>
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

export default AllProduitGerant;
