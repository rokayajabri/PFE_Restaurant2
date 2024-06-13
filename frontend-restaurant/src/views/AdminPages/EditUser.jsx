import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        gender: '',
        age: '',
        phone: '',
        address: '',
        statut: '',
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
            };

            const form = new FormData();
            for (const key in formData) {
                form.append(key, formData[key]);
            }
            if (image) {
                form.append('image', image);
            }

            setLoading(true);
            await axios.put(`http://127.0.0.1:8000/api/edit_users/${id}`, form, { headers });
            console.log('User updated successfully!');
            navigate("/allUser");
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="custom-container">
            <h2 className="custom-card-title">Edit User</h2>
            <form onSubmit={onSubmit} className="custom-form">
                <div className="custom-form-group full-width">
                    <label htmlFor="image" className="custom-form-label">Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="custom-form-control"
                        id="image"
                        onChange={handleImageChange}
                    />
                    {errors.image && <div className="custom-error">{errors.image}</div>}
                </div>

            <div className="custom-form-group">
                <label htmlFor="name" className="custom-form-label">Name:</label>
                <input
                    type="text"
                    className="custom-form-control"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <div className="custom-error">{errors.name}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="email" className="custom-form-label">Email:</label>
                <input
                    type="email"
                    className="custom-form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <div className="custom-error">{errors.email}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="role" className="custom-form-label">Role:</label>
                <select id="role" className="custom-form-control" value={formData.role} onChange={handleChange}>
                    <option value="" hidden>Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="Gerant">Gerant</option>
                    <option value="Cuisinier">Cuisinier</option>
                    <option value="Serveur">Serveur</option>
                    <option value="Caissier">Caissier</option>
                </select>
                {errors.role && <div className="custom-error">{errors.role}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="gender" className="custom-form-label">Gender:</label>
                <select id="gender" className="custom-form-control" value={formData.gender} onChange={handleChange}>
                    <option value="" hidden>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {errors.gender && <div className="custom-error">{errors.gender}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="statut" className="custom-form-label">Status:</label>
                <select id="statut" className="custom-form-control" value={formData.statut} onChange={handleChange}>
                    <option value="" hidden>Select status</option>
                    <option value="Active">Active</option>
                    <option value="NoActive">No Active</option>
                </select>
                {errors.statut && <div className="custom-error">{errors.statut}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="address" className="custom-form-label">Address:</label>
                <input
                    type="text"
                    className="custom-form-control"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                />
                {errors.address && <div className="custom-error">{errors.address}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="age" className="custom-form-label">Age:</label>
                <input
                    type="number"
                    className="custom-form-control"
                    id="age"
                    value={formData.age}
                    onChange={handleChange}
                />
                {errors.age && <div className="custom-error">{errors.age}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="phone" className="custom-form-label">Telephone:</label>
                <input
                    type="text"
                    className="custom-form-control"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                {errors.phone && <div className="custom-error">{errors.phone}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="password" className="custom-form-label">Password:</label>
                <input
                    type="password"
                    className="custom-form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <div className="custom-error">{errors.password}</div>}
            </div>

            <div className="custom-form-group">
                <label htmlFor="password_confirmation" className="custom-form-label">Confirm Password:</label>
                <input
                    type="password"
                    className="custom-form-control"
                    id="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                />
                {errors.password_confirmation && <div className="custom-error">{errors.password_confirmation}</div>}
            </div>

            <div className="custom-form-group full-width">
                    {errors.server && <div className="custom-error">{errors.server}</div>}
                    <button type="submit" className="custom-btn" disabled={loading}>Update</button>
                </div>
        </form>
    </div>
        
    );
};

export default EditUser;
