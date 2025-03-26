/**
 * @file Login.tsx
 * @description Componente de inicio de sesión.
 * @author Adrian Ruiz Sanchez
 * @coauthors Ismael Torres Gonzalez
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoginProps = {
    onBackClick: () => void;
    onLoginSuccess: (usuario: string) => void;
};

const Login: React.FC<LoginProps> = ({ onBackClick, onLoginSuccess }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            //const response = await fetch('https://servidor.ieshlanz.es:8000/crud/login.php', {
            const response = await fetch('http://servidor.ieshlanz.es:8000/crud/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await response.json();

            if (!data || data.status !== 'success') {
                throw new Error(data.message || 'Credenciales incorrectas');
            }

            const idusuario = data.id;
            localStorage.setItem('idusuario', String(idusuario));
            localStorage.setItem('isLoggedIn', 'true');
            onLoginSuccess(data.nombre);
            navigate('/EscolaVision-React/menu');

        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#AED6F1]">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usuario">
                        Usuario
                    </label>
                    <input
                        type="text"
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6 ">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contrasena">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="lgnBtns">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                    <button
                        type="button"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={onBackClick}
                    >
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
