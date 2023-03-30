import { useContext } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import AppContext from '../context/AppContext';

function Table({ planetName }) {
  const planetContext = useContext(AppContext);
  const { isLoading, errors, planetsData } = planetContext;
  console.log(errors);

  // Lógica responsável por filtrar planetas de acordo com valor do input
  let filteredByName = [];
  if (planetsData !== null) {
    filteredByName = planetsData.results.filter(
      (planet) => planet.name.includes(planetName),
    );
  }

  if (isLoading) return <Loading />;
  return (
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
        {filteredByName.map((planet) => (
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
  );
}

Table.propTypes = {
  planetName: PropTypes.string.isRequired,
};

export default Table;
