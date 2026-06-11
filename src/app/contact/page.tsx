import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function About() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-between p-4 font-mono">
      <section>
        <Header/>

        <div className="m-2">
          <h1 className="text-2xl font-bold">contact</h1>
          <p>email: <a href="mailto:nsb.robotics@gmail.com" className="text-blue-500">nsb.robotics@gmail.com</a></p>
        </div>
      </section>

      <section>
        <Footer/>
      </section>
    </div>
  );
}
