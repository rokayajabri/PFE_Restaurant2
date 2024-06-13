import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductsByCategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData);

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/categories/${id}/products`, { headers });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [id]);

    return (
        <div>
            <div class="heading">
                <span>Menu</span>
                <h3 className='plate'>Produits par catégorie</h3>
            </div>  

            <div className="list">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid-container">
                        {products.map(product => (
                            <div key={product.id} className="card">
                                <div className="image-container">
                                    <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.nom} />
                                    <h3 className="card-title">{product.nom}</h3>
                                </div>
                                <div className="card-content">
                                    <p className="description">{product.description}</p>
                                    <div className="price-and-icons">
                                        <span className="price">{product.prix}€</span>
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

export default ProductsByCategory;
