import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-between p-4 font-mono">
      <section>
        <header className="rounded-md bg-gray-200 p-4">
          <a href="/index.html">home</a>
          {" | "}
          <a href="/about.html">about</a>
          {" | "}
          <a href="/contact.html">contact us</a>
        </header>

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

      <footer className="flex flex-col rounded-md bg-gray-200 p-4">
        <span>
          contact us via{" "}
          <a className="font-semibold" href="mailto:nsb.robotics@gmail.com">
            email
          </a>
        </span>
        <div>
          team:{" "}
          <a className="font-semibold" href="https://github.com/0x62/">0x62</a>{" "}
          <a className="font-semibold" href="https://github.com/obobed/">obob</a>{" "}
          <a className="font-semibold" href="https://codeberg.org/valtheouppy">valerie</a>{" "}
          <a className="font-semibold" href="https://github.com/vincentchen18">vincent</a>{" "}
          <a className="font-semibold" href="https://github.com/TiredTiddles">TiredTiddles</a>{" "}
          <a className="font-semibold" href="https://github.com/mewomewox9">mewomewo</a>
        </div>
      </footer>
    </div>
  );
}
