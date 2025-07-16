import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white p-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} ReUse+ ♻️. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="mailto:contato@reuse.com" className="hover:text-green-200">E-mail</Link>
          <Link href="https://instagram.com/reuse" target="_blank" className="hover:text-green-200">Instagram</Link>
          <Link href="tel:+550000000000" className="hover:text-green-200">Telefone</Link>
        </div>
      </div>
    </footer>
  );
}
