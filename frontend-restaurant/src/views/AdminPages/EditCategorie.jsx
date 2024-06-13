import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Récupère l'ID de la catégorie depuis l'URL
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        image: null,
    });
    const [currentImage, setCurrentImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // État pour la prévisualisation de l'image

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));

                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };

                // Set loading state
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8001/api/categories/${id}`, { headers }); // Récupère les détails de la catégorie à modifier
                const categoryData = response.data;
                setFormData({
                    nom: categoryData.nom,
                    description: categoryData.description,
                    image: null, // L'image n'est pas nécessairement chargée ici
                });
                setCurrentImage(categoryData.image); // Enregistre l'image actuelle
                setLoading(false);
            } catch (error) {
                console.error('Error fetching category:', error);
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });

        // Lire le fichier pour la prévisualisation
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
            };

            // Créer un objet FormData pour envoyer les données avec le fichier image
            const data = new FormData();
            data.append('nom', formData.nom);
            data.append('description', formData.description);
            if (formData.image) {
                data.append('image', formData.image);
            }

            setLoading(true);
            await axios.put(`http://127.0.0.1:8001/api/edit_categories/${id}`, data, { headers });
            console.log('edit categ successfull!');
            navigate("/allCategory");
            setLoading(false);
        } catch (error) {
            console.error('Error updating category:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Modifier une catégorie
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
                            required
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
                        <Typography variant="h6" component="h2" gutterBottom>
                            Image actuelle
                        </Typography>
                        {currentImage && !previewImage && (
                            <div>
                                <img src={`http://127.0.0.1:8001/${currentImage}`} alt="Current" width="100" />
                            </div>
                        )}
                        {previewImage && (
                            <div>
                                <img src={previewImage} alt="Preview" width="100" />
                            </div>
                        )}
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ my: 2 }}
                        >
                            Télécharger une nouvelle image
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
                            {loading ? <CircularProgress size={24} /> : 'Sauvegarder les modifications'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default EditCategory;
