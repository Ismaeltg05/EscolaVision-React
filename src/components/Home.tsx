interface HomeProps {
  onLoginClick: () => void;
}

function Home({ onLoginClick }: HomeProps) {
  return (
    <>
      <div className="flex justify-center items-center space-x-4 p-4">
        <img src="/public/escolavision.png" alt="EscolaVision Logo" className="h-64" />
      </div>
      <h1 className="text-3xl font-bold underline text-center">EscolaVision</h1>
      <h3 className="text-2xl text-center">Tu App de Orientación Escolar</h3>
      <div className="card flex flex-col items-center p-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={onLoginClick}
        >
          Ir al Login
        </button>
      </div>
    </>
  );
}

export default Home;