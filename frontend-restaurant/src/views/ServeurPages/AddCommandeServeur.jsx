import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AddCommandeServeur = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');
    const [commandeData, setCommandeData] = useState({
        dateTimeCmd: '',
        total: 0,
        idTable: '',
        type: 'sur place',
        details: []
    });
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
            setLoading(true);
            const [prodResponse, tableResponse, catResponse] = await Promise.all([
                axios.get('http://127.0.0.1:8001/api/produits', { headers }),
                axios.get('http://127.0.0.1:8001/api/tables', { headers }),
                axios.get('http://127.0.0.1:8001/api/categories', { headers })
            ]);
            setProduits(prodResponse.data);
            setTables(tableResponse.data);
            setCategories(catResponse.data);
            setCommandeData(prev => ({
                ...prev,
                dateTimeCmd: new Date().toISOString().substring(0, 16),
                idTable: tableResponse.data[0]?.id.toString()
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

    const handleTypeChange = (e) => {
        const { value } = e.target;
        setCommandeData(prevState => ({
            ...prevState,
            type: value,
            idTable: value === 'à emporter' ? '' : prevState.idTable
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
            id_serveur: userData.id,
            id_table: commandeData.type === 'à emporter' ? null : commandeData.idTable,
            details: commandeData.details.map(detail => ({
                idProduit: detail.idProduit,
                quantite: detail.quantite,
                prix_un: detail.prix_un
            }))
        };

        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8001/api/serveur/add_commandes', dataToSend, { headers });
            if (response.data.warning) {
                setWarning(response.data.warning);
            }
            console.log('Commande ajoutée avec succès!');
            setLoading(false);
            navigate("/allCommandeServeur");
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la commande:', error);
            setError(error.response?.data?.error || 'Erreur lors de l\'ajout de la commande');
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
                                    <FormLabel>Type de commande</FormLabel>
                                    <RadioGroup
                                        row
                                        name="type"
                                        value={commandeData.type}
                                        onChange={handleTypeChange}
                                    >
                                        <FormControlLabel value="sur place" control={<Radio />} label="Sur place" />
                                        <FormControlLabel value="à emporter" control={<Radio />} label="À emporter" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControl fullWidth margin="normal" disabled={commandeData.type === 'à emporter'}>
                                    <InputLabel id="idTable-label">Table</InputLabel>
                                    <Select
                                        labelId="idTable-label"
                                        id="idTable"
                                        name="idTable"
                                        value={commandeData.idTable}
                                        onChange={(e) => setCommandeData({ ...commandeData, idTable: e.target.value })}
                                    >
                                        {tables.map(table => (
                                            <MenuItem key={table.id} value={table.id}>Table {table.id}</MenuItem>
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
                                    onChange={() => { }}
                                    disabled
                                    margin="normal"
                                />
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
                                                    <img src={`http://127.0.0.1:8001/${category.image}`} alt={category.nom} style={{ maxWidth: '100%', maxHeight: '100%' }} />
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
                                                    <img src={`http://127.0.0.1:8001/${produit.image}`} alt={produit.nom} style={{ maxWidth: '100%', maxHeight: '100%' }} />
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

export default AddCommandeServeur;
