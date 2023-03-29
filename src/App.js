/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import Loading from './components/Loading';
import AppContext from './context/AppContext';
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
    <AppContext.Provider value={ context }>
      {planetsData !== null ? <Home /> : <Loading />}
    </AppContext.Provider>

  );
}

export default App; // z-Fernando
