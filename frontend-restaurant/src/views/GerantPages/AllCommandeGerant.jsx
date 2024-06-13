import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AllCommandeGerant = () => {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('dateCmd');

    const fetchCommandes = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/gerant/commandes', { headers });
            setCommandes(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching commandes:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommandes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this commande?')) {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                setLoading(true);
                await axios.delete(`http://127.0.0.1:8000/api/gerant/delete_commandes/${id}`, { headers });
                setCommandes(prevCommandes => prevCommandes.filter(commande => commande.id !== id));
                setLoading(false);
            } catch (error) {
                console.error("Error deleting commande:", error);
                setLoading(false);
            }
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const descendingComparator = (a, b, orderBy) => {
        if (orderBy === 'serveur') {
            if (!a.serveur || !b.serveur) {
                return a.serveur ? -1 : 1;
            }
            return a.serveur.name.localeCompare(b.serveur.name);
        } else if (orderBy === 'table') {
            if (!a.table || !b.table) {
                return a.table ? -1 : 1;
            }
            return a.table.id - b.table.id;
        } else if (orderBy === 'total') {
            return parseFloat(a.total) - parseFloat(b.total);
        } else if (orderBy === 'type') {
            return a.type.localeCompare(b.type);
        } else {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
        }
        return 0;
    };

    const sortData = (data, comparator) => {
        return data.sort(comparator);
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Liste des commandes
                </Typography>
                <Button component={Link} to="/addCommandeGerant" variant="contained" color="primary" sx={{ mb: 2 }}>
                    Ajouter une commande
                </Button>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'id'}
                                            direction={orderBy === 'id' ? order : 'asc'}
                                            onClick={() => handleRequestSort('id')}
                                        >
                                            ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'dateCmd'}
                                            direction={orderBy === 'dateCmd' ? order : 'asc'}
                                            onClick={() => handleRequestSort('dateCmd')}
                                        >
                                            Date
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'serveur'}
                                            direction={orderBy === 'serveur' ? order : 'asc'}
                                            onClick={() => handleRequestSort('serveur')}
                                        >
                                            Serveur
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'table'}
                                            direction={orderBy === 'table' ? order : 'asc'}
                                            onClick={() => handleRequestSort('table')}
                                        >
                                            Table
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'statut'}
                                            direction={orderBy === 'statut' ? order : 'asc'}
                                            onClick={() => handleRequestSort('statut')}
                                        >
                                            Statut
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'total'}
                                            direction={orderBy === 'total' ? order : 'asc'}
                                            onClick={() => handleRequestSort('total')}
                                        >
                                            Total
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'type'}
                                            direction={orderBy === 'type' ? order : 'asc'}
                                            onClick={() => handleRequestSort('type')}
                                        >
                                            Type
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortData(commandes, getComparator(order, orderBy)).map(commande => (
                                    <TableRow key={commande.id}>
                                        <TableCell>{commande.id}</TableCell>
                                        <TableCell>{commande.dateCmd}</TableCell>
                                        <TableCell>{commande.serveur ? commande.serveur.name : 'Non assigné'}</TableCell>
                                        <TableCell>{commande.table ? `Table ${commande.table.id}` : 'Aucune table'}</TableCell>
                                        <TableCell>{commande.statut}</TableCell>
                                        <TableCell>{parseFloat(commande.total).toFixed(2)}</TableCell>
                                        <TableCell>{commande.type}</TableCell>
                                        <TableCell>
                                            <IconButton component={Link} to={`/editCommandeGerant/${commande.id}`} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(commande.id)} color="secondary">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default AllCommandeGerant;
