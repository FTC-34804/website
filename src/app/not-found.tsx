import Image from "next/image";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export default function NotFound() {
  return (
    <div className="flex max-h-screen flex-1 flex-col justify-between p-4 font-mono">
      <section>
        <Header page="notfound"/>
      </section>
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="flex w-[50vh]">
          <Image
            alt="404 not found"
            src="/notfound.png"
            width={800}
            height={600}
            className="rotate-270"
            priority
          />
        </div>
        <p>This page could not be found.</p>
      </div>
      <section>
        <Footer/>
      </section>
    </div>
  );
}
