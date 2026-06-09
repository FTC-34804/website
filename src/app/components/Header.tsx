export function Header() {
  return (
    <header className="rounded-md bg-gray-200 p-4">
      <a href="/">home</a>
      {" | "}
      <a href="/about">about</a>
      {" | "}
      <a href="/contact">contact us</a>
    </header>
  )
}