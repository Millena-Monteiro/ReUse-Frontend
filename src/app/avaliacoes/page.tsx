'use client'; // Esta página terá interatividade (abas), então precisa ser um Componente de Cliente

import { useState } from 'react';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';

// --- DADOS DE EXEMPLO (MOCK DATA) ---
// No futuro, estes dados viriam de uma chamada à sua API.
// Ex: const minhasAvaliacoes = await api.data.get('/minhas-avaliacoes');
const mockAvaliacoesRecebidas = [
  {
    id: 1,
    rating: 5,
    comment: "Troca super tranquila! A Maria foi muito simpática e o produto estava em perfeito estado. Recomendo!",
    evaluator: { name: "Maria Silva", avatarUrl: null },
    createdAt: "2024-05-18T10:00:00Z",
  },
  {
    id: 2,
    rating: 4,
    comment: "Tudo certo com a doação. Apenas um pequeno atraso na retirada, mas a comunicação foi ótima.",
    evaluator: { name: "João Pereira", avatarUrl: "https://i.pravatar.cc/150?u=joao" },
    createdAt: "2024-05-15T14:30:00Z",
  },
  {
    id: 3,
    rating: 5,
    comment: "Processo rápido e eficiente. Adorei a plataforma e a Carla foi um amor!",
    evaluator: { name: "Carla Dias", avatarUrl: "https://i.pravatar.cc/150?u=carla" },
    createdAt: "2024-05-10T09:15:00Z",
  },
];

const mockAvaliacoesFeitas = [
  {
    id: 4,
    rating: 5,
    comment: "Avaliei o Pedro pela doação de uma cadeira. Estava em ótimo estado, exatamente como descrito. Muito obrigado!",
    evaluated: { name: "Pedro Antunes" },
    createdAt: "2024-05-20T11:00:00Z",
  }
];
// --- FIM DOS DADOS DE EXEMPLO ---

// Componente para renderizar um único card de avaliação
const AvaliacaoCard = ({ avaliacao, tipo = 'recebida' }: { avaliacao: any, tipo?: 'recebida' | 'feita' }) => {
  const nome = tipo === 'recebida' ? avaliacao.evaluator.name : avaliacao.evaluated.name;
  const avatarUrl = tipo === 'recebida' ? avaliacao.evaluator.avatarUrl : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-4">
      <div className="flex items-center mb-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`Avatar de ${nome}`} className="w-12 h-12 rounded-full mr-4" />
        ) : (
          <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
        )}
        <div>
          <p className="font-bold text-lg text-purple-800">{nome}</p>
          <p className="text-sm text-gray-500">{new Date(avaliacao.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, index) => (
          index < avaliacao.rating 
            ? <FaStar key={index} className="text-yellow-400" /> 
            : <FaRegStar key={index} className="text-gray-300" />
        ))}
      </div>
      <p className="text-gray-700 italic">"{avaliacao.comment}"</p>
    </div>
  );
};


// Componente principal da página de avaliações
export default function AvaliacoesPage() {
  const [activeTab, setActiveTab] = useState<'recebidas' | 'feitas'>('recebidas');

  // Calcula o resumo das avaliações recebidas
  const totalAvaliacoes = mockAvaliacoesRecebidas.length;
  const mediaAvaliacoes = totalAvaliacoes > 0 
    ? (mockAvaliacoesRecebidas.reduce((acc, curr) => acc + curr.rating, 0) / totalAvaliacoes).toFixed(1)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-purple-900 mb-4">Minhas Avaliações</h1>
      <p className="text-gray-600 mb-8">Aqui você encontra o feedback que outros usuários deixaram sobre suas interações.</p>

      {/* Card de Resumo */}
      <div className="bg-purple-700 text-white p-6 rounded-xl shadow-lg mb-8 flex items-center justify-around">
        <div>
          <p className="text-lg">Avaliação Média</p>
          <div className="flex items-center">
            <FaStar className="text-yellow-300 text-4xl mr-2" />
            <p className="text-5xl font-bold">{mediaAvaliacoes}</p>
          </div>
        </div>
        <div className="h-16 border-l border-purple-500"></div>
        <div>
          <p className="text-lg">Total de Avaliações</p>
          <p className="text-5xl font-bold">{totalAvaliacoes}</p>
        </div>
      </div>
      
      {/* Abas para Navegação */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('recebidas')}
            className={`py-4 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'recebidas' 
              ? 'border-purple-600 text-purple-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Avaliações Recebidas ({mockAvaliacoesRecebidas.length})
          </button>
          <button
            onClick={() => setActiveTab('feitas')}
            className={`py-4 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'feitas' 
              ? 'border-purple-600 text-purple-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Avaliações Feitas ({mockAvaliacoesFeitas.length})
          </button>
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      <div>
        {activeTab === 'recebidas' && (
          <div>
            {mockAvaliacoesRecebidas.map(avaliacao => (
              <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} tipo="recebida" />
            ))}
          </div>
        )}

        {activeTab === 'feitas' && (
          <div>
            {mockAvaliacoesFeitas.map(avaliacao => (
              <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} tipo="feita" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}