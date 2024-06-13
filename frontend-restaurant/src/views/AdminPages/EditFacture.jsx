import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

const EditFacture = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Récupérer l'ID du produit depuis les paramètres de l'URL
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_Commande: '',
        montant_total: '',
        datePaiement: '',
        statut: '', // Changer la valeur initiale en fonction de vos besoins
    });

    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                console.log(userData); // Assurez-vous que userData est bien défini
        
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
        
                // Set loading state
                setLoading(true);

                const response = await axios.get(`http://127.0.0.1:8000/api/factures/${id}`,{headers}); 
                const factureData = response.data;
                setFormData({
                    id_Commande: factureData.id_Commande,
                    montant_total: factureData.montant_total,
                    datePaiement: factureData.datePaiement,
                    statut: factureData.statut,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching facture details:', error);
            }
        };

        const fetchCommandes = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                console.log(userData); // Assurez-vous que userData est bien défini
        
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
    
            // Set loading state
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/commandes',{headers});
                setCommandes(response.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching commandes:', error);
            }
        };

        fetchFactures();
        fetchCommandes();
    }, [id]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const selectedCommande = commandes.find(commande => commande.id === parseInt(value));
         if (selectedCommande) {
             setFormData(prevState => ({
                 ...prevState,
                 montant_total: selectedCommande.total
             }));
         }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
                console.log(userData); // Assurez-vous que userData est bien défini
        
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
    
            // Set loading state
            setLoading(true);

            await axios.put(`http://127.0.0.1:8000/api/edit_facture/${id}`, formData,{headers}); // Envoyer une requête PUT pour mettre à jour les détails du produit
            console.log('Facture mis à jour avec succès !');
            navigate("/factures");
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du facture :', error);
        }
    };

    return (
        <div><h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="id_Commande">ID Commande:</label>
                <select id="id_Commande" name="id_Commande" value={formData.id_Commande} onChange={handleChange}>
                    <option value="" hidden>Sélectionnez une commande</option>
                    {commandes.map(commande => (
                        <option key={commande.id} value={commande.id}>{commande.id}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Montant Total:</label>
                <input type="text" name="montant_total" value={formData.montant_total} onChange={handleChange} />
            </div>
            <div>
                <label>Date de Paiement:</label>
                <input type="datetime-local" name="datePaiement" value={formData.datePaiement} onChange={handleChange} />
            </div>
            <div>
                <label>Statut:</label>
                <select id="statut" name="statut" value={formData.statut} onChange={handleChange}>
                    <option value="" hidden>Sélectionnez un statut</option>
                    <option value="paye">Payé</option>
                    <option value="non-paye">Non Payé</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>Ajouter Facture</button>
            {loading && <p>Chargement en cours...</p>}
        </form>
        </div>
    );
};

export default EditFacture;
