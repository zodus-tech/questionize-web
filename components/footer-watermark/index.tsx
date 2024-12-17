import Link from 'next/link'

export default function Watermark() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-300 text-sm w-full">
      <Link
        target="_blank"
        href={'https://zodus.com.br'}
        className="underline underline-offset-4"
        rel="noopener noreferrer"
      >
        Zodus
      </Link>{' '}
      @ {currentYear} - UNISAGRADO
    </footer>
  )
}
