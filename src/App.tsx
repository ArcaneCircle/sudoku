import DarkMode from './components/DarkMode'

export default function App() {
  return (
    <main className="font-sans px-4 py-10 text-center text-xl text-black dark:text-gray-200">
      <DarkMode />
      <h1 className="text-4xl font-bold">Hello World</h1>
    </main>
  )
}
