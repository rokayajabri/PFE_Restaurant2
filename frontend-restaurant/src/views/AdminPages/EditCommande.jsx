import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCommande = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        dateCmd: '',
        id_serveur: '',
        id_table: '',
        statut: '',
        total: 0,
        detail_commande: [] 
    });
    const [serveurs, setServeurs] = useState([]);
    const [tables, setTables] = useState([]);
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        const fetchCommandeDetails = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
    
                setLoading(true);
                const [serveursRes, tablesRes, produitsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8001/api/users/serveurs', { headers }),
                    axios.get('http://127.0.0.1:8001/api/tables', { headers }),
                    axios.get('http://127.0.0.1:8001/api/produits', { headers })
                ]);
                const commandeRes = await axios.get(`http://127.0.0.1:8001/api/show_commandes/${id}`, { headers });
                setFormData(commandeRes.data);
                setLoading(false);

                setServeurs(serveursRes.data);
                setTables(tablesRes.data);
                setProduits(produitsRes.data);

            } catch (error) {
                console.error('Error fetching commande details:', error);
                setLoading(false);
            }
        };

        fetchCommandeDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addDetail = () => {
        if (produits.length > 0) {
            const newDetail = {
                id_Produit: produits[0].id,
                quantite: 1,
                prix_un: produits[0].prix
            };
            setFormData({ ...formData, detail_commande: [...formData.detail_commande, newDetail] });
            recalculateTotal([...formData.detail_commande, newDetail]);
        } else {
            console.error('No products available');
        }
    };

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...formData.detail_commande];
        updatedDetails[index][field] = value;

        if (field === 'id_Produit') {
            const selectedProduct = produits.find(produit => produit.id === parseInt(value));
            if (selectedProduct) {
                updatedDetails[index].prix_un = selectedProduct.prix;
            }
        }

        setFormData({ ...formData, detail_commande: updatedDetails });
        
        // Recalculate total when the quantity, price, or product changes
        if (field === 'quantite' || field === 'prix_un' || field === 'id_Produit') {
            recalculateTotal(updatedDetails);
        }
    };

    const recalculateTotal = (details) => {
        const total = details.reduce((sum, detail) => {
            return sum + (detail.quantite * detail.prix_un);
        }, 0);
        setFormData(prevFormData => ({ ...prevFormData, total }));
    };

    const removeDetail = (index) => {
        const updatedDetails = formData.detail_commande.filter((_, idx) => idx !== index);
        setFormData({ ...formData, detail_commande: updatedDetails });
        recalculateTotal(updatedDetails);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            const dataToSend = {
                dateCmd: formData.dateCmd,
                id_serveur: formData.id_serveur,
                id_table: formData.id_table,
                statut: formData.statut,
                total: formData.total,
                details: formData.detail_commande.map(detail_commande => ({
                    id: detail_commande.id,
                    id_Produit: detail_commande.id_Produit,
                    quantite: detail_commande.quantite,
                    prix_un: detail_commande.prix_un
                }))
            };
            console.log('Data to send:', dataToSend); // Logging to see what is being sent
            setLoading(true);
            await axios.put(`http://127.0.0.1:8001/api/edit_commandes/${id}`, dataToSend, { headers });
            console.log('Commande updated successfully!');
            navigate("/commandes");
            setLoading(false);
        } catch (error) {
            console.error('Error updating commande:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            {console.log("body:", formData.detail_commande)}

            <h2>Edit Commande</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="dateCmd">Date et Heure:</label>
                    <input type="datetime-local" id="dateCmd" name="dateCmd" value={formData.dateCmd} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="id_serveur">Serveur:</label>
                    <select id="id_serveur" name="id_serveur" value={formData.id_serveur} onChange={handleChange}>
                        {serveurs.map(serveur => (
                            <option key={serveur.id} value={serveur.id}>{serveur.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="id_table">Table:</label>
                    <select id="id_table" name="id_table" value={formData.id_table} onChange={handleChange}>
                        {tables.map(table => (
                            <option key={table.id} value={table.id}>{table.id}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="statut">Statut:</label>
                    <select id="statut" name="statut" value={formData.statut} onChange={handleChange}>
                        <option value="à traiter">À traiter</option>
                        <option value="en preparation">En préparation</option>
                        <option value="prête à servir">Prête à servir</option>
                        <option value="en attente de paiement">En attente de paiement</option>
                        <option value="payée">Payée</option>
                        <option value="annulée">Annulée</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="total">Total (€):</label>
                    <input type="number" id="total" name="total" value={formData.total} onChange={handleChange} />
                </div>
                <div>
                    <h4>Détails de la commande</h4>
                    {formData.detail_commande && formData.detail_commande.length > 0 ? (
                        formData.detail_commande.map((detail, index) => (
                            <div key={index}>
                                <select name="id_Produit" value={detail.id_Produit} onChange={(e) => handleDetailChange(index, 'id_Produit', e.target.value)}>
                                    {produits.map(produit => (
                                        <option key={produit.id} value={produit.id}>{produit.nom}</option>
                                    ))}
                                </select>
                                <input type="number" name="quantite" value={detail.quantite} onChange={(e) => handleDetailChange(index, 'quantite', e.target.value)} />
                                <input type="number" name="prix_un" value={detail.prix_un} onChange={(e) => handleDetailChange(index, 'prix_un', e.target.value)} />
                                <button type="button" onClick={() => removeDetail(index)}>Retirer</button>
                            </div>
                        ))
                    ) : (
                        <p>Aucun détail de commande</p>
                    )}
                    <button type="button" onClick={addDetail}>Ajouter Détail</button>
                </div>
                <button type="submit">Mettre à jour la commande</button>
            </form>
        </div>
    );
};

export default EditCommande;
