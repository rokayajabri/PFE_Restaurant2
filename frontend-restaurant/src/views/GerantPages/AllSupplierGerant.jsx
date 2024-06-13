import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TableSortLabel
} from '@mui/material';
function AllSupplierGerant() {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('nom');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        console.log(userData); // Doit être "object"

        const headers = {
            Authorization: `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
        };

        // Set loading state
        setLoading(true);
        axios.get('http://127.0.0.1:8000/api/suppliers', { headers })
            .then(response => {
                setSuppliers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            });
    }, []);

    const deleteSupplier = async (id) => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Doit être "object"

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            // Set loading state
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8000/api/delete_supplier/${id}`, { headers });

            // Mettre à jour l'état fournisseurs en supprimant le fournisseur avec l'ID spécifié
            setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    
            // Reset loading state
            setLoading(false);
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const handleDeleteConfirmation = (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            deleteSupplier(id);
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
            const response = await axios.get(`http://127.0.0.1:8000/api/recherche_supplier?q=${searchTerm}`, { headers });
            
            // Mettre à jour l'état fournisseurs avec les résultats de la recherche
            setSuppliers(response.data);
    
            // Réinitialiser l'état de chargement
            setLoading(false);
        } catch (error) {
            console.error('Error searching for suppliers:', error);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedSuppliers = suppliers.slice().sort((a, b) => {
        if (orderBy === 'nom' || orderBy === 'prenom' || orderBy === 'email' || orderBy === 'categorie' || orderBy === 'entreprise' || orderBy === 'statut' || orderBy === 'type') {
            const valueA = a[orderBy] ? a[orderBy].toString().toLowerCase() : '';
            const valueB = b[orderBy] ? b[orderBy].toString().toLowerCase() : '';
            if (valueA < valueB) return order === 'asc' ? -1 : 1;
            if (valueA > valueB) return order === 'asc' ? 1 : -1;
            return 0;
        }
        return 0;
    });

    return (
        <div className="container">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <div className="mb-3">
                        <h5 className="card-title">
                            List of Suppliers <span className="text-muted fw-normal ms-2">({suppliers.length})</span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                        <div>
                            <Link to="/addSupplierGerant" className="add-button1">
                                <i className="bx bx-plus me-1"></i> Add Supplier
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
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'id'}
                                            direction={orderBy === 'id' ? order : 'asc'}
                                            onClick={() => handleRequestSort('id')}
                                        >
                                            Id
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'nom'}
                                            direction={orderBy === 'nom' ? order : 'asc'}
                                            onClick={() => handleRequestSort('nom')}
                                        >
                                            Nom
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'prenom'}
                                            direction={orderBy === 'prenom' ? order : 'asc'}
                                            onClick={() => handleRequestSort('prenom')}
                                        >
                                            Prénom
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'email'}
                                            direction={orderBy === 'email' ? order : 'asc'}
                                            onClick={() => handleRequestSort('email')}
                                        >
                                            Email
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'telephone'}
                                            direction={orderBy === 'telephone' ? order : 'asc'}
                                            onClick={() => handleRequestSort('telephone')}
                                        >
                                            Téléphone
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'categorie'}
                                            direction={orderBy === 'categorie' ? order : 'asc'}
                                            onClick={() => handleRequestSort('categorie')}
                                        >
                                            Catégorie
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'entreprise'}
                                            direction={orderBy === 'entreprise' ? order : 'asc'}
                                            onClick={() => handleRequestSort('entreprise')}
                                        >
                                            Entreprise
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'statut'}
                                            direction={orderBy === 'statut' ? order : 'asc'}
                                            onClick={() => handleRequestSort('statut')}
                                        >
                                            Statut
                                        </TableSortLabel>
                                    </th>
                                    <th>
                                        <TableSortLabel
                                            active={orderBy === 'type'}
                                            direction={orderBy === 'type' ? order : 'asc'}
                                            onClick={() => handleRequestSort('type')}
                                        >
                                            Type
                                        </TableSortLabel>
                                    </th>
                                    <th scope="col" style={{ width: "200px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSuppliers.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td>{supplier.id}</td>
                                        <td>{supplier.nom}</td>
                                        <td>{supplier.prenom}</td>
                                        <td>{supplier.email}</td>
                                        <td>{supplier.telephone}</td>
                                        <td>{supplier.categorie}</td>
                                        <td>{supplier.entreprise}</td>
                                        <td>{supplier.statut}</td>
                                        <td>{supplier.type}</td>
                                        <td>
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Link to={`/editSupplierGerant/${supplier.id}`} className="px-2 text-primary">
                                                        <i className="bx bx-pencil font-size-18"></i>
                                                    </Link>
                                                </li>
                                                <li className="list-inline-item">
                                                    <button onClick={() => handleDeleteConfirmation(supplier.id)} className="px-2 text-danger" style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'inherit', fontSize: 15, paddingLeft: 2 }}>
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

export default AllSupplierGerant;
