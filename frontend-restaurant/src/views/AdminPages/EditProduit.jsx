import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    Alert
} from '@mui/material';

const EditProduit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        id_Categorie: '',
        image: null,
    });

    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState({});
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
                const [categoriesResponse, ingredientsResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/categories', { headers }),
                    axios.get('http://127.0.0.1:8000/api/ingredients', { headers })
                ]);

                setCategories(categoriesResponse.data);
                setIngredients(ingredientsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleIngredientChange = (ingredient) => {
        const updatedSelectedIngredients = { ...selectedIngredients };
        if (updatedSelectedIngredients[ingredient.id]) {
            delete updatedSelectedIngredients[ingredient.id];
        } else {
            updatedSelectedIngredients[ingredient.id] = { ...ingredient, quantite: 1 };
        }

        setSelectedIngredients(updatedSelectedIngredients);
        setFormData({ 
            ...formData, 
            description: Object.values(updatedSelectedIngredients).map((i) => i.nom).join(', ') 
        });
    };

    const handleQuantityChange = (ingredientId, quantity) => {
        const updatedSelectedIngredients = { ...selectedIngredients };
        if (updatedSelectedIngredients[ingredientId]) {
            updatedSelectedIngredients[ingredientId].quantite = quantity;
        }

        setSelectedIngredients(updatedSelectedIngredients);
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
            data.append('prix', formData.prix);
            data.append('id_Categorie', formData.id_Categorie);
            if (formData.image) {
                data.append('image', formData.image);
            }
            data.append('ingredients', JSON.stringify(selectedIngredients));
    
            setLoading(true);
            await axios.put(`http://127.0.0.1:8000/api/edit_produits/${id}`, data, { headers });
            console.log('Produit modifié avec succès !');
            navigate("/allProduit");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Erreur lors de la modification du produit :', error);
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit produit
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
                            label="Prix"
                            type="number"
                            id="prix"
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            margin="normal"
                            error={!!errors.prix}
                            helperText={errors.prix}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal" error={!!errors.id_Categorie}>
                            <InputLabel id="id_Categorie-label">Catégorie</InputLabel>
                            <Select
                                labelId="id_Categorie-label"
                                id="id_Categorie"
                                name="id_Categorie"
                                value={formData.id_Categorie}
                                onChange={handleChange}
                            >
                                <MenuItem value="" hidden><em>Sélectionnez une catégorie</em></MenuItem>
                                {categories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>{category.nom}</MenuItem>
                                ))}
                            </Select>
                            {errors.id_Categorie && <p>{errors.id_Categorie}</p>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Ingrédients
                        </Typography>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                {ingredients.map((ingredient) => (
                                    <Grid item xs={12} sm={6} md={4} key={ingredient.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={!!selectedIngredients[ingredient.id]}
                                                    onChange={() => handleIngredientChange(ingredient)}
                                                    name={ingredient.nom}
                                                />
                                            }
                                            label={`${ingredient.nom} (${ingredient.uniteMesure})`}
                                        />
                                        {selectedIngredients[ingredient.id] && (
                                            <TextField
                                                type="number"
                                                label="Quantité"
                                                value={selectedIngredients[ingredient.id].quantite}
                                                onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                                margin="normal"
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: <span>{ingredient.uniteMesure}</span>
                                                }}
                                                error={!!errors[`ingredients.${ingredient.id}.quantite`]}
                                                helperText={errors[`ingredients.${ingredient.id}.quantite`]}
                                            />
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
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
                            {loading ? <CircularProgress size={24} /> : 'Edit le produit'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default EditProduit;
