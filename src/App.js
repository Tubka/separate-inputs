import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Input } from './Input/Input';


function App() {
  const [value, setValue] = useState('12 3');

  const handleChangeInputEach = (string) => {
    setValue(string);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <Input 
            className='input'
            style={{width: '10px', marginLeft: '5px'}} 
            value={value} 
            onChange={handleChangeInputEach} 
            count={5}
            pattern={/^[0-9aA-zZ]/}
          />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
