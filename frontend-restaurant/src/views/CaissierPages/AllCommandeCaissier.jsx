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
    TableSortLabel,
    Typography
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';

const AllCommandeCaissier = () => {
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
            await axios.patch(`http://127.0.0.1:8000/api/caissier/commandes/${id}/status`, { statut: newStatus }, { headers });
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

    const sortedCommandes = commandes.slice().sort((a, b) => {
        if (orderBy === 'dateCmd') {
            return order === 'asc'
                ? new Date(a.dateCmd) - new Date(b.dateCmd)
                : new Date(b.dateCmd) - new Date(a.dateCmd);
        } else if (orderBy === 'total') {
            return order === 'asc'
                ? a.total - b.total
                : b.total - a.total;
        } else if (orderBy === 'serveur') {
            const serveurA = a.serveur ? a.serveur.name : '';
            const serveurB = b.serveur ? b.serveur.name : '';
            return order === 'asc'
                ? serveurA.localeCompare(serveurB)
                : serveurB.localeCompare(serveurA);
        } else if (orderBy === 'table') {
            const tableA = a.table ? a.table.id : '';
            const tableB = b.table ? b.table.id : '';
            return order === 'asc'
                ? tableA.localeCompare(tableB)
                : tableB.localeCompare(tableA);
        } else if (orderBy === 'type') {
            return order === 'asc'
                ? a.type.localeCompare(b.type)
                : b.type.localeCompare(a.type);
        }
        return 0;
    });

    const commandesEnAttenteDePaiement = sortedCommandes.filter(commande => commande.statut === 'en attente de paiement');
    const commandesPayees = sortedCommandes.filter(commande => commande.statut === 'payée').slice(0, 10);
    const commandesAnnulees = sortedCommandes.filter(commande => commande.statut === 'annulée').slice(0, 5);

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Liste des commandes
                </Typography>
                <Button component={Link} to="/addCommandeCaissier" variant="contained" color="primary">
                    Ajouter une commande
                </Button>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Commandes en attente de paiement
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
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
                                            <TableCell>Statut</TableCell>
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
                                        {commandesEnAttenteDePaiement.map(commande => (
                                            <TableRow key={commande.id}>
                                                <TableCell>{commande.id}</TableCell>
                                                <TableCell>{commande.dateCmd}</TableCell>
                                                <TableCell>{commande.serveur ? commande.serveur.name : 'Non assigné'}</TableCell>
                                                <TableCell>{commande.table ? `Table ${commande.table.id}` : 'Aucune table'}</TableCell>
                                                <TableCell>{commande.statut}</TableCell>
                                                <TableCell>{parseFloat(commande.total).toFixed(2)}</TableCell>
                                                <TableCell>{commande.type}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleUpdateStatus(commande.id, 'payée')}
                                                        color="primary"
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<PaymentIcon />}
                                                        sx={{ padding: '6px 8px', whiteSpace: 'nowrap' }}
                                                    >
                                                        Payée
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleUpdateStatus(commande.id, 'annulée')}
                                                        color="secondary"
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ padding: '6px 8px', whiteSpace: 'nowrap' }}
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

                        <Box sx={{ my: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Les 10 dernières commandes payées
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
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
                                            <TableCell>Statut</TableCell>
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {commandesPayees.map(commande => (
                                            <TableRow key={commande.id}>
                                                <TableCell>{commande.id}</TableCell>
                                                <TableCell>{commande.dateCmd}</TableCell>
                                                <TableCell>{commande.serveur ? commande.serveur.name : 'Non assigné'}</TableCell>
                                                <TableCell>{commande.table ? `Table ${commande.table.id}` : 'Aucune table'}</TableCell>
                                                <TableCell>{commande.statut}</TableCell>
                                                <TableCell>{parseFloat(commande.total).toFixed(2)}</TableCell>
                                                <TableCell>{commande.type}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box sx={{ my: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Les 5 dernières commandes annulées
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
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
                                            <TableCell>Statut</TableCell>
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {commandesAnnulees.map(commande => (
                                            <TableRow key={commande.id}>
                                                <TableCell>{commande.id}</TableCell>
                                                <TableCell>{commande.dateCmd}</TableCell>
                                                <TableCell>{commande.serveur ? commande.serveur.name : 'Non assigné'}</TableCell>
                                                <TableCell>{commande.table ? `Table ${commande.table.id}` : 'Aucune table'}</TableCell>
                                                <TableCell>{commande.statut}</TableCell>
                                                <TableCell>{parseFloat(commande.total).toFixed(2)}</TableCell>
                                                <TableCell>{commande.type}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default AllCommandeCaissier;
