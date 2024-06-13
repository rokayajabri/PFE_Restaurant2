import axios from 'axios';
import { useState } from 'react'
import React from 'react';
import {useNavigate } from 'react-router-dom'
import {Button} from 'reactstrap';

export default function Logout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData); // Assurez-vous que userData est bien défini
    
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };
    
            // Set loading state
            setLoading(true);
    
            await axios.post("http://127.0.0.1:8001/api/logout", null, { headers });
    
            localStorage.removeItem('user'); // Assurez-vous que le nom du token est correctement orthographié
            navigate('/');
            console.log("Logout successful");
            setLoading(false);
            console.log(`Token sent: ${userData.access_token}`); // Déplacez cette ligne à l'intérieur du bloc try
             // Actualiser la page après la déconnexion
             window.location.reload();
        } catch (error) {
            console.error('Erreur deconnexion user :', error);
        }
    };
    
    
    return(
        <div>
            <div className="p-2 px-3">
              <Button color="danger" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    )
}