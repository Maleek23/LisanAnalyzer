/**
 * AlQuran Cloud API Service
 * Free API for accessing Quranic verses and translations
 * Documentation: https://alquran.cloud/api
 */

const API_BASE = 'http://api.alquran.cloud/v1';

export interface QuranEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: 'text' | 'audio';
  type: 'translation' | 'tafsir' | 'quran';
  direction: 'rtl' | 'ltr';
}

export interface QuranAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: QuranAyah[];
}

export interface QuranResponse {
  code: number;
  status: string;
  data: QuranSurah | QuranAyah | QuranEdition[];
}

/**
 * Fetch all available editions (translations, tafsirs, audio)
 */
export async function fetchEditions(
  format?: 'text' | 'audio',
  language?: string,
  type?: 'translation' | 'tafsir'
): Promise<QuranEdition[]> {
  const params = new URLSearchParams();
  if (format) params.append('format', format);
  if (language) params.append('language', language);
  if (type) params.append('type', type);

  const url = `${API_BASE}/edition${params.toString() ? `?${params}` : ''}`;
  const response = await fetch(url);
  const data: QuranResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`API Error: ${data.status}`);
  }

  return data.data as QuranEdition[];
}

/**
 * Fetch a specific Surah (chapter) with optional translation
 */
export async function fetchSurah(
  surahNumber: number,
  edition: string = 'quran-uthmani'
): Promise<QuranSurah> {
  const url = `${API_BASE}/surah/${surahNumber}/${edition}`;
  const response = await fetch(url);
  const data: QuranResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`API Error: ${data.status}`);
  }

  return data.data as QuranSurah;
}

/**
 * Fetch a specific Ayah (verse) with optional translation
 */
export async function fetchAyah(
  reference: string | number,
  edition: string = 'quran-uthmani'
): Promise<QuranAyah> {
  const url = `${API_BASE}/ayah/${reference}/${edition}`;
  const response = await fetch(url);
  const data: QuranResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`API Error: ${data.status}`);
  }

  return data.data as QuranAyah;
}

/**
 * Fetch multiple editions of the same Surah for translation comparison
 */
export async function fetchSurahMultipleEditions(
  surahNumber: number,
  editions: string[]
): Promise<QuranSurah[]> {
  const editionsParam = editions.join(',');
  const url = `${API_BASE}/surah/${surahNumber}/editions/${editionsParam}`;
  const response = await fetch(url);
  const data: QuranResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`API Error: ${data.status}`);
  }

  // API returns array of surahs when multiple editions requested
  return data.data as unknown as QuranSurah[];
}

/**
 * Fetch the complete Quran in a specific edition
 */
export async function fetchCompleteQuran(
  edition: string = 'quran-uthmani'
): Promise<{ surahs: QuranSurah[] }> {
  const url = `${API_BASE}/quran/${edition}`;
  const response = await fetch(url);
  const data: QuranResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`API Error: ${data.status}`);
  }

  return data.data as unknown as { surahs: QuranSurah[] };
}

/**
 * Get recommended English translators
 */
export const RECOMMENDED_TRANSLATORS = [
  { id: 'en.sahih', name: 'Sahih International' },
  { id: 'en.asad', name: 'Muhammad Asad' },
  { id: 'en.pickthall', name: 'Marmaduke Pickthall' },
  { id: 'en.yusufali', name: 'Yusuf Ali' },
  { id: 'en.ahmedali', name: 'Ahmed Ali' },
  { id: 'en.maududi', name: 'Abul Ala Maududi' },
  { id: 'en.shakir', name: 'Mohammad Habib Shakir' },
  { id: 'en.haleem', name: 'Abdel Haleem' },
] as const;
