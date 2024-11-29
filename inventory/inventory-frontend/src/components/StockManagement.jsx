import React, { useState } from 'react';
import axios from 'axios';

const StockManagement = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [action, setAction] = useState('add');

  const handleStockUpdate = async () => {
    try {
      if (!productId || quantity <= 0 || isNaN(quantity)) {
        alert('Please enter a valid product ID and a positive quantity.');
        return;
      }
  
      const url =
        action === 'add'
          ? `http://127.0.0.1:8000/api/products/${productId}/add-stock/`
          : `http://127.0.0.1:8000/api/products/${productId}/remove-stock/`;
  
      const payload = { 
        quantity: parseInt(quantity, 10),
        productId: productId  // Add this for debugging
      }; 
  
      console.log("Request URL:", url);
      console.log("Request Payload:", payload);
  
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      alert('Stock updated successfully!');
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response);
      alert(error.response?.data?.error || error.message || 'Error updating stock!');
    }
  };
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Stock Management
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Product ID:
          </label>
          <input
  type="text"
  value={productId}
  onChange={(e) => setProductId(e.target.value)}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  placeholder="Enter Product ID"
  required
/>



        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter Quantity"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Action:
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="add">Add Stock</option>
            <option value="remove">Remove Stock</option>
          </select>
        </div>
        <button
          onClick={handleStockUpdate}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Stock
        </button>
      </div>
    </div>
  );
};

export default StockManagement;
