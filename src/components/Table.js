import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import AppContext from '../context/AppContext';

function Table({ planetName }) {
  const planetContext = useContext(AppContext);
  const { isLoading, planetsData } = planetContext;
  const [planetsFiltered, setPlanetsFiltered] = useState(planetsData.results);
  const [filters, setFilters] = useState([]);
  const [sortFilter, setSortFilter] = useState(
    { order: { column: 'population', sort: 'ASC' } },
  );
  const [orderToFilter, setOrderToFilter] = useState();

  // Cria estado para controlar as options do select
  const [options, setOptions] = useState({
    column: 'population',
    comparison: 'maior que',
    value: 0,
  });

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

  const orderBySort = (array) => {
    if (!orderToFilter) return array;
    const negative = -1;
    const { order: { column, sort } } = orderToFilter;
    switch (sort) {
    case 'DESC':
      return [...array].sort((a, b) => (b[column] === 'unknown'
        ? negative : parseInt(b[column], 10) - parseInt(a[column], 10)));
    case 'ASC':
      return [...array].sort((a, b) => ((b[column] === 'unknown')
        ? negative : parseInt(a[column], 10) - parseInt(b[column], 10)));
    default:
      return array;
    }
  };

  useEffect(() => {
    const filteredByName = filterByName(planetsData.results);
    const filteredByComparison = filterBySelect(filteredByName);
    const ordernedBySort = orderBySort(filteredByComparison);
    setPlanetsFiltered(ordernedBySort);
  }, [planetName, filters, orderToFilter]);

  // Array com as opções do select column-filter evitando os filtros já criados
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
          className="select-input"
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
            }
          } }
        >
          Filtrar
        </button>
      </div>
      <div className="sort-filter">
        <select
          data-testid="column-sort"
          onChange={ ({ target: { value } }) => setSortFilter(
            { order: { ...sortFilter.order, column: value } },
          ) }
        >
          {[
            'population', 'orbital_period', 'diameter',
            'rotation_period', 'surface_water',
          ].map((column, i) => <option key={ i }>{column}</option>)}
        </select>
        <div
          className="radio-inputs-area"
          onChange={ ({ target: { value } }) => setSortFilter(
            { order: { ...sortFilter.order, sort: value } },
          ) }
        >
          <label htmlFor="ASC">
            {' 🔺 '}
            <input
              type="radio"
              name="sort"
              value="ASC"
              data-testid="column-sort-input-asc"
            />
          </label>
          <label htmlFor="DESC">
            {' 🔻 '}
            <input
              type="radio"
              name="sort"
              value="DESC"
              data-testid="column-sort-input-desc"
            />
          </label>
        </div>
        <button
          data-testid="column-sort-button"
          onClick={ () => setOrderToFilter(sortFilter) }
        >
          Ordenar

        </button>
      </div>
      <div>
        { // Filtros criados pelo usuário
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
            {['Name', 'Rotation Period', 'Orbital Period', 'Diameter',
              'Climate', 'Gravity', 'Terrain', 'Surface Water', 'Population',
              'Films', 'Created', 'Edited', 'URL'].map((a, i) => <th key={ i }>{a}</th>)}

          </tr>
        </thead>
        <tbody>
          {planetsFiltered.map((planet) => (
            <tr key={ planet.name } className="planet-line">
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
