export const Footer = () => (
  <footer className="border-t border-white/5 bg-slate-950 py-12 px-6 mt-20">
    <div className="max-w-7xl mx-auto mb-10 pb-6 border-b border-white/5">
      <p className="text-center text-md leading-relaxed">
        <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent font-medium">
          Hecho con pasión desde Nicaragua 🇳🇮
        </span>
        <br />
        <span className="text-slate-500 text-xs">
          Porque los grandes proyectos empiezan con una conversación.
          <br />
          El tuyo puede empezar hoy.
        </span>
      </p>
    </div>

    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-bold text-xl text-white flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
        DETDevs
      </div>
      <div className="text-xs text-slate-500 text-center md:text-right">
        © {new Date().getFullYear()} DETDevs Engineering.
        <br />
        Nicaragua to the World.
      </div>
    </div>
  </footer>
);
