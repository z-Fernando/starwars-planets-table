import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import AppContext from '../context/AppContext';

function Table({ planetName }) {
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
  function filterBySelect(array) {
    if (filters.length === 0) return array;
    let filteredByComparison = array;
    filters.forEach((filter) => {
      filteredByComparison = filteredByComparison.filter((planet) => {
        const { column, comparison, value } = filter;
        const valueNumber = Number(value);
        const columnNumber = Number(planet[column]);
        switch (comparison) {
        case 'maior que':
          return columnNumber > valueNumber;
        case 'menor que':
          return columnNumber < valueNumber;
        default:
          return columnNumber === valueNumber;
        }
      });
    });
    return filteredByComparison;
  }

  // Lógica responsável por filtrar planetas de acordo com valor do input
  const filterByName = (array) => {
    const filteredByName = array.filter(
      (planet) => planet.name.includes(planetName),
    );
    return filteredByName;
  };

  useEffect(() => {
    const filteredByName = filterByName(planetsData.results);
    const filteredByComparison = filterBySelect(filteredByName);
    setPlanetsFiltered(filteredByComparison);
  }, [planetName, filters]);

  if (isLoading) return <Loading />;
  return (
    <section>
      <div className="selects-filter">
        <select
          data-testid="column-filter"
          onChange={ (e) => setOptions({ ...options, column: e.target.value }) }
        >
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
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
          onClick={ () => setFilters([...filters, options]) }
        >
          Filtrar
        </button>
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
