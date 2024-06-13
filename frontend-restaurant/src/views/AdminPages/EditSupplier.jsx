import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    Grid,
    Alert
} from '@mui/material';

const EditSupplier = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        categorie: '',  // Nouveau champ
        entreprise: '', // Nouveau champ
        statut: '',
        type: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));

                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8001/api/suppliers/${id}`, { headers });
                const supplier = response.data;

                setFormData({
                    nom: supplier.nom,
                    prenom: supplier.prenom,
                    email: supplier.email,
                    telephone: supplier.telephone,
                    categorie: supplier.categorie,  // Nouveau champ
                    entreprise: supplier.entreprise, // Nouveau champ
                    statut: supplier.statut,
                    type: supplier.type
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching supplier data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
            await axios.put(`http://127.0.0.1:8001/api/edit_supplier/${id}`, formData, { headers });
            console.log('Supplier updated successfully!');
            navigate("/allSuppliers");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error updating supplier:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit fournisseur
            </Typography>
            {Object.keys(errors).length > 0 && (
                <Alert severity="error">
                    {Object.values(errors).flat().map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </Alert>
            )}
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
                            error={!!errors.nom}
                            helperText={errors.nom}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Prénom"
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.prenom}
                            helperText={errors.prenom}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Téléphone"
                            id="telephone"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.telephone}
                            helperText={errors.telephone}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Catégorie"
                            id="categorie"
                            name="categorie"
                            value={formData.categorie}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.categorie}
                            helperText={errors.categorie}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Entreprise"
                            id="entreprise"
                            name="entreprise"
                            value={formData.entreprise}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.entreprise}
                            helperText={errors.entreprise}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" error={!!errors.statut}>
                            <InputLabel id="statut-label">Statut</InputLabel>
                            <Select
                                labelId="statut-label"
                                id="statut"
                                name="statut"
                                value={formData.statut}
                                onChange={handleChange}
                            >
                                <MenuItem value="" hidden><em>Sélectionnez un statut</em></MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="non active">Non Active</MenuItem>
                            </Select>
                            {errors.statut && <p>{errors.statut}</p>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" error={!!errors.type}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <MenuItem value="" hidden><em>Sélectionnez un type</em></MenuItem>
                                <MenuItem value="local">Local</MenuItem>
                                <MenuItem value="international">International</MenuItem>
                            </Select>
                            {errors.type && <p>{errors.type}</p>}
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
                            {loading ? <CircularProgress size={24} /> : 'Editer le fournisseur'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default EditSupplier;
