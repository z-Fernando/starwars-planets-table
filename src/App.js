/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './App.css';
import appContext from './context/appContext';
import useFetch from './hooks/useFetch';

function App() {
  const [isLoading, errors, planetsData, fecthingData] = useFetch();

  useEffect(() => {
    fecthingData('https://swapi.dev/api/planets');
  }, []);

  // Lógica que traz planetsData sem residents
  if (planetsData !== null) {
    const { results } = planetsData;
    const planetsWithoutResidents = results.map((planet) => {
      const { residents, ...rest } = planet;
      return rest;
    });
    planetsData.results = planetsWithoutResidents;
  }

  const context = {
    isLoading,
    errors,
    planetsData,
  };

  return (
    <appContext.Provider value={ context }>
      <span>Hello, App!</span>
    </appContext.Provider>

  );
}

export default App; // z-Fernando
