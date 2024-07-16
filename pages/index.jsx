import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { getPokemons } from '../lib/getsPokemons';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      console.log('Fetching pokemons...');
      const pokemonData = await getPokemons();
      console.log('Fetched pokemons:', pokemonData);
      setPokemons(pokemonData);
    };

    fetchPokemons();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Pokémons</h1>
        <div className={styles.grid}>
          {pokemons.map(pokemon => (
            <div key={pokemon.id} className={styles.card}>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
              <p>Tipos: {pokemon.types.join(', ')}</p>
              <p>Habilidades: {pokemon.abilities.join(', ')}</p>
              <div>
                <h4>Estadísticas:</h4>
                <ul>
                  {pokemon.stats.map(stat => (
                    <li key={stat.name}>{stat.name}: {stat.value}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Características:</h4>
                <p>Descripción: {pokemon.characteristic.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
