export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-24 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
          🌄 Patagonia
        </h1>
        <p className="text-2xl mb-8 opacity-90">
          ¡Tu web Next.js funciona perfecto!
        </p>
        <p className="text-xl">
          <strong>Creada por Pablo - Vercel + Tailwind</strong>
        </p>
        <button 
          className="mt-8 px-8 py-4 bg-white/20 hover:bg-white/30 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30"
          onClick={() => alert('🎉 ¡NEXT.JS LIVE!')}
        >
          Probar Funciones
        </button>
      </div>
    </main>
  )
}
