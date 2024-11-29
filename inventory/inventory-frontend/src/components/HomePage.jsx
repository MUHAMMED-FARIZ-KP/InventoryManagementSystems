import React from 'react';
import { Link } from 'react-router-dom';
import { ListBulletIcon, PlusCircleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">Inventory Management System</h1>
        <p className="text-gray-600 text-base md:text-lg">Effortlessly manage your products, inventory, and stock</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Link
          to="/list"
          className="bg-white shadow-sm rounded-md p-5 text-center hover:bg-blue-100 transition border border-gray-200"
        >
          <ListBulletIcon className="w-14 h-14 mx-auto text-blue-500 mb-3" />
          <h2 className="text-lg font-bold text-gray-700">List All Products</h2>
          <p className="text-gray-500 text-sm">View product details and stock levels</p>
        </Link>

        <Link
          to="/create"
          className="bg-white shadow-sm rounded-md p-5 text-center hover:bg-green-100 transition border border-gray-200"
        >
          <PlusCircleIcon className="w-14 h-14 mx-auto text-green-500 mb-3" />
          <h2 className="text-lg font-bold text-gray-700">Create New Product</h2>
          <p className="text-gray-500 text-sm">Add products with detailed specifications</p>
        </Link>

        <Link
          to="/stock"
          className="bg-white shadow-sm rounded-md p-5 text-center hover:bg-purple-100 transition border border-gray-200"
        >
          <ArchiveBoxIcon className="w-14 h-14 mx-auto text-purple-500 mb-3" />
          <h2 className="text-lg font-bold text-gray-700">Stock Management</h2>
          <p className="text-gray-500 text-sm">Track inventory and manage stock</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
