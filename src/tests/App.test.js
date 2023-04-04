import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockFetch from './helpers/mockFetch';

describe('Testando a tela inicial da aplicação pós Loading.', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });

  test('Testa se o <Loading /> está funcional', async () => {
    render(<App />);
    const loadingComponent = screen.getByText('Loading...');
    expect(loadingComponent).toBeInTheDocument();
    expect(loadingComponent).toBeDefined()
    await waitFor(() => {
      const inputName = screen.getByTestId('name-filter');
      expect(inputName).toBeInTheDocument();
      expect(inputName).toBeDefined()
    })
  });

  test('Testa se os Inputs estão na tela', async () => {
    render(<App />);
    const loadingComponent = screen.getByText('Loading...');
    expect(loadingComponent).toBeInTheDocument();
    expect(loadingComponent).toBeDefined()
    await waitFor(() => {
      const inputName = screen.getByTestId('name-filter');
      expect(inputName).toBeInTheDocument();
      expect(inputName).toBeDefined()
    })
    const columnFilter = screen.getByTestId('column-filter');
    expect(columnFilter).toBeInTheDocument();
    expect(columnFilter).toBeDefined()
  });
});
