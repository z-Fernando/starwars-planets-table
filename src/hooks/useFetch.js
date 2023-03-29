import { useState } from 'react';

function useFetch(initialDataValue = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [data, setData] = useState(initialDataValue);

  const fetchingData = async (URL) => {
    try {
      setIsLoading(true);
      const response = await fetch(URL);
      // if (???) { // verify false return of API
      //   const error = await response.json();
      //   throw error.message;
      // }
      const dataFetched = await response.json();
      setData(dataFetched);
    } catch (error) {
      setErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  return [isLoading, errors, data, fetchingData];
}

export default useFetch;
