// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hora = time.getHours().toString().padStart(2, '0');
  const minuto = time.getMinutes().toString().padStart(2, '0');
  const segundo = time.getSeconds().toString().padStart(2, '0');
  const fechaStr = time.toLocaleDateString('es-CL', { weekday:'short', day:'numeric', month:'short', year:'numeric' });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Barra superior */}
      <header className="flex justify-between items-center bg-black text-white text-sm px-6 py-2">
        <div>
          Miércoles, 29 de Abril de 2026 — Coyhaique, Región De Aysén &nbsp;
          <span className="bg-orange-600 px-2 py-0.5 rounded text-xs font-bold">Otoño</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="hover:opacity-80 transition-opacity">Facebook</button>
          <button className="hover:opacity-80 transition-opacity">Twitter</button>
          <button className="hover:opacity-80 transition-opacity">YouTube</button>
          <button className="ml-4 border border-gray-400 rounded px-2 py-0.5 hover:bg-gray-700">
            Oscuro
          </button>
          <div className="pl-4 border-l border-gray-500">Admin</div>
        </div>
      </header>

      {/* Logo y menú */}
      <section className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300">
        <div className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/mBDMTrV/logo-patagonia-al-dia.png"
            alt="Logo Patagonia al Día"
            className="w-16 h-auto"
          />
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Patagonia <span className="italic text-orange-600">al Día</span>
            </h1>
            <p className="text-xs uppercase font-semibold text-orange-400">
              Noticias de la Región de Aysén
            </p>
          </div>
        </div>

        {/* Reloj digital */}
        <div className="flex items-center space-x-2 text-gray-600 select-none">
          <div className="text-xs text-center mb-1">{fechaStr}</div>
          <div className="bg-black text-white rounded px-3 py-2 font-mono text-lg shadow-lg">
            {hora}
          </div>
          <div className="bg-black text-white rounded px-3 py-2 font-mono text-lg shadow-lg">
            {minuto}
          </div>
          <div className="bg-gray-300 text-black rounded px-3 py-2 font-mono text-lg shadow-lg">
            {segundo}
          </div>
        </div>
      </section>

      {/* Navegación principal */}
      <nav className="bg-green-800 text-white px-6 py-2 flex space-x-6 font-semibold uppercase tracking-widest text-sm">
        {['Inicio', 'Regional', 'Nacional', 'Entrevistas', 'Música', 'Nosotros'].map(
          (item) => (
            <a
              key={item}
              href="#"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              {item}
            </a>
          )
        )}
      </nav>

      {/* Barra de tiempo y clima */}
      <section className="bg-blue-900 text-blue-300 px-6 py-3 flex items-center gap-8 text-xs tracking-widest select-none overflow-x-auto">
        <div className="uppercase font-semibold tracking-wide border-r border-blue-700 pr-4">
          Región de Aysén <br />
          <span className="text-white">Coyhaique</span>
        </div>
        {[
          { time: '00:00', icon: '🌧', temp: 7 },
          { time: '03:00', icon: '🌧', temp: 7 },
          { time: '06:00', icon: '☁️', temp: 6 },
          { time: '09:00', icon: '☁️', temp: 6 },
          { time: '12:00', icon: '🌧', temp: 8 },
          { time: '15:00', icon: '🌧', temp: 8 },
          { time: '18:00', icon: '🌧', temp: 6 },
          { time: '21:00', icon: '🌧', temp: 6 },
        ].map(({ time, icon, temp }) => (
          <div key={time} className="flex flex-col items-center min-w-[40px]">
            <span>{time}</span>
            <span className="text-xl">{icon}</span>
            <span>{temp}°c</span>
          </div>
        ))}
      </section>

      {/* Ticker de noticias urgente */}
      <div className="bg-orange-600 text-white font-bold flex items-center gap-2 px-6 py-2 uppercase select-none">
        <span className="bg-black px-3 py-1 rounded text-xs">Urgente</span>
        <span>
          Gobierno Regional de Aysén anuncia inversión histórica en infraestructura vial para la
          Carretera Austral
        </span>
      </div>

      {/* Contenido principal */}
      <main className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
        {/* Barra lateral izquierda */}
        <aside className="w-60 flex flex-col gap-6 sticky top-20">
          <div>
            <h3 className="uppercase tracking-widest text-xs font-bold mb-3 border-l-4 border-orange-500 pl-2">
              Nuestras Redes
            </h3>
            <nav className="flex flex-col gap-3">
              <a href="#" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold flex justify-center hover:brightness-90 transition">
                Facebook
              </a>
              <a
                href="#"
                className="bg-gradient-to-r from-pink-400 via-orange-400 to-pink-600 text-white rounded px-4 py-2 font-semibold flex justify-center hover:brightness-90 transition"
              >
                Instagram
              </a>
              <a href="#" className="bg-red-600 text-white rounded px-4 py-2 font-semibold flex justify-center hover:brightness-90 transition">
                YouTube
              </a>
            </nav>
            <small className="text-gray-700 cursor-pointer mt-1 block underline">Editar redes</small>
          </div>

          <div className="space-y-2">
            <h3 className="uppercase tracking-widest text-xs font-bold">Comerciales</h3>
            <div className="bg-gray-300 w-full h-48 flex items-center justify-center text-gray-600 font-semibold">
              Ferretería Don Luis Coyhaique
            </div>
          </div>
        </aside>

        {/* Noticias principales */}
        <section className="flex-1 grid grid-cols-3 gap-6">
          {/* Noticia principal grande */}
          <article className="col-span-2 relative bg-gradient-to-b from-gray-400 to-gray-700 p-6 rounded text-white flex flex-col justify-end min-h-[350px] shadow-lg">
            <span className="absolute top-6 left-6 bg-green-900 font-bold uppercase px-2 py-1 rounded text-xs">
              Regional
            </span>
            <h2 className="text-2xl font-bold">
              Gobierno Regional de Aysén anuncia inversión histórica en infraestructura vial para la Carretera Austral
            </h2>
            <p className="mt-3 text-sm text-gray-200">
              La autoridad regional confirmó una inversión de más de 12.000 millones de pesos para pavimentar tramos clave de la ruta entre Coyhaique y Cochrane.
            </p>
            <footer className="mt-4 text-xs flex gap-3 text-gray-300">
              <span>Redacción Patagonia</span>
              <span>29-04-2026</span>
            </footer>
          </article>

          {/* Noticias secundarias */}
          <div className="flex flex-col gap-6">
            <article className="bg-gray-800 text-white p-4 rounded">
              <span className="bg-gray-600 px-2 py-1 uppercase text-xs font-bold inline-block mb-2">Nacional</span>
              <h3 className="text-sm font-semibold">
                Senado aprueba proyecto de ley que beneficiará a comunidades rurales de zonas extremas de Chile...
              </h3>
              <time className="text-xs block mt-2 opacity-80">28-04-2026</time>
            </article>

            <article className="bg-orange-700 text-white p-4 rounded">
              <span className="bg-orange-600 px-2 py-1 uppercase text-xs font-bold inline-block mb-2">Entrevistas</span>
              <h3 className="text-sm font-semibold">
                Entrevista: Alcalde de Coyhaique habla sobre los desafíos del turismo sostenible en la Patagonia
              </h3>
              <time className="text-xs block mt-2 opacity-80">27-04-2026</time>
            </article>

            <article className="bg-green-900 text-white p-4 rounded">
              <span className="bg-green-800 px-2 py-1 uppercase text-xs font-bold inline-block mb-2">Regional</span>
              <h3 className="text-sm font-semibold">
                Comunidades de Puerto Cisnes exigen pavimentación de acceso al poblado tras décadas de espera
              </h3>
              <time className="text-xs block mt-2 opacity-80">26-04-2026</time>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
