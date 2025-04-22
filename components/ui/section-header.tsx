interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="bg-emerald-500 text-white py-3 px-4 rounded-t-md font-medium">
      <h2 className="font-medium">{title}</h2>
    </div>
  )
}
