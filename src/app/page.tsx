import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Sobre from "../components/ui/sobre";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Sobre />
      </main>
      <Footer />
    </>
  );
}
