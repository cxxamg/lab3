import { Store, useStore } from '@tanstack/react-store';
import { useState } from 'react';

// Создаем store
const apiStore = new Store({
  message: '',
  loading: false,
  error: null
});

export function TestApi() {
  // Подписка напрямую на store
  const store = useStore(apiStore);

  const [inputName, setInputName] = useState('');

  //get
  const fetchData = async () => {
    apiStore.setState((state) => ({
      ...state,
      loading: true,
      error: null
    }));

    try {
      const url = inputName
        ? `/api/hello?name=${encodeURIComponent(inputName)}`
        : '/api/hello';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      apiStore.setState((state) => ({
        ...state,
        message: data.message || JSON.stringify(data),
        loading: false,
        error: null
      }));
    } catch (error) {
      apiStore.setState((state) => ({
        ...state,
        error: error.message,
        loading: false
      }));
    }
  };
 
  //post
  const postData = async () => { 
  apiStore.setState((state) => ({
    ...state,
    loading: true,
    error: null
  }));

  try {
    const url = '/api/hello'; // POST обычно к одному URL
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // говорим серверу, что тело JSON
      },
      body: JSON.stringify({ name: inputName }) // данные, которые отправляем
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    apiStore.setState((state) => ({
      ...state,
      message: data.message || JSON.stringify(data),
      loading: false,
      error: null
    }));
  } catch (error) {
    apiStore.setState((state) => ({
      ...state,
      error: error.message,
      loading: false
    }));
  }
};


  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Тест API с TanStack Store</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Введите имя (необязательно)"
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button
          onClick={fetchData}
          disabled={store.loading}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: store.loading ? 'not-allowed' : 'pointer' }}
        >
          {store.loading ? 'Загрузка...' : 'Отправить запрос'}
        </button>
      </div>

      {store.message && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
          <strong>Ответ от сервера:</strong>
          <p>{store.message}</p>
        </div>
      )}

      {store.error && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', color: '#721c24' }}>
          <strong>Ошибка:</strong>
          <p>{store.error}</p>
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p>Store состояние: {JSON.stringify(store, null, 2)}</p>
      </div>
    </div>
  );
}
