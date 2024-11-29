import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // 2 rows x 4 cards

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/list/');
        setProducts(response.data.products);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProducts();
  }, []);

  if (error) return <div className="text-red-500 font-bold text-center">Error: {error}</div>;

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Product List</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105 duration-300"
                onClick={() => setSelectedProduct(product)}
                style={{ height: '350px' }}
              >
                {product.ProductImage ? (
                  <img
                    src={product.ProductImage}
                    alt={product.ProductName}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 italic">No Image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{product.ProductName}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-2xl relative">
            <button
              className="absolute top-4 right-4 text-blue-600 hover:text-gray-800 text-5xl"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {selectedProduct.ProductImage ? (
                <img
                  src={selectedProduct.ProductImage}
                  alt={selectedProduct.ProductName}
                  className="w-48 h-48 object-cover mb-4"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500 italic">No Image</span>
                </div>
              )}

              <h2 className="text-xl font-bold">{selectedProduct.ProductName}</h2>
              <p className="text-gray-600">
                <strong>Product ID:</strong> {selectedProduct.ProductID}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Product Code:</strong> {selectedProduct.ProductCode}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Total Stock:</strong> {Math.round(selectedProduct.TotalStock || 0)}
              </p>
              <div className="mt-4">
                {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                  <div className="mt-2 text-gray-600">
                    <h3 className="text-lg font-semibold">Variants:</h3>
                    {selectedProduct.variants.map((variant, idx) => (
                      <div key={idx} className="text-sm mb-2">
                        <strong>{variant.name}:</strong>{' '}
                        {variant.subvariants && variant.subvariants.length > 0
                          ? variant.subvariants.map((subvariant) => subvariant.option).join(', ')
                          : 'No options available'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No variants available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
