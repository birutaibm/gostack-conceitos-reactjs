import React, {useState, useEffect} from "react";
import { AiFillLike } from 'react-icons/ai';

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => setRepositories(response.data));
  }, []);
  
  async function handleAddRepository() {
    const repository = {
      title: 'GoStack - Desafio 02',
      url: 'https://github.com/birutaibm/gostack-conceitos-reactjs',
      techs: ['React', 'ReactJS', 'axios'],
    };

    const response = await api.post('repositories', repository);
    if ((response.status >= 200) && (response.status < 300)) {
      setRepositories([...repositories, response.data]);
    }
  }

  async function handleLike(id) {
    const response = await api.post('repositories/'+id+'/like');
    if ((response.status >= 200) && (response.status < 300)) {
      setRepositories(oldValue => {
        const newValue = [];
        oldValue.forEach(repository => {
          const copy = {...repository};
          if (copy.id === id) {
            copy.likes++;
          }
          newValue.push(copy);
        });
        return newValue;
      });
    }
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete('repositories/'+id);
    if (response.status === 204) {
      setRepositories(repositories.filter(repository => repository.id !== id));
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            <div className="text">
              <h3>
                <a href={repository.url}>{repository.title}</a>
              </h3>
              <p>{repository.techs.join(', ')}</p>
            </div>
            <button className="like" onClick={() => handleLike(repository.id)}>
              <AiFillLike size={14} />
              {repository.likes}
            </button>

            <button className="remove" onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
