import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Gallery() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-between p-4 font-mono">
      <section>
        <Header/>

        <div className="m-2">
          <h1 className="text-2xl font-bold">gallery</h1>
        </div>
      </section>

      <section>
        <Footer/>
      </section>
    </div>
  );
}
