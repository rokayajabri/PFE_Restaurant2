import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';

const AddCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        image: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'multipart/form-data',
            };

            const data = new FormData();
            data.append('nom', formData.nom);
            data.append('description', formData.description);
            if (formData.image) {
                data.append('image', formData.image);
            }

            setLoading(true);
            await axios.post('http://127.0.0.1:8001/api/add_categories', data, { headers });
            console.log('Catégorie ajoutée avec succès !');
            navigate("/allCategory");
            setFormData({
                nom: '',
                description: '',
                image: null,
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie :', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Ajouter une catégorie
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ my: 2 }}
                        >
                            Télécharger une image
                            <input
                                type="file"
                                id="image"
                                name="image"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Ajouter la catégorie'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AddCategory;
