import { useState } from 'react';
import Table from './Table';

export default function Home() {
  const [filterByName, setFilterByName] = useState('');

  return (
    <main>
      {/* Input que filtra pelo nome */}
      <label htmlFor="name-filter">
        <input
          type="text"
          data-testid="name-filter"
          name="name-filter"
          className="name-filter"
          placeholder="Search By Name"
          value={ filterByName }
          onChange={ (ev) => setFilterByName(ev.target.value) }
        />
        <span className="searching">{' 🔍 '}</span>
      </label>
      <Table planetName={ filterByName } />
    </main>

  );
}
