import axios from 'axios';
import React, { useState, useEffect } from 'react';

const AllCategorieCuisinier = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8001/api/categories', { headers });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const fetchProductsByCategory = async (categoryId) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8001/api/produits?categoryId=${categoryId}`, { headers });
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
            return [];
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleToggle = async (categoryId) => {
        if (expandedCategories[categoryId]) {
            setExpandedCategories(prevState => ({ ...prevState, [categoryId]: false }));
        } else {
            const products = await fetchProductsByCategory(categoryId);
            setExpandedCategories(prevState => ({ ...prevState, [categoryId]: products }));
        }
    };

    const searchCategories = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8001/api/recherche_categorie?q=${searchTerm}`, { headers });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for categories:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        searchCategories();
    };

    return (
        <div>
            <h2>Category List</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={searchTerm} onChange={handleChange} placeholder="Search by name or id" />
                <button type="submit">Search</button>
            </form>
            <br />
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <React.Fragment key={category.id}>
                            <tr>
                                <td>
                                    {category.id}
                                    <button onClick={() => handleToggle(category.id)}>
                                        {expandedCategories[category.id] ? '-' : '+'}
                                    </button>
                                </td>
                                <td>{category.nom}</td>
                                <td>{category.description}</td>
                                <td></td>
                            </tr>
                            {expandedCategories[category.id] && (
                                <>
                                    <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                        <td></td>
                                        <td style={{ paddingLeft: '40px', fontSize: 'smaller' }}>Produit</td>
                                        <td style={{ paddingLeft: '40px', fontSize: 'smaller' }}>Description</td>
                                        <td style={{ paddingLeft: '40px', fontSize: 'smaller' }}>Prix</td>
                                    </tr>
                                    {expandedCategories[category.id].map(product => (
                                        <tr key={product.id} style={{ backgroundColor: '#ffffe0', paddingLeft: '40px', fontSize: 'smaller' }}>
                                            <td></td>
                                            <td style={{ paddingLeft: '40px' }}>{product.nom}</td>
                                            <td style={{ paddingLeft: '40px' }}>{product.description}</td>
                                            <td style={{ paddingLeft: '40px' }}>{product.prix}</td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllCategorieCuisinier;
