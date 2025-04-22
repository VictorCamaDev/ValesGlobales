import type { ReactNode } from "react"

interface SectionCardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
}

export function SectionCard({ title, children, icon }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-lg">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 flex items-center gap-3">
        {icon && <div className="text-white/90">{icon}</div>}
        <h2 className="font-medium tracking-wide">{title}</h2>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  )
}
