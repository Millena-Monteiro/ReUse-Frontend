"use client";

import React from "react";

const AvaliacaoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-800">
        Página de Avaliação ✨
      </h1>
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 max-w-lg mx-auto text-center">
        <p className="text-lg text-gray-600 mb-4">
          Aqui você poderá ver e gerenciar as avaliações.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Funcionalidade em desenvolvimento. Fique ligado para as novidades!
        </p>
        <button
          onClick={() =>
            alert("Funcionalidade de avaliação a ser implementada!")
          }
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
        >
          Explorar Avaliações
        </button>
      </div>
    </div>
  );
};

export default AvaliacaoPage;
