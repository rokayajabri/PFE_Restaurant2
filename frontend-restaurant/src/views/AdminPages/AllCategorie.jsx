import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

const AllCategorie = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            // Set loading state
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/categories', { headers });
            setCategories(response.data);
            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategorie = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            // Set loading state
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8000/api/delete_categories/${id}`, { headers });

            // Mettre à jour l'état categories en supprimant la catégorie avec l'ID spécifié
            setCategories(categories.filter(category => category.id !== id));

            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteConfirmation = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategorie(id);  // Assurez-vous que le nom de la fonction ici est correct
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
            const response = await axios.get(`http://127.0.0.1:8000/api/recherche_categorie?q=${e.target.value}`, { headers });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for categories.');
            setLoading(false);
        }
    };

    const handleViewProducts = (categoryId) => {
        navigate(`/categories/${categoryId}/products`);
    };

    return (
        <div>
        <div className="button-container">
           <Link to="/addCategory" className="add-button">
               <i className='bx bx-plus' style={{ marginRight: '5px' }}></i>
               Add Category
           </Link>
       </div>
        <div class="heading">
           <span>Menu</span>
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
           {categories.length === 0 ? (
               <h1>Liste des categories est vide</h1>
           ) : (
               <div className="grid-container">
                   {categories.map(category => (
                       <div key={category.id} className="card">
                           
                           <div className="image-container">
                               <img src={`http://127.0.0.1:8000/${category.image}`} alt={category.nom} />
                               <h3 className="card-title">{category.nom}</h3>
                           </div>
                           <div className="card-content">
                               <p className="description">{category.description}</p>
                               <div className="price-and-icons">
                                   
                                   <ul className="icon-list">
                                       <li className="list-inline-item">
                                           <Link to={`/editCategory/${category.id}`}
                                               data-bs-toggle="tooltip"
                                               data-bs-placement="top"
                                               title="Edit"
                                               className="text-primary">
                                               <i className="bx bxs-edit font-size-18"></i>
                                           </Link>
                                       </li>
                                       <li className="list-inline-item">
                                           <button onClick={() => handleDeleteConfirmation(category.id)}
                                               data-bs-toggle="tooltip"
                                               data-bs-placement="top"
                                               title="Delete"
                                               className="text-danger"
                                               style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit', fontSize: 15 }}>
                                               <i className="bx bxs-trash font-size-18"></i>
                                           </button>
                                       </li>

                                       <li className="list-inline-item">
                                                <button onClick={() => handleViewProducts(category.id)}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title="View Products"
                                                    className="text-info"
                                                    style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit', fontSize: 15 }}>
                                                    <i className="bx bxs-show font-size-18"></i>
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

export default AllCategorie;
