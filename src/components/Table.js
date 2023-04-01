import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import AppContext from '../context/AppContext';

function Table({ planetName }) {
  // Importa contexto com a resposta da API
  const planetContext = useContext(AppContext);
  const { isLoading, errors, planetsData } = planetContext;
  console.log(errors);

  // Cria estado para controlar as options do select
  const [options, setOptions] = useState({
    column: 'population',
    comparison: 'maior que',
    value: 0,
  });

  // Cria estado para manipular o array mapeado na Table
  const [planetsFiltered, setPlanetsFiltered] = useState(planetsData.results);

  // Cria estado para salvar filtros
  const [filters, setFilters] = useState([]);

  // Lógica responsável por filtrar planetas de acordo com a tag select
  const filterBySelect = (array) => {
    if (filters.length === 0) return array;
    let filteredByComparison = array;
    filters.forEach((filter) => {
      filteredByComparison = filteredByComparison.filter((planet) => {
        const { column, comparison, value } = filter;
        const valueNumber = Number(value);
        const columnValue = Number(planet[column]);
        switch (comparison) {
        case 'maior que':
          return columnValue > valueNumber;
        case 'menor que':
          return columnValue < valueNumber;
        default:
          return columnValue === valueNumber;
        }
      });
    });
    return filteredByComparison;
  };

  // Lógica responsável por filtrar planetas de acordo com valor do input
  const filterByName = (array) => {
    const filteredByName = array.filter(
      (planet) => planet.name.includes(planetName),
    );
    return filteredByName;
  };

  // Faz o tratamento de dados, manipula desde o dado bruto até o dado pós filtragem
  useEffect(() => {
    const filteredByName = filterByName(planetsData.results);
    const filteredByComparison = filterBySelect(filteredByName);
    setPlanetsFiltered(filteredByComparison);
  }, [planetName, filters]);

  // Array com as opções do select column-filter
  const columnFilters = [
    'population', 'orbital_period', 'diameter',
    'rotation_period', 'surface_water',
  ].filter((fil) => !filters.some(({ column }) => column === fil));

  // Lógica para evitar filtragem repetida
  if (!columnFilters.includes(options.column) && columnFilters.length !== 0) {
    setOptions({
      ...options, column: columnFilters[0],
    });
  }

  if (isLoading) return <Loading />;
  return (
    <section>
      <div className="selects-filter">
        <select
          data-testid="column-filter"
          onChange={ (e) => setOptions({ ...options, column: e.target.value }) }
        >
          {
            columnFilters
              .map((filter) => (
                <option key={ filter }>{filter}</option>
              ))
          }
        </select>
        <select
          data-testid="comparison-filter"
          onChange={ (e) => setOptions({ ...options, comparison: e.target.value }) }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="number"
          data-testid="value-filter"
          value={ options.value }
          onChange={ (e) => setOptions({ ...options, value: e.target.value }) }
        />
        <button
          data-testid="button-filter"
          onClick={ () => {
            const verifyFilters = filters
              .some((filter) => filter.column === options.column);
            if (!verifyFilters) {
              setFilters([...filters, options]);
            } else {
              console.log('Filtro já existe');
            }
          } }
        >
          Filtrar
        </button>
      </div>
      <div>
        {
          filters.length > 0
          && (
            <div>
              <div className="filter-line">
                {filters.map((filt, i) => (
                  <span key={ i } data-testid="filter">
                    {`Filtrando por ${filt.column} ${filt.comparison} ${filt.value} `}
                    <button
                      onClick={ () => setFilters(filters.filter((fil) => fil !== filt)) }
                    >
                      {' ❌ '}
                    </button>
                  </span>
                ))}
              </div>
              <button
                className="remove-all-filters"
                data-testid="button-remove-filters"
                onClick={ () => setFilters([]) }
              >
                Remover filtros
              </button>
            </div>
          )
        }
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {planetsFiltered.map((planet) => (
            <tr key={ planet.name }>
              <td>{planet.name}</td>
              <td>{planet.rotation_period}</td>
              <td>{planet.orbital_period}</td>
              <td>{planet.diameter}</td>
              <td>{planet.climate}</td>
              <td>{planet.gravity}</td>
              <td>{planet.terrain}</td>
              <td>{planet.surface_water}</td>
              <td>{planet.population}</td>
              <td>{planet.films}</td>
              <td>{planet.created}</td>
              <td>{planet.edited}</td>
              <td>{planet.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

Table.propTypes = {
  planetName: PropTypes.string.isRequired,
};

export default Table;
