import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import StockManagement from './components/StockManagement';
import HomePage from './components/HomePage'; // Ensure this import is correct

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/list" element={<ProductList />} />
        <Route path="/create" element={<ProductForm />} />
        <Route path="/stock" element={<StockManagement />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;