import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
            const response = await fetch("https://cors-proxy.escolavisionhlanz.workers.dev/login.php", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await response.json();

            if (!data || data.status !== 'success') {
                throw new Error(data.message || 'Credenciales incorrectas');
            }
            localStorage.setItem('idusuario', String(data.id));
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('tipo', data.tipo);
            localStorage.setItem('isOrientador', data.is_orientador);
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
        <div className="flex justify-center items-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Iniciar Sesión</h2>

                {error && (
                    <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="usuario" className="block text-gray-700 font-semibold mb-1">
                            Usuario
                        </label>
                        <input
                            type="text"
                            id="usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="contrasena" className="block text-gray-700 font-semibold mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <motion.button
                            type="submit"
                            className="bg-blue-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition-all"
                            disabled={loading}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </motion.button>

                        <motion.button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition-all"
                            onClick={onBackClick}
                            whileTap={{ scale: 0.95 }}
                        >
                            Volver
                        </motion.button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-700">
                            ¿No tienes una cuenta?{' '}
                            <button
                                type="button"
                                className="text-indigo-600 hover:underline"
                                onClick={() => navigate('/EscolaVision-React/registro')}
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
