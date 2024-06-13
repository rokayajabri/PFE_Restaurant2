import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logos/1.png';
import logo2 from '../../assets/images/logos/logoD.png';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const getUserRole = (userData) => {
        // Assuming the user's role is stored in a property named 'role' in the user data
        return userData.role;
    };
    
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8001/api/login", {
                email,
                password,
            });

            if (response.status === 200) {
                const userData = response.data;
                userData.role = getUserRole(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                console.log(userData);
                return userData;
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setErrors({
                ...errors,
                email: !formData.email ? 'Email is required' : '',
                password: !formData.password ? 'Password is required' : '',
            });
            return;
        }

        try {
            await login(formData.email, formData.password);
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log(userData);
            if(userData.role === 'admin'){
                navigate("/adminDashboard");
            }
            else if(userData.role === 'cuisinier'){
                navigate("/cuisinierDashboard");
            }
            else if(userData.role === 'serveur'){
                navigate("/serveurDashboard");
            }
            else if(userData.role === 'gerant'){
                navigate("/gerantDashboard");
            }
            else if(userData.role === 'caissier'){
                navigate("/caissierDashboard");
            }else{
                navigate("/");
            }
        } catch (error) {
            const errorMsg = error.response ? error.response.data.message : 'Login failed. Please try again.';
            setErrors({ ...errors, server: errorMsg });
        }
    };

    const handleChange = (e) => {
        console.log(e.target.value);
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src={logo} className="img-fluid" alt="Sample image"/>
                        <img src={logo2} className="img-fluid" alt="Sample image"/>
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form onSubmit={onSubmit}>
                            <div data-mdb-input-init className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="email">Email address</label>
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="password">Password</label>
                                {errors.password && <div className="error">{errors.password}</div>}
                            </div>

                            {errors.server && <div className="error">{errors.server}</div>}

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
