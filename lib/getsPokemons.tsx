export async function getPokemons() {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: headers,
    redirect: 'follow' // Aquí está el ajuste, asegúrate de usar 'follow' sin convertirlo a tipo RequestRedirect
  };

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20", requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();

        // Fetch characteristic details
        try {
          const charRes = await fetch(`https://pokeapi.co/api/v2/characteristic/${details.id}`);
          const characteristic = await charRes.json();
          details.characteristic = {
            gene_modulo: characteristic.gene_modulo,
            description: characteristic.descriptions.find((desc: { language: { name: string }; description: string }) => desc.language.name === 'en')?.description || 'No description available'
          };
        } catch (charError) {
          console.error(`Failed to fetch characteristic for Pokemon ID ${details.id}:`, charError);
          details.characteristic = {
            gene_modulo: null,
            description: 'No description available'
          };
        }

        return {
          id: details.id,
          name: details.name,
          sprites: details.sprites,
          types: details.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name),
          abilities: details.abilities.map((abilityInfo: { ability: { name: string } }) => abilityInfo.ability.name),
          stats: details.stats.map((statInfo: { stat: { name: string }; base_stat: number }) => ({
            name: statInfo.stat.name,
            value: statInfo.base_stat
          })),
          characteristic: details.characteristic
        };
      })
    );
    return pokemonDetails;
  } catch (error) {
    console.error('Failed to fetch pokemons:', error);
    return [];
  }
}
