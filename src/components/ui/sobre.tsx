export default function Sobre() {
  return (
    <section className="bg-gray-50 py-12 px-4 text-gray-800">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">ReUse ♻️</h2>
        <p className="text-lg mt-2 text-gray-600">Conheça nossa essência, propósito e princípios</p>
      </div>

      {/* SOBRE - com abre/fecha */}
      <details className="max-w-4xl mx-auto bg-green-100 p-6 rounded-xl shadow-md group open:bg-white open:shadow-lg transition duration-300 cursor-pointer mb-6">
        <summary className="text-green-700 font-semibold text-lg mb-2">
          Clique para saber mais sobre a ReUse ♻️
        </summary>
        <p className="text-gray-700 mt-2">
          Somos uma plataforma comprometida com a sustentabilidade e o reaproveitamento consciente.
          Nossa missão é conectar pessoas através da reutilização responsável de recursos.
        </p>
      </details>

      {/* Missão, Visão e Valores - cards clicáveis com efeito de cor */}
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        <label className="bg-green-100 hover:bg-white transition-all duration-300 cursor-pointer p-6 rounded-2xl shadow-md block text-left">
          <h3 className="text-2xl font-semibold mb-3 text-green-700">Missão</h3>
          <p className="text-gray-700">
            Promover a reutilização responsável de itens e fortalecer a consciência ambiental nas comunidades.
          </p>
        </label>

        <label className="bg-green-100 hover:bg-white transition-all duration-300 cursor-pointer p-6 rounded-2xl shadow-md block text-left">
          <h3 className="text-2xl font-semibold mb-3 text-green-700">Visão</h3>
          <p className="text-gray-700">
            Ser referência em reaproveitamento consciente e incentivar práticas sustentáveis em todo o Brasil.
          </p>
        </label>

        <label className="bg-green-100 hover:bg-white transition-all duration-300 cursor-pointer p-6 rounded-2xl shadow-md block text-left">
          <h3 className="text-2xl font-semibold mb-3 text-green-700">Valores</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Consciência ecológica</li>
            <li>Ética e responsabilidade</li>
            <li>Respeito à diversidade</li>
            <li>Transparência e confiança</li>
          </ul>
        </label>
      </div>
    </section>
  );
}
