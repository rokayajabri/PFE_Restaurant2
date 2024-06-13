import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditIngredient = () => {
    const { id } = useParams();
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
        const fetchIngredientAndSuppliers = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData) {
                    console.error('User data not found in localStorage');
                    return;
                }
            
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                const [ingredientResponse, suppliersResponse] = await Promise.all([
                    axios.get(`http://127.0.0.1:8001/api/ingredients/${id}`, { headers }),
                    axios.get('http://127.0.0.1:8001/api/suppliers', { headers })
                ]);

                setFormData(ingredientResponse.data);
                setSuppliers(suppliersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchIngredientAndSuppliers();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData) {
                console.error('User data not found in localStorage');
                return;
            }
        
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            await axios.put(`http://127.0.0.1:8001/api/edit_ingredients/${id}`, formData, { headers });
            console.log('Ingredient updated successfully!');
            setLoading(false);
            navigate("/allIngredient");
        } catch (error) {
            console.error('Error updating ingredient:', error);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Modifier l'ingrédient
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
                            {loading ? <CircularProgress size={24} /> : 'Mettre à jour l\'ingrédient'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default EditIngredient;
