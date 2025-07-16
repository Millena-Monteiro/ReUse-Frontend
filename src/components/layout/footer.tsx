export default function Footer() {
  return (
    <footer id="contato" className="bg-green-700 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">© 2025 ReUse. Todos os direitos reservados.</p>
        <div className="flex flex-col md:flex-row gap-4 text-sm">
          <a href="mailto:contato@reuse.com" className="hover:underline">
            ✉️ contato@reuse.com
          </a>
          <a href="tel:+5511999999999" className="hover:underline">
            📞 (11) 99999-9999
          </a>
          <a
            href="https://instagram.com/reuse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            📷 @reuse
          </a>
        </div>
      </div>
    </footer>
  );
}
