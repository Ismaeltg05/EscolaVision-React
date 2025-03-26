import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Logo Section with Animation */}
      <motion.img
        src="/EscolaVision-React/escolavision.png"
        alt="EscolaVision Logo"
        className="h-64 mb-6 rounded-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Title and Subtitle with smooth transitions */}
      <motion.h1
        className="text-5xl font-extrabold text-black mb-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        EscolaVision Desktop
      </motion.h1>

      <motion.h3
        className="text-3xl text-black mb-6"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        Tu App de Orientación Escolar
      </motion.h3>

      {/* Button with hover effect and smooth transition */}
      <motion.div
        className="card flex flex-col items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <button
          className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transform transition-all duration-300 ease-in-out"
          onClick={() => navigate('/EscolaVision-React/login')}
        >
          Ir al Login
        </button>
      </motion.div>
    </div>
  );
}

export default Home;
