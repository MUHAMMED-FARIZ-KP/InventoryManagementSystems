import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [variants, setVariants] = useState([{ name: '', options: [''] }]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = field === 'options' ? value.split(',') : value;
    setVariants(newVariants);
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', options: [''] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ProductName', productName);
    if (productImage) {
      formData.append('ProductImage', productImage);
    }
  
    // Correctly structure variants for backend
    const variantsPayload = variants.map((variant) => ({
      name: variant.name,
      subvariants: variant.options.map((option) => ({ option }))
    }));
    
    // Use JSON.stringify to pass variants
    formData.append('variants', JSON.stringify(variantsPayload));
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data','Accept': 'application/json'  },
      });
      alert('Product created successfully!');
      // Reset form
      setProductName('');
      setProductImage(null);
      setVariants([{ name: '', options: [''] }]);
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating product!');
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Create a New Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 shadow-sm"
              placeholder="Enter the product name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Product Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 shadow-sm"
            />
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Variants</h3>
            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Variant Name"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  className="border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 shadow-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Options (comma-separated)"
                  value={variant.options.join(',')}
                  onChange={(e) => handleVariantChange(index, 'options', e.target.value)}
                  className="border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300 shadow-sm"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleAddVariant}
              className="bg-blue-500 text-white rounded-lg px-6 py-2 font-semibold hover:bg-blue-600 shadow-md"
            >
              Add Variant
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white rounded-lg px-6 py-2 font-semibold hover:bg-green-600 shadow-md"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;