import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-white w-full py-6 shadow-md">
        <h1 className="text-4xl font-bold text-center text-gray-800">Supply Chain Management System</h1>
        <p className="text-center text-gray-600 mt-2">Optimize your supply chain with our advanced management tools.</p>
      </header>
      <section className="mt-10 w-4/5">
        <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
        <ul className="mt-4 space-y-4">
          <li className="bg-white p-4 rounded-lg shadow-md">Real-time tracking</li>
          <li className="bg-white p-4 rounded-lg shadow-md">Inventory management</li>
          <li className="bg-white p-4 rounded-lg shadow-md">Automated reporting</li>
          <li className="bg-white p-4 rounded-lg shadow-md">Supplier management</li>
        </ul>
      </section>
    
    </div>
  );
}

export default Home;