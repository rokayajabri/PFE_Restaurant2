import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFactureGerant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_Commande: '',
        montant_total: '',
        datePaiement: '',
        statut: '', // Changer la valeur initiale en fonction de vos besoins
    });
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                const headers = {
                    Authorization: `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json',
                };
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8001/api/commandes', { headers });
                setCommandes(response.data);
                setLoading(false);
               
            } catch (error) {
                console.error('Error fetching commandes:', error);
            }
        };

        fetchCommandes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

         // Récupérer le total de la commande sélectionnée et mettre à jour automatiquement le champ "Montant Total"
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
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            setLoading(true);
            await axios.post('http://127.0.0.1:8001/api/add_facture', formData, { headers });
            console.log('Facture ajoutée avec succès !');
            navigate("/factures");
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la facture :', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="id_Commande">ID Commande:</label>
                <select id="id_Commande" name="id_Commande" value={formData.id_Commande} onChange={handleChange}>
                    <option value="">Sélectionnez une commande</option>
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
    );
};

export default AddFactureGerant;
