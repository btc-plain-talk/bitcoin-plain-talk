'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'pcm', name: 'Pidgin' },
  { code: 'ki', name: 'Kikuyu' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'lwg', name: 'Wanga' },
  { code: 'ig', name: 'Igbo' },
];

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current language from URL params or default to 'en'
  const currentLang = searchParams.get('lang') || 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentLang}
      onChange={handleLanguageChange}
      className="rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
