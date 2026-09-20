export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-widest uppercase text-[#6E645A] dark:text-[#A69A8B]">
      {children}
    </p>
  );
}
