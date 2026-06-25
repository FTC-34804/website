import Image from "next/image";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-between p-4 font-mono">
      <section>
        <Header page="home"/>

        <div className="m-2">
          <h1 className="text-2xl font-bold">hello</h1>
          <p>we are a robotics team from sydney, australia</p>
          <Image
            src="/thumbup.webp"
            alt="thumbs up icon"
            width={128}
            height={128}
            priority
          />
        </div>
      </section>

      <section>
        <Footer/>
      </section>
    </div>
  );
}
