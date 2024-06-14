import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';


const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            // Set loading state
            setLoading(true);
            const response = await axios.get("http://127.0.0.1:8000/api/users", { headers });
            console.log(response.data)
            setUsers(response.data ||[]);
            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            // Set loading state
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8000/api/delete_users/${id}`, { headers });

            // Mettre à jour l'état produits en supprimant le produit avec l'ID spécifié
            setUsers(users.filter(user => user.id !== id));

            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handleDeleteConfirmation = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
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
            const response = await axios.get(`http://127.0.0.1:8000/api/recherche_user?q=${searchTerm}`, { headers });

            // Mettre à jour l'état produits avec les résultats de la recherche
            setUsers(response.data|| []);

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
                            List of Users <span className="text-muted fw-normal ms-2">({users.length})</span>                            </h5>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                        <div>
                            <Link to="/addUser" data-bs-toggle="modal"
                                data-bs-target=".add-new"
                                className="add-button1">
                                <i className="bx bx-plus me-1"></i> Add User
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

                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Status</th>
                                    <th>Telephone</th>
                                    
                                    <th scope="col" style={{ width: "200px" }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (

                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            <img src={`http://127.0.0.1:8000${user.image}`} alt={user.name} className="avatar-sm rounded-circle me-2" />
                                        </td>

                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>{user.role}</td>
                                        <td>{user.age}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.statut}</td>

                                        <td>{user.phone}</td>
                                        <td>
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Link to={`/editUser/${user.id}`} href="javascript:void(0);"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Edit"
                                                        className="px-2 text-primary">
                                                        <i className="bx bx-pencil font-size-18"></i></Link>

                                                </li>
                                                <li className="list-inline-item">
                                                    <button onClick={() => handleDeleteConfirmation(user.id)} href="javascript:void(0);"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Delete"
                                                        className="px-2 text-danger"
                                                        style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit', fontSize: 15, paddingLeft: 2 }}
                                                    ><i className="bx bx-trash-alt font-size-18"></i></button>

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
};

export default AllUser;
