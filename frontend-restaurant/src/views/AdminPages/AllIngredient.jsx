import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

function AllIngredient() {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        console.log(userData); // Doit être "object"

        const headers = {
            Authorization: `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
        };

        // Set loading state
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

    const deleteIngredient = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            // Set loading state
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8001/api/delete_ingredients/${id}`, { headers });

            // Mettre à jour l'état produits en supprimant le produit avec l'ID spécifié
            setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
 
            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error('Error deleting ingredient:', error);
        }
    };

    const handleDeleteConfirmation = (id) => {
        if (window.confirm('Are you sure you want to delete this ingredient?')) {
            deleteIngredient(id);
        }
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
            const response = await axios.get(`http://127.0.0.1:8001/api/recherche_ingredient?q=${searchTerm}`, { headers });
         
            // Mettre à jour l'état produits avec les résultats de la recherche
            setIngredients(response.data);
 
            // Réinitialiser l'état de chargement
            setLoading(false);
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <div className="mb-3">
                        <h5 className="card-title">
                            List of Ingredient <span className="text-muted fw-normal ms-2">({ingredients.length})</span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                        <div>
                            <Link to="/addIngredient" className="add-button1">
                                <i className="bx bx-plus me-1"></i> Add Ingredient
                            </Link>
                        </div>
                    </div>
                </div>

                <div>
                    <form onSubmit={handleSubmit} className="d-flex align-items-center">
                        <div className="col-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleChange}
                                placeholder="Search by name or email"
                                className="form-control me-2"
                            />
                        </div>
                        <button type="submit" className="add-button1">Search</button>
                    </form><br />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="table-responsive">
                        <table className="table project-list-table table-nowrap align-middle table-borderless">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nom</th>
                                    <th>Quantité en stock</th>
                                    <th>Unité de mesure</th>
                                    <th>Seuil de réapprovisionnement</th>
                                    <th>Fournisseur</th>
                                    <th scope="col" style={{ width: "200px" }}>
                                        Action
                                    </th>
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
                                        <td>{ingredient.supplier ? `${ingredient.supplier.nom} ${ingredient.supplier.prenom}` : 'N/A'}</td>
                                        <td>
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Link to={`/editIngredient/${ingredient.id}`} className="px-2 text-primary">
                                                        <i className="bx bx-pencil font-size-18"></i>
                                                    </Link>
                                                </li>
                                                <li className="list-inline-item">
                                                    <button onClick={() => handleDeleteConfirmation(ingredient.id)} className="px-2 text-danger" style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit', fontSize: 15, paddingLeft: 2 }}>
                                                        <i className="bx bx-trash-alt font-size-18"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllIngredient;
