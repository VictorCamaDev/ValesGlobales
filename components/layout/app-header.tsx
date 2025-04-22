interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-5 px-6 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-10"></div>
      <div className="container mx-auto relative z-10">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400"></div>
    </header>
  )
}
