import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-100">
    
      <section className="bg-blue-600 text-white text-center py-20">
        <div className="container mx-auto">

          <h1 className="text-5xl font-bold mb-4">Optimize Your Supply Chain</h1>
          <p className="text-lg mb-6">With dchain, streamline your operations and enhance productivity.</p>
          
          <Link to="/shipment">
            <button className="bg-white text-blue-600 py-2 px-4 rounded hover:bg-gray-200 mr-4">Get Started Now</button>
          </Link>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">What is dchain</h2>
          <p className="text-lg mb-6">The comprehensive solution to optimize your supply chain and drive business success.</p>

          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">About Us</button>
        </div>
      </section>

      {/* Methodology Section */}

      <section className="bg-gray-200 py-20">

        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Maximize Your Supply Chain Efficiency</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/3 p-4">

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Step-by-Step Optimization</h3>
                <p className="text-lg mb-6">A detailed guide to enhance every aspect of your supply chain.</p>
                <Link to="/shipemen" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Get Started Now</Link>
              </div>
            </div>

            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Customized Solutions</h3>
                <p className="text-lg mb-6">Tailored strategies to meet your unique supply chain needs.</p>
                <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Get Started Now</button>

              </div>
            </div>

          </div>

        </div>

      </section>

      {/* Blog Section */}

      <section className="py-20">

        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Latest Insights</h2>
          <div className="flex flex-wrap justify-center">

            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">

                <h3 className="text-2xl font-bold mb-4">2023: Supply Chain Trends</h3>
                <p className="text-lg mb-6">Discover the latest trends in supply chain management for 2023.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">2023: Supply Chain Trends</h3>
                <p className="text-lg mb-6">Discover the latest trends in supply chain management for 2023.</p>
              </div>
            </div>

          </div>

        </div>

      </section>
    </div>
  );
}

export default Home;
