import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RegisterProps = {
    onBackClick: () => void;
    onRegisterSuccess: (usuario: string) => void;
};

const Register: React.FC<RegisterProps> = ({ onBackClick, onRegisterSuccess }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [email, setEmail] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('alumno'); // Por defecto "Alumno"
    const [isOrientador, setIsOrientador] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [foto, setFoto] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFoto(e.target.files[0]);
        }
    };


    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validar contraseñas
        if (contrasena !== confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        // Validar formato de email y DNI
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            setError('Email inválido');
            setLoading(false);
            return;
        }

        const dniRegex = /^[0-9]{8}[A-Za-z]{1}$/; // Formato típico de DNI español
        if (!dniRegex.test(dni)) {
            setError('DNI inválido');
            setLoading(false);
            return;
        }

        try {
            // Convertir la foto a Base64 si se seleccionó una
            let fotoBase64 = foto ? await convertToBase64(foto) : '';
            // Crear el objeto con los datos
            const datos = {
                nombre: usuario,
                email: email,
                contraseña: contrasena,
                tipo_usuario: tipoUsuario === 'alumno' ? 1 : 2,
                is_orientador: isOrientador ? 1 : 0,
                dni: dni,
                fecha_nacimiento: fechaNacimiento.substring(0, 4),
                foto: fotoBase64,
                id_centro: 1,
            };

            const body = JSON.stringify({
                datos,
                tabla: 'usuarios',
            });

            const response = await fetch('/insertar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; utf-8',
                    'Accept': 'application/json',
                },
                body: body,
            });

            const data = await response.json();
            console.log(data);

            if (!data || data.status !== 'success') {
                throw new Error(data.message || 'Error al registrar el usuario');
            }

            onRegisterSuccess(data.nombre);
            navigate('/EscolaVision-React/login');
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-[#AED6F1]">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Registrarse</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usuario">
                            Nombre y Apellidos
                        </label>
                        <input
                            type="text"
                            id="usuario"
                            placeholder="Introduce nombre y apellidos"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Introduce el email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_nacimiento">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            id="fecha_nacimiento"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">
                            DNI
                        </label>
                        <input
                            type="text"
                            id="dni"
                            placeholder="Introduce DNI"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="foto">
                            Foto
                        </label>
                        <input
                            type="file"
                            id="foto"
                            onChange={handleFileChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo_usuario">
                            Tipo de Usuario
                        </label>
                        <select
                            id="tipo_usuario"
                            value={tipoUsuario}
                            onChange={(e) => {
                                setTipoUsuario(e.target.value);
                                setIsOrientador(false); // Restablecer el estado de "es orientador"
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="alumno">Alumno</option>
                            <option value="profesor">Profesor</option>
                        </select>
                    </div>
                    {tipoUsuario === 'profesor' && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_orientador">
                                ¿Es Orientador?
                            </label>
                            <input
                                type="checkbox"
                                id="is_orientador"
                                checked={isOrientador}
                                onChange={(e) => setIsOrientador(e.target.checked)}
                                className="mr-2"
                            />
                        </div>
                    )}
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contrasena">
                            Contraseña
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="password"
                                id="contrasena"
                                placeholder="Introduce contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            <input
                                type="password"
                                id="confirmarContrasena"
                                placeholder="Confirmar Contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
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

export default Register;
