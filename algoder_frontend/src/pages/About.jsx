import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';

const About = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-neutral-800 text-white px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <section className="bg-[#303030] rounded-xl p-6 md:p-10 mb-10 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🔧 What We Do</h2>
          <p className="text-gray-300 text-lg">
            <strong>Algoder</strong> develops and sells high-quality algorithmic trading tools for serious traders. Whether you trade equities, crypto, or futures, our tools are designed for speed, efficiency, and real-time market interaction using broker APIs.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#303030] rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">🛠️ Our Tools</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Live Algo Bots (Scalping, Trend, Mean Reversion)</li>
              <li>Broker Integration (Zerodha, Upstox, Binance)</li>
              <li>Real-time Dashboard with React & WebSocket</li>
              <li>Smart Order Placement with SL, TGT, TSL</li>
              <li>Backtesting Frameworks</li>
              <li>Telegram / WhatsApp Alerts</li>
            </ul>
          </div>

          <div className="bg-[#303030] rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">🧠 Expertise</h2>
            <p className="text-gray-300 mb-2">
              We specialize in end-to-end algo trading system development using:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Python, Django, FastAPI</li>
              <li>React, Tailwind, WebSocket</li>
              <li>Multi-threading & Low-latency Architecture</li>
              <li>PostgreSQL, Redis, Celery, JWT Auth</li>
              <li>Data Visualization and Live LTP tracking</li>
            </ul>
          </div>
        </section>

        <section className="bg-[#303030] rounded-xl p-6 md:p-10 mb-10 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">🎯 Our Mission</h2>
          <p className="text-gray-300 text-lg">
            Our mission is to democratize algorithmic trading by making powerful, easy-to-use, and customizable automation tools accessible to every trader — from beginners to hedge funds.
          </p>
        </section>

        <section className="bg-[#303030] rounded-xl p-6 md:p-10 mb-10 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">💡 Why Choose Algoder?</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
            <li>Fast execution with real-time streaming data</li>
            <li>Custom development as per your strategy</li>
            <li>Secure architecture with user control</li>
            <li>Transparent and flexible pricing</li>
            <li>Technical support and documentation</li>
          </ul>
        </section>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-medium text-indigo-400 mb-4">Ready to Automate Your Trading?</h3>
          <p className="text-gray-400 mb-6">Contact us to build or buy your custom algo tool today.</p>
          <a
            href="/contact"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default About;
