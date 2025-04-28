//imports
import { useEffect } from 'react';
import clienteAxios from '../services/axios';



const Home = () => {

  const consultarAPI = async ()=>{
    try {
      const resultado = await clienteAxios.get('/torneos')
      return resultado.data
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneos = await consultarAPI();
        console.log('Torneos obtenidos:', torneos);
      } catch (error) {
        console.error('Error obteniendo torneos:', error);
      }
    };

    fetchTorneos();
  }, []);

  return (
    <div>
      <h1>Bienvenido a los Torneos de Cartas</h1>
      <p>Explora y participa en torneos increíbles.</p>
    </div>
  );
}

export default Home;
