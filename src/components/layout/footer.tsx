
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white p-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} ReUse+ ♻️. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">

          {/* Gmail */}
          <Link
            href="mailto:reuse@gmail.com"
            className="flex items-center gap-1 hover:text-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm0 0l8 8 8-8" />
            </svg>
            Gmail
          </Link>

          {/* Instagram */}
          <Link
            href="https://instagram.com/"
            target="_blank"
            className="flex items-center gap-1 hover:text-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-2a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 17.5 7z" />
            </svg>
            Instagram
          </Link>

          {/* GitHub */}
          <Link
            href="https://github.com/Millena-Monteiro/ReUse-Frontend.git"
            target="_blank"
            className="flex items-center gap-1 hover:text-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.485 2 12.021c0 4.428 2.865 8.189 6.839 9.504.5.092.682-.216.682-.48 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.833.092-.647.35-1.089.636-1.34-2.221-.254-4.555-1.112-4.555-4.947 0-1.093.39-1.987 1.029-2.686-.103-.254-.446-1.275.098-2.656 0 0 .84-.27 2.75 1.026A9.563 9.563 0 0 1 12 6.844a9.56 9.56 0 0 1 2.5.336c1.91-1.296 2.748-1.026 2.748-1.026.546 1.381.202 2.402.1 2.656.64.699 1.028 1.593 1.028 2.686 0 3.845-2.337 4.69-4.566 4.938.36.309.682.92.682 1.855 0 1.339-.012 2.42-.012 2.75 0 .267.18.577.688.479A10.02 10.02 0 0 0 22 12.021C22 6.485 17.523 2 12 2z"/>
            </svg>
            GitHub
          </Link>

          {/* Telefone */}
          <Link
            href="tel:+550000000000"
            className="flex items-center gap-1 hover:text-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.28a1 1 0 01.949.684l1.518 4.555a1 1 0 01-.23.986l-1.548 1.548a15.978 15.978 0 006.586 6.586l1.548-1.548a1 1 0 01.986-.23l4.555 1.518a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Telefone
          </Link>

        </div>
      </div>
    </footer>
  );
}
