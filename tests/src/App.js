import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './pages/homePage';
import NoPage from './pages/noPage';
import {Protected} from './pages/authFunction';
import Admin from './pages/admin/admin';
function App() {
  return (
    <BrowserRouter>
      <Routes >
        <Route  path="/" element={<Protected />} >
          <Route index element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
