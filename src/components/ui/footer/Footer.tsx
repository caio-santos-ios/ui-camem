export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-400 dark:text-gray-600">
          CAMEM – Centro Acadêmico de Medicina de Maringá · {new Date().getUTCFullYear()}
        </p>
        <a
          href="https://instagram.com/camem.uem"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-600 hover:text-[#1f544b] dark:hover:text-[#4DBFB5] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          Instagram
        </a>
      </div>
    </footer>
  );
}