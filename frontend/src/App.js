import './App.css';
import Header from './Header';
import Body from './Body';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Body/>
    </BrowserRouter>
    
  );
}

export default App;
