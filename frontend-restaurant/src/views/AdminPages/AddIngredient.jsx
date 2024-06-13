import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';

const AddIngredient = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        quantite_Stock: '',
        uniteMesure: '',
        seuil_Reapprovisionnement: '',
        supplier_id: ''
    });
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8001/api/suppliers', { headers });
                setSuppliers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8001/api/add_ingredients', formData, { headers });
            console.log('Ingredient added:', response.data);
            setFormData({
                nom: '',
                quantite_Stock: '',
                uniteMesure: '',
                seuil_Reapprovisionnement: '',
                supplier_id: ''
            });
            navigate("/allIngredient");
        } catch (error) {
            console.error('Error adding ingredient:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Ajouter un ingrédient
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nom"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Quantité en stock"
                            type="number"
                            id="quantite_Stock"
                            name="quantite_Stock"
                            value={formData.quantite_Stock}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Unité de mesure"
                            id="uniteMesure"
                            name="uniteMesure"
                            value={formData.uniteMesure}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Seuil de réapprovisionnement"
                            type="number"
                            id="seuil_Reapprovisionnement"
                            name="seuil_Reapprovisionnement"
                            value={formData.seuil_Reapprovisionnement}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="supplier-label">Fournisseur</InputLabel>
                            <Select
                                labelId="supplier-label"
                                id="supplier_id"
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleChange}
                            >
                                <MenuItem value="" hidden><em>Sélectionnez un fournisseur</em></MenuItem>
                                {suppliers.map(supplier => (
                                    <MenuItem key={supplier.id} value={supplier.id}>
                                        {supplier.nom} {supplier.prenom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Ajouter l\'ingrédient'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AddIngredient;
