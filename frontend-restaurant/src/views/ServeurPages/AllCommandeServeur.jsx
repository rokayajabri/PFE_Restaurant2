import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
    TableSortLabel,
    IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';

const AllCommandeServeur = () => {
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
            const response = await axios.get('http://127.0.0.1:8000/api/commandes', { headers });
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

    const handleUpdateStatus = async (id, newStatus) => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const headers = {
            Authorization: `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
        };

        try {
            await axios.patch(`http://127.0.0.1:8000/api/serveur/commandes/${id}/status`, { statut: newStatus }, { headers });
            fetchCommandes(); // Rafraîchit la liste des commandes après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la commande:', error);
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

    const statuses = ['à traiter', 'en preparation', 'prête à servir', 'en attente de paiement'];

    const filteredCommandes = commandes.filter(commande => statuses.includes(commande.statut));

    const groupedCommandes = statuses.map(status => ({
        status,
        commandes: filteredCommandes.filter(commande => commande.statut === status)
    }));

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Liste des commandes
                </Typography>
                <Button component={Link} to="/addCommandeServeur" variant="contained" color="primary">
                    Ajouter une commande
                </Button>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    groupedCommandes.map(group => (
                        <Box key={group.status} sx={{ my: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {group.status}
                            </Typography>
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
                                        {sortData(group.commandes, getComparator(order, orderBy)).map(commande => (
                                            <TableRow key={commande.id}>
                                                <TableCell>{commande.id}</TableCell>
                                                <TableCell>{commande.dateCmd}</TableCell>
                                                <TableCell>{commande.serveur ? commande.serveur.name : 'Non assigné'}</TableCell>
                                                <TableCell>{commande.table ? `Table ${commande.table.id}` : 'Aucune table'}</TableCell>
                                                <TableCell>{commande.statut}</TableCell>
                                                <TableCell>{parseFloat(commande.total).toFixed(2)}</TableCell>
                                                <TableCell>{commande.type}</TableCell>
                                                <TableCell>
                                                    {commande.statut === 'prête à servir' && (
                                                        <Button 
                                                            onClick={() => handleUpdateStatus(commande.id, 'en attente de paiement')} 
                                                            color="primary"
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<PaymentIcon />}
                                                            sx={{ padding: '6px 8px' }}
                                                        >
                                                            En attente de paiement
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => handleUpdateStatus(commande.id, 'annulée')}
                                                        color="secondary"
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ padding: '6px 8px', ml: 1 }}
                                                    >
                                                        <CancelIcon /> Annuler
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default AllCommandeServeur;
