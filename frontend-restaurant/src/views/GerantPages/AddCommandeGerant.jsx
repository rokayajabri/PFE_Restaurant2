import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    TextField,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AddCommandeGerant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [commandeData, setCommandeData] = useState({
        dateTimeCmd: '',
        statut: '',
        total: 0,
        idServeur: '',
        idTable: '',
        type: 'sur place',
        details: []
    });
    const [produits, setProduits] = useState([]);
    const [tables, setTables] = useState([]);
    const [serveurs, setServeurs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
            setLoading(true);
            const [prodResponse, tableResponse, servResponse, catResponse] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/produits', { headers }),
                axios.get('http://127.0.0.1:8000/api/tables', { headers }),
                axios.get('http://127.0.0.1:8000/api/users/serveurs', { headers }),
                axios.get('http://127.0.0.1:8000/api/categories', { headers })
            ]);
            setProduits(prodResponse.data);
            setTables(tableResponse.data);
            setServeurs(servResponse.data);
            setCategories(catResponse.data);

            // Définir les valeurs par défaut pour les serveurs et les tables
            setCommandeData(prev => ({
                ...prev,
                idServeur: servResponse.data[0]?.id.toString(),
                idTable: tableResponse.data[0]?.id.toString(),
                dateTimeCmd: new Date().toISOString().substring(0, 16)
            }));

            setLoading(false);
        };
        fetchInitialData();
    }, []);

    const handleDetailChange = (index, field, value) => {
        let updatedDetails = [...commandeData.details];
        if (field === 'idProduit') {
            const selectedProduct = produits.find(p => p.id.toString() === value);
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
                prix_un: selectedProduct ? selectedProduct.prix : updatedDetails[index].prix_un
            };
        } else {
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
        }

        setCommandeData(prevState => ({
            ...prevState,
            details: updatedDetails
        }));

        updateTotal(updatedDetails);
    };

    const addDetailLine = (produit) => {
        setCommandeData({
            ...commandeData,
            details: [...commandeData.details, { idProduit: produit.id.toString(), quantite: 1, prix_un: produit.prix }]
        });
        updateTotal([...commandeData.details, { idProduit: produit.id.toString(), quantite: 1, prix_un: produit.prix }]);
    };

    const updateTotal = (details) => {
        const total = details.reduce((acc, detail) => acc + (parseFloat(detail.prix_un) * parseFloat(detail.quantite || 0)), 0);
        setCommandeData(prevState => ({
            ...prevState,
            total: total.toFixed(2)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setWarning('');

        const userData = JSON.parse(localStorage.getItem("user"));
        const headers = {
            Authorization: `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
        };

        const dataToSend = {
            ...commandeData,
            id_serveur: commandeData.idServeur,
            id_table: commandeData.type === 'sur place' ? commandeData.idTable : null,
            details: commandeData.details.map(detail => ({
                idProduit: detail.idProduit,
                quantite: detail.quantite,
                prix_un: detail.prix_un
            }))
        };

        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/gerant/add_commandes', dataToSend, { headers });
            console.log('Commande ajoutée avec succès!');
            if (response.data.warning) {
                setWarning(response.data.warning);
            }
            setLoading(false);
            navigate("/allCommandeGerant");
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la commande:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Erreur lors de l\'ajout de la commande');
            }
            setLoading(false);
        }
    };

    const getProductsByCategory = (categoryId) => {
        return produits.filter(produit => produit.id_Categorie === parseInt(categoryId));
    };

    const handleCategoryClick = (categoryId) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory('');
        } else {
            setSelectedCategory(categoryId);
        }
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setCommandeData(prev => ({
            ...prev,
            type: type,
            idTable: type === 'à emporter' ? '' : prev.idTable
        }));
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ajouter une commande
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {warning && <Alert severity="warning">{warning}</Alert>}
                {loading ? <p>Loading...</p> : (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="idTable-label">Table</InputLabel>
                                    <Select
                                        labelId="idTable-label"
                                        id="idTable"
                                        name="idTable"
                                        value={commandeData.idTable}
                                        onChange={(e) => setCommandeData({ ...commandeData, idTable: e.target.value })}
                                        disabled={commandeData.type === 'à emporter'}
                                    >
                                        {tables.map(table => (
                                            <MenuItem key={table.id} value={table.id}>Table {table.id}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="idServeur-label">Serveur</InputLabel>
                                    <Select
                                        labelId="idServeur-label"
                                        id="idServeur"
                                        name="idServeur"
                                        value={commandeData.idServeur}
                                        onChange={(e) => setCommandeData({ ...commandeData, idServeur: e.target.value })}
                                    >
                                        {serveurs.map(serveur => (
                                            <MenuItem key={serveur.id} value={serveur.id}>{serveur.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Date et Heure"
                                    type="datetime-local"
                                    id="dateTimeCmd"
                                    name="dateTimeCmd"
                                    value={commandeData.dateTimeCmd}
                                    onChange={(e) => setCommandeData({ ...commandeData, dateTimeCmd: e.target.value })}
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="statut-label">Statut</InputLabel>
                                    <Select
                                        labelId="statut-label"
                                        id="statut"
                                        name="statut"
                                        value={commandeData.statut}
                                        onChange={(e) => setCommandeData({ ...commandeData, statut: e.target.value })}
                                    >
                                        <MenuItem value="">Sélectionnez un statut</MenuItem>
                                        <MenuItem value="à traiter">À traiter</MenuItem>
                                        <MenuItem value="en preparation">En préparation</MenuItem>
                                        <MenuItem value="prête à servir">Prête à servir</MenuItem>
                                        <MenuItem value="en attente de paiement">En attente de paiement</MenuItem>
                                        <MenuItem value="payée">Payée</MenuItem>
                                        <MenuItem value="annulée">Annulée</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <RadioGroup
                                        name="type"
                                        value={commandeData.type}
                                        onChange={handleTypeChange}
                                    >
                                        <FormControlLabel value="sur place" control={<Radio />} label="Sur Place" />
                                        <FormControlLabel value="à emporter" control={<Radio />} label="À Emporter" />
                                    </RadioGroup>
                                </FormControl>
                                <Typography variant="h6" sx={{ marginTop: 2 }}>
                                    Catégories
                                </Typography>
                                <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                                    {categories.map(category => (
                                        <Grid item xs={6} sm={4} md={3} key={category.id}>
                                            <Paper
                                                sx={{
                                                    padding: 2,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    backgroundColor: selectedCategory === category.id ? '#ddd' : '#f5f5f5',
                                                    '&:hover': {
                                                        backgroundColor: '#ddd',
                                                    },
                                                    border: selectedCategory === category.id ? '2px solid #1976d2' : '2px solid transparent',
                                                    marginBottom: 2
                                                }}
                                                onClick={() => handleCategoryClick(category.id)}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    setSelectedCategory('');
                                                }}
                                            >
                                                <Box sx={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <img src={`http://127.0.0.1:8000/${category.image}`} alt={category.nom} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                </Box>
                                                <Typography variant="subtitle1">{category.nom}</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                    Produits
                                </Typography>
                                <Grid container spacing={2}>
                                    {selectedCategory && getProductsByCategory(selectedCategory).map(produit => (
                                        <Grid item xs={6} sm={4} md={3} key={produit.id}>
                                            <Paper
                                                sx={{
                                                    padding: 2,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    backgroundColor: '#f5f5f5',
                                                    '&:hover': {
                                                        backgroundColor: '#ddd',
                                                    },
                                                    height: '100%'
                                                }}
                                                onClick={() => addDetailLine(produit)}
                                            >
                                                <Box sx={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <img src={`http://127.0.0.1:8000/${produit.image}`} alt={produit.nom} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                </Box>
                                                <Typography variant="subtitle1">{produit.nom}</Typography>
                                                <Typography variant="subtitle2">{produit.prix} €</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Détails de la commande
                                    </Typography>
                                    <List>
                                        {commandeData.details.map((detail, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={produits.find(p => p.id.toString() === detail.idProduit)?.nom}
                                                    secondary={`Quantité: ${detail.quantite}, Prix unitaire: ${detail.prix_un} €`}
                                                />
                                                <TextField
                                                    type="number"
                                                    name="quantite"
                                                    value={detail.quantite}
                                                    onChange={(e) => handleDetailChange(index, 'quantite', e.target.value)}
                                                    inputProps={{ min: 1 }}
                                                    sx={{ width: 80, marginRight: 2 }}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" onClick={() => {
                                                        let updatedDetails = [...commandeData.details];
                                                        updatedDetails.splice(index, 1);
                                                        setCommandeData({
                                                            ...commandeData,
                                                            details: updatedDetails
                                                        });
                                                        updateTotal(updatedDetails);
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Box mt={2}>
                                        <Typography variant="h6">Total: {commandeData.total} €</Typography>
                                        <TextField
                                            fullWidth
                                            label="Total"
                                            type="number"
                                            id="total"
                                            name="total"
                                            value={commandeData.total}
                                            onChange={(e) => setCommandeData({ ...commandeData, total: parseFloat(e.target.value) })}
                                            margin="normal"
                                        />
                                    </Box>
                                    <Box mt={2}>
                                        <Button type="submit" variant="contained" color="primary" fullWidth>
                                            Soumettre
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Box>
        </Container>
    );
};

export default AddCommandeGerant;
