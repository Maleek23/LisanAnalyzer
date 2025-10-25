import { db } from './db';
import { roots } from '@shared/schema';
import { sql, eq } from 'drizzle-orm';

/**
 * Comprehensive Quranic Vocabulary Expansion
 * Based on frequency data from Quranic Arabic Corpus
 * Includes 400+ most common words with roots, meanings, and transliterations
 */

interface WordData {
  arabic: string;
  root: string;
  transliteration: string;
  meaning: string;
  frequency: number;
  partOfSpeech: string;
}

const commonQuranicWords: WordData[] = [
  // TOP 100 MOST FREQUENT WORDS (Particles, Prepositions, Pronouns, Core Nouns)
  { arabic: 'مِن', root: 'م-ن', transliteration: 'min', meaning: 'from, of, some', frequency: 3226, partOfSpeech: 'Preposition' },
  { arabic: 'الله', root: 'أ-ل-ه', transliteration: 'Allah', meaning: 'God', frequency: 2699, partOfSpeech: 'Proper Noun' },
  { arabic: 'في', root: 'ف-ي', transliteration: 'fi', meaning: 'in, at', frequency: 1701, partOfSpeech: 'Preposition' },
  { arabic: 'إن', root: 'إ-ن', transliteration: 'inna', meaning: 'indeed, verily', frequency: 1682, partOfSpeech: 'Particle' },
  { arabic: 'على', root: 'ع-ل-ي', transliteration: 'ʿala', meaning: 'on, upon, over', frequency: 1445, partOfSpeech: 'Preposition' },
  { arabic: 'الذي', root: 'ل-ذ-ي', transliteration: 'alladhi', meaning: 'who, which, that', frequency: 1442, partOfSpeech: 'Relative Pronoun' },
  { arabic: 'لا', root: 'ل-ا', transliteration: 'la', meaning: 'no, not', frequency: 1364, partOfSpeech: 'Negative Particle' },
  { arabic: 'ما', root: 'م-ا', transliteration: 'ma', meaning: 'what, that which', frequency: 1266, partOfSpeech: 'Relative Pronoun' },
  { arabic: 'رب', root: 'ر-ب-ب', transliteration: 'rabb', meaning: 'Lord, master, sustainer', frequency: 975, partOfSpeech: 'Noun' },
  { arabic: 'إلى', root: 'إ-ل-ى', transliteration: 'ila', meaning: 'to, towards', frequency: 742, partOfSpeech: 'Preposition' },
  
  { arabic: 'من', root: 'م-ن', transliteration: 'man', meaning: 'who, whoever', frequency: 606, partOfSpeech: 'Relative Pronoun' },
  { arabic: 'إن', root: 'إ-ن', transliteration: 'in', meaning: 'if (conditional)', frequency: 578, partOfSpeech: 'Conditional Particle' },
  { arabic: 'أن', root: 'أ-ن', transliteration: 'an', meaning: 'that, to (infinitive)', frequency: 578, partOfSpeech: 'Conjunction' },
  { arabic: 'إلا', root: 'إ-ل-ا', transliteration: 'illa', meaning: 'except, unless, but', frequency: 558, partOfSpeech: 'Restriction Particle' },
  { arabic: 'ذلك', root: 'ذ-ل-ك', transliteration: 'dhalika', meaning: 'that, those', frequency: 520, partOfSpeech: 'Demonstrative' },
  { arabic: 'عن', root: 'ع-ن', transliteration: 'ʿan', meaning: 'from, about, concerning', frequency: 465, partOfSpeech: 'Preposition' },
  { arabic: 'أرض', root: 'أ-ر-ض', transliteration: 'ard', meaning: 'earth, land, ground', frequency: 461, partOfSpeech: 'Noun' },
  { arabic: 'قد', root: 'ق-د', transliteration: 'qad', meaning: 'verily, indeed, already', frequency: 406, partOfSpeech: 'Particle' },
  { arabic: 'إذا', root: 'إ-ذ-ا', transliteration: 'idha', meaning: 'when, if', frequency: 405, partOfSpeech: 'Time Adverb' },
  { arabic: 'قوم', root: 'ق-و-م', transliteration: 'qawm', meaning: 'people, nation, community', frequency: 383, partOfSpeech: 'Noun' },
  
  { arabic: 'آية', root: 'أ-ي-ة', transliteration: 'ayah', meaning: 'sign, verse, miracle', frequency: 382, partOfSpeech: 'Noun' },
  { arabic: 'كل', root: 'ك-ل-ل', transliteration: 'kull', meaning: 'all, every, whole', frequency: 358, partOfSpeech: 'Noun' },
  { arabic: 'لم', root: 'ل-م', transliteration: 'lam', meaning: 'did not (negative past)', frequency: 353, partOfSpeech: 'Negative Particle' },
  { arabic: 'ثم', root: 'ث-م', transliteration: 'thumma', meaning: 'then, moreover', frequency: 338, partOfSpeech: 'Conjunction' },
  { arabic: 'رسول', root: 'ر-س-ل', transliteration: 'rasul', meaning: 'messenger, apostle', frequency: 332, partOfSpeech: 'Noun' },
  { arabic: 'يوم', root: 'ي-و-م', transliteration: 'yawm', meaning: 'day, time', frequency: 325, partOfSpeech: 'Noun' },
  { arabic: 'عذاب', root: 'ع-ذ-ب', transliteration: 'ʿadhab', meaning: 'punishment, torment, chastisement', frequency: 322, partOfSpeech: 'Noun' },
  { arabic: 'هذا', root: 'ه-ذ-ا', transliteration: 'hadha', meaning: 'this (masculine)', frequency: 317, partOfSpeech: 'Demonstrative' },
  { arabic: 'سماء', root: 'س-م-و', transliteration: 'sama', meaning: 'sky, heaven', frequency: 310, partOfSpeech: 'Noun' },
  { arabic: 'نفس', root: 'ن-ف-س', transliteration: 'nafs', meaning: 'soul, self, person', frequency: 295, partOfSpeech: 'Noun' },
  
  { arabic: 'شيء', root: 'ش-ي-ء', transliteration: 'shay', meaning: 'thing, something, anything', frequency: 283, partOfSpeech: 'Noun' },
  { arabic: 'أو', root: 'أ-و', transliteration: 'aw', meaning: 'or, either', frequency: 280, partOfSpeech: 'Conjunction' },
  { arabic: 'كتاب', root: 'ك-ت-ب', transliteration: 'kitab', meaning: 'book, scripture, writing', frequency: 260, partOfSpeech: 'Noun' },
  { arabic: 'بين', root: 'ب-ي-ن', transliteration: 'bayna', meaning: 'between, among', frequency: 243, partOfSpeech: 'Preposition' },
  { arabic: 'حق', root: 'ح-ق-ق', transliteration: 'haqq', meaning: 'truth, right, just', frequency: 242, partOfSpeech: 'Noun' },
  { arabic: 'ناس', root: 'ن-و-س', transliteration: 'nas', meaning: 'people, mankind, humanity', frequency: 241, partOfSpeech: 'Noun' },
  { arabic: 'إذ', root: 'إ-ذ', transliteration: 'idh', meaning: 'when, as, since', frequency: 239, partOfSpeech: 'Time Adverb' },
  { arabic: 'أولئك', root: 'أ-ل-ي', transliteration: 'ulai', meaning: 'those, they', frequency: 204, partOfSpeech: 'Demonstrative' },
  { arabic: 'قبل', root: 'ق-ب-ل', transliteration: 'qabl', meaning: 'before, prior to', frequency: 197, partOfSpeech: 'Noun' },
  { arabic: 'مؤمن', root: 'أ-م-ن', transliteration: 'mumin', meaning: 'believer, faithful', frequency: 195, partOfSpeech: 'Noun' },
  
  { arabic: 'لو', root: 'ل-و', transliteration: 'law', meaning: 'if (contrary to fact)', frequency: 184, partOfSpeech: 'Conditional' },
  { arabic: 'سبيل', root: 'س-ب-ل', transliteration: 'sabil', meaning: 'path, way, road', frequency: 176, partOfSpeech: 'Noun' },
  { arabic: 'أمر', root: 'أ-م-ر', transliteration: 'amr', meaning: 'command, matter, affair', frequency: 166, partOfSpeech: 'Noun' },
  { arabic: 'عند', root: 'ع-ن-د', transliteration: 'ʿinda', meaning: 'at, with, in the presence of', frequency: 160, partOfSpeech: 'Preposition' },
  { arabic: 'مع', root: 'م-ع', transliteration: 'maʿa', meaning: 'with, along with, together', frequency: 159, partOfSpeech: 'Preposition' },
  { arabic: 'بعض', root: 'ب-ع-ض', transliteration: 'baʿd', meaning: 'some, part of', frequency: 157, partOfSpeech: 'Noun' },
  
  // RELIGIOUS TERMS (50-100)
  { arabic: 'إيمان', root: 'أ-م-ن', transliteration: 'iman', meaning: 'faith, belief', frequency: 45, partOfSpeech: 'Noun' },
  { arabic: 'صلاة', root: 'ص-ل-و', transliteration: 'salah', meaning: 'prayer, worship', frequency: 67, partOfSpeech: 'Noun' },
  { arabic: 'زكاة', root: 'ز-ك-و', transliteration: 'zakah', meaning: 'charity, alms, purification', frequency: 30, partOfSpeech: 'Noun' },
  { arabic: 'صوم', root: 'ص-و-م', transliteration: 'sawm', meaning: 'fasting', frequency: 14, partOfSpeech: 'Noun' },
  { arabic: 'حج', root: 'ح-ج-ج', transliteration: 'hajj', meaning: 'pilgrimage', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'جنة', root: 'ج-ن-ن', transliteration: 'jannah', meaning: 'paradise, garden', frequency: 147, partOfSpeech: 'Noun' },
  { arabic: 'نار', root: 'ن-و-ر', transliteration: 'nar', meaning: 'fire, hell', frequency: 145, partOfSpeech: 'Noun' },
  { arabic: 'ملك', root: 'م-ل-ك', transliteration: 'malak', meaning: 'angel', frequency: 88, partOfSpeech: 'Noun' },
  { arabic: 'شيطان', root: 'ش-ط-ن', transliteration: 'shaytan', meaning: 'devil, Satan', frequency: 88, partOfSpeech: 'Noun' },
  { arabic: 'كافر', root: 'ك-ف-ر', transliteration: 'kafir', meaning: 'disbeliever, denier', frequency: 152, partOfSpeech: 'Noun' },
  
  { arabic: 'نبي', root: 'ن-ب-أ', transliteration: 'nabi', meaning: 'prophet', frequency: 75, partOfSpeech: 'Noun' },
  { arabic: 'موسى', root: 'م-و-س', transliteration: 'Musa', meaning: 'Moses', frequency: 136, partOfSpeech: 'Proper Noun' },
  { arabic: 'عيسى', root: 'ع-ي-س', transliteration: 'Isa', meaning: 'Jesus', frequency: 25, partOfSpeech: 'Proper Noun' },
  { arabic: 'إبراهيم', root: 'ب-ر-ه', transliteration: 'Ibrahim', meaning: 'Abraham', frequency: 69, partOfSpeech: 'Proper Noun' },
  { arabic: 'نوح', root: 'ن-و-ح', transliteration: 'Nuh', meaning: 'Noah', frequency: 43, partOfSpeech: 'Proper Noun' },
  { arabic: 'محمد', root: 'ح-م-د', transliteration: 'Muhammad', meaning: 'Muhammad', frequency: 4, partOfSpeech: 'Proper Noun' },
  { arabic: 'آدم', root: 'أ-د-م', transliteration: 'Adam', meaning: 'Adam', frequency: 25, partOfSpeech: 'Proper Noun' },
  
  // VERBS & ACTIONS (100-200)
  { arabic: 'علم', root: 'ع-ل-م', transliteration: 'ʿilm', meaning: 'knowledge, to know', frequency: 854, partOfSpeech: 'Verb/Noun' },
  { arabic: 'قال', root: 'ق-و-ل', transliteration: 'qala', meaning: 'to say, speak', frequency: 1722, partOfSpeech: 'Verb' },
  { arabic: 'جاء', root: 'ج-ي-ء', transliteration: 'jaa', meaning: 'to come, bring', frequency: 284, partOfSpeech: 'Verb' },
  { arabic: 'كان', root: 'ك-و-ن', transliteration: 'kana', meaning: 'to be, was', frequency: 1358, partOfSpeech: 'Verb' },
  { arabic: 'عمل', root: 'ع-م-ل', transliteration: 'ʿamila', meaning: 'to work, do, act', frequency: 360, partOfSpeech: 'Verb' },
  { arabic: 'آمن', root: 'أ-م-ن', transliteration: 'amana', meaning: 'to believe, have faith', frequency: 537, partOfSpeech: 'Verb' },
  { arabic: 'كفر', root: 'ك-ف-ر', transliteration: 'kafara', meaning: 'to disbelieve, reject', frequency: 525, partOfSpeech: 'Verb' },
  { arabic: 'ذهب', root: 'ذ-ه-ب', transliteration: 'dhahaba', meaning: 'to go, depart', frequency: 56, partOfSpeech: 'Verb' },
  { arabic: 'رجع', root: 'ر-ج-ع', transliteration: 'rajaʿa', meaning: 'to return, go back', frequency: 28, partOfSpeech: 'Verb' },
  { arabic: 'أخذ', root: 'أ-خ-ذ', transliteration: 'akhadha', meaning: 'to take, seize', frequency: 87, partOfSpeech: 'Verb' },
  
  { arabic: 'جعل', root: 'ج-ع-ل', transliteration: 'jaʿala', meaning: 'to make, create, place', frequency: 346, partOfSpeech: 'Verb' },
  { arabic: 'أعطى', root: 'ع-ط-ي', transliteration: 'aʿta', meaning: 'to give', frequency: 56, partOfSpeech: 'Verb' },
  { arabic: 'أنزل', root: 'ن-ز-ل', transliteration: 'anzala', meaning: 'to send down, reveal', frequency: 293, partOfSpeech: 'Verb' },
  { arabic: 'خلق', root: 'خ-ل-ق', transliteration: 'khalaqa', meaning: 'to create', frequency: 261, partOfSpeech: 'Verb' },
  { arabic: 'هدى', root: 'ه-د-ي', transliteration: 'hada', meaning: 'to guide', frequency: 317, partOfSpeech: 'Verb' },
  { arabic: 'ضل', root: 'ض-ل-ل', transliteration: 'dalla', meaning: 'to go astray, err', frequency: 191, partOfSpeech: 'Verb' },
  { arabic: 'رزق', root: 'ر-ز-ق', transliteration: 'razaqa', meaning: 'to provide, sustain', frequency: 123, partOfSpeech: 'Verb' },
  { arabic: 'شكر', root: 'ش-ك-ر', transliteration: 'shakara', meaning: 'to thank, be grateful', frequency: 75, partOfSpeech: 'Verb' },
  { arabic: 'كذب', root: 'ك-ذ-ب', transliteration: 'kadhaba', meaning: 'to lie, deny', frequency: 154, partOfSpeech: 'Verb' },
  { arabic: 'صدق', root: 'ص-د-ق', transliteration: 'sadaqa', meaning: 'to be truthful, verify', frequency: 152, partOfSpeech: 'Verb' },
  
  { arabic: 'دعا', root: 'د-ع-و', transliteration: 'daʿa', meaning: 'to call, invoke, pray', frequency: 211, partOfSpeech: 'Verb' },
  { arabic: 'سجد', root: 'س-ج-د', transliteration: 'sajada', meaning: 'to prostrate, bow', frequency: 92, partOfSpeech: 'Verb' },
  { arabic: 'ذكر', root: 'ذ-ك-ر', transliteration: 'dhakara', meaning: 'to remember, mention', frequency: 292, partOfSpeech: 'Verb' },
  { arabic: 'نسي', root: 'ن-س-ي', transliteration: 'nasiya', meaning: 'to forget', frequency: 45, partOfSpeech: 'Verb' },
  { arabic: 'فعل', root: 'ف-ع-ل', transliteration: 'faʿala', meaning: 'to do, act', frequency: 107, partOfSpeech: 'Verb' },
  { arabic: 'ترك', root: 'ت-ر-ك', transliteration: 'taraka', meaning: 'to leave, abandon', frequency: 42, partOfSpeech: 'Verb' },
  { arabic: 'سمع', root: 'س-م-ع', transliteration: 'samiʿa', meaning: 'to hear, listen', frequency: 185, partOfSpeech: 'Verb' },
  { arabic: 'رأى', root: 'ر-أ-ي', transliteration: 'raa', meaning: 'to see, perceive', frequency: 328, partOfSpeech: 'Verb' },
  { arabic: 'فهم', root: 'ف-ه-م', transliteration: 'fahima', meaning: 'to understand', frequency: 20, partOfSpeech: 'Verb' },
  { arabic: 'قرأ', root: 'ق-ر-أ', transliteration: 'qaraa', meaning: 'to read, recite', frequency: 17, partOfSpeech: 'Verb' },
  
  // COMMONLY MISINTERPRETED WORDS (200-250)
  { arabic: 'ضرب', root: 'ض-ر-ب', transliteration: 'daraba', meaning: 'to strike/separate/set forth examples - CONTEXT DEPENDENT', frequency: 58, partOfSpeech: 'Verb' },
  { arabic: 'قوامون', root: 'ق-و-م', transliteration: 'qawwamun', meaning: 'maintainers, supporters, protectors', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'جلباب', root: 'ج-ل-ب', transliteration: 'jilbab', meaning: 'outer garment, cloak', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'نشوز', root: 'ن-ش-ز', transliteration: 'nushuz', meaning: 'discord, rebellion, rising', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'خمار', root: 'خ-م-ر', transliteration: 'khimar', meaning: 'head covering, veil', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'فتنة', root: 'ف-ت-ن', transliteration: 'fitnah', meaning: 'trial, persecution, temptation', frequency: 60, partOfSpeech: 'Noun' },
  { arabic: 'جهاد', root: 'ج-ه-د', transliteration: 'jihad', meaning: 'struggle, striving, effort', frequency: 41, partOfSpeech: 'Noun' },
  { arabic: 'قتل', root: 'ق-ت-ل', transliteration: 'qatala', meaning: 'to kill, fight', frequency: 187, partOfSpeech: 'Verb' },
  { arabic: 'حجاب', root: 'ح-ج-ب', transliteration: 'hijab', meaning: 'barrier, partition, veil', frequency: 7, partOfSpeech: 'Noun' },
  { arabic: 'طلاق', root: 'ط-ل-ق', transliteration: 'talaq', meaning: 'divorce', frequency: 3, partOfSpeech: 'Noun' },
  
  { arabic: 'نكاح', root: 'ن-ك-ح', transliteration: 'nikah', meaning: 'marriage', frequency: 23, partOfSpeech: 'Noun' },
  { arabic: 'ميراث', root: 'و-ر-ث', transliteration: 'mirath', meaning: 'inheritance', frequency: 3, partOfSpeech: 'Noun' },
  { arabic: 'رجم', root: 'ر-ج-م', transliteration: 'rajm', meaning: 'stoning, throwing, guessing', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'شهادة', root: 'ش-ه-د', transliteration: 'shahadah', meaning: 'testimony, witness', frequency: 160, partOfSpeech: 'Noun' },
  { arabic: 'عبد', root: 'ع-ب-د', transliteration: 'ʿabd', meaning: 'servant, slave, worshipper', frequency: 152, partOfSpeech: 'Noun' },
  { arabic: 'حر', root: 'ح-ر-ر', transliteration: 'hurr', meaning: 'free person', frequency: 3, partOfSpeech: 'Noun' },
  { arabic: 'غنيمة', root: 'غ-ن-م', transliteration: 'ghanimah', meaning: 'war booty, spoils', frequency: 7, partOfSpeech: 'Noun' },
  { arabic: 'ظلم', root: 'ظ-ل-م', transliteration: 'zulm', meaning: 'injustice, oppression, wrongdoing', frequency: 315, partOfSpeech: 'Noun' },
  { arabic: 'عدل', root: 'ع-د-ل', transliteration: 'ʿadl', meaning: 'justice, fairness', frequency: 28, partOfSpeech: 'Noun' },
  { arabic: 'رحمة', root: 'ر-ح-م', transliteration: 'rahmah', meaning: 'mercy, compassion', frequency: 114, partOfSpeech: 'Noun' },
  
  // FAMILY & SOCIAL TERMS (250-300)
  { arabic: 'أب', root: 'أ-ب-و', transliteration: 'ab', meaning: 'father', frequency: 117, partOfSpeech: 'Noun' },
  { arabic: 'أم', root: 'أ-م-م', transliteration: 'umm', meaning: 'mother', frequency: 35, partOfSpeech: 'Noun' },
  { arabic: 'ابن', root: 'ب-ن-ي', transliteration: 'ibn', meaning: 'son', frequency: 113, partOfSpeech: 'Noun' },
  { arabic: 'بنت', root: 'ب-ن-ي', transliteration: 'bint', meaning: 'daughter', frequency: 5, partOfSpeech: 'Noun' },
  { arabic: 'أخ', root: 'أ-خ-و', transliteration: 'akh', meaning: 'brother', frequency: 109, partOfSpeech: 'Noun' },
  { arabic: 'أخت', root: 'أ-خ-و', transliteration: 'ukht', meaning: 'sister', frequency: 8, partOfSpeech: 'Noun' },
  { arabic: 'زوج', root: 'ز-و-ج', transliteration: 'zawj', meaning: 'spouse, pair, couple', frequency: 81, partOfSpeech: 'Noun' },
  { arabic: 'ولد', root: 'و-ل-د', transliteration: 'walad', meaning: 'child, offspring', frequency: 22, partOfSpeech: 'Noun' },
  { arabic: 'قريب', root: 'ق-ر-ب', transliteration: 'qarib', meaning: 'near, relative, close', frequency: 40, partOfSpeech: 'Noun/Adj' },
  { arabic: 'يتيم', root: 'ي-ت-م', transliteration: 'yatim', meaning: 'orphan', frequency: 23, partOfSpeech: 'Noun' },
  
  { arabic: 'مسكين', root: 'س-ك-ن', transliteration: 'miskin', meaning: 'poor person, needy', frequency: 25, partOfSpeech: 'Noun' },
  { arabic: 'فقير', root: 'ف-ق-ر', transliteration: 'faqir', meaning: 'poor, needy', frequency: 13, partOfSpeech: 'Noun' },
  { arabic: 'غني', root: 'غ-ن-ي', transliteration: 'ghani', meaning: 'rich, self-sufficient', frequency: 64, partOfSpeech: 'Adj' },
  { arabic: 'جار', root: 'ج-و-ر', transliteration: 'jar', meaning: 'neighbor', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'صاحب', root: 'ص-ح-ب', transliteration: 'sahib', meaning: 'companion, friend', frequency: 46, partOfSpeech: 'Noun' },
  { arabic: 'عدو', root: 'ع-د-و', transliteration: 'ʿaduw', meaning: 'enemy', frequency: 98, partOfSpeech: 'Noun' },
  { arabic: 'صديق', root: 'ص-د-ق', transliteration: 'sadiq', meaning: 'friend, truthful', frequency: 3, partOfSpeech: 'Noun' },
  
  // NATURE & CREATION (300-350)
  { arabic: 'شمس', root: 'ش-م-س', transliteration: 'shams', meaning: 'sun', frequency: 33, partOfSpeech: 'Noun' },
  { arabic: 'قمر', root: 'ق-م-ر', transliteration: 'qamar', meaning: 'moon', frequency: 27, partOfSpeech: 'Noun' },
  { arabic: 'نجم', root: 'ن-ج-م', transliteration: 'najm', meaning: 'star', frequency: 13, partOfSpeech: 'Noun' },
  { arabic: 'سحاب', root: 'س-ح-ب', transliteration: 'sahab', meaning: 'cloud', frequency: 12, partOfSpeech: 'Noun' },
  { arabic: 'مطر', root: 'م-ط-ر', transliteration: 'matar', meaning: 'rain', frequency: 28, partOfSpeech: 'Noun' },
  { arabic: 'ماء', root: 'م-و-ه', transliteration: 'maa', meaning: 'water', frequency: 63, partOfSpeech: 'Noun' },
  { arabic: 'نهر', root: 'ن-ه-ر', transliteration: 'nahr', meaning: 'river', frequency: 51, partOfSpeech: 'Noun' },
  { arabic: 'بحر', root: 'ب-ح-ر', transliteration: 'bahr', meaning: 'sea, ocean', frequency: 41, partOfSpeech: 'Noun' },
  { arabic: 'جبل', root: 'ج-ب-ل', transliteration: 'jabal', meaning: 'mountain', frequency: 39, partOfSpeech: 'Noun' },
  { arabic: 'شجر', root: 'ش-ج-ر', transliteration: 'shajar', meaning: 'tree', frequency: 26, partOfSpeech: 'Noun' },
  
  { arabic: 'نبات', root: 'ن-ب-ت', transliteration: 'nabat', meaning: 'plant, vegetation', frequency: 26, partOfSpeech: 'Noun' },
  { arabic: 'ثمر', root: 'ث-م-ر', transliteration: 'thamar', meaning: 'fruit', frequency: 29, partOfSpeech: 'Noun' },
  { arabic: 'حيوان', root: 'ح-ي-ي', transliteration: 'hayawan', meaning: 'animal, living being', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'طير', root: 'ط-ي-ر', transliteration: 'tayr', meaning: 'bird', frequency: 18, partOfSpeech: 'Noun' },
  { arabic: 'دابة', root: 'د-ب-ب', transliteration: 'dabbah', meaning: 'creature, beast', frequency: 14, partOfSpeech: 'Noun' },
  { arabic: 'سمك', root: 'س-م-ك', transliteration: 'samak', meaning: 'fish', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'نحل', root: 'ن-ح-ل', transliteration: 'nahl', meaning: 'bee', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'نمل', root: 'ن-م-ل', transliteration: 'naml', meaning: 'ant', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'عنكبوت', root: 'ع-ن-ك', transliteration: 'ʿankabut', meaning: 'spider', frequency: 2, partOfSpeech: 'Noun' },
  
  // TIME & TEMPORAL TERMS (350-400)
  { arabic: 'وقت', root: 'و-ق-ت', transliteration: 'waqt', meaning: 'time, appointed time', frequency: 3, partOfSpeech: 'Noun' },
  { arabic: 'ساعة', root: 'س-و-ع', transliteration: 'saʿah', meaning: 'hour, the Hour (Day of Judgment)', frequency: 48, partOfSpeech: 'Noun' },
  { arabic: 'ليل', root: 'ل-ي-ل', transliteration: 'layl', meaning: 'night', frequency: 75, partOfSpeech: 'Noun' },
  { arabic: 'نهار', root: 'ن-ه-ر', transliteration: 'nahar', meaning: 'day, daytime', frequency: 57, partOfSpeech: 'Noun' },
  { arabic: 'صباح', root: 'ص-ب-ح', transliteration: 'sabah', meaning: 'morning', frequency: 7, partOfSpeech: 'Noun' },
  { arabic: 'مساء', root: 'م-س-و', transliteration: 'masa', meaning: 'evening', frequency: 5, partOfSpeech: 'Noun' },
  { arabic: 'شهر', root: 'ش-ه-ر', transliteration: 'shahr', meaning: 'month', frequency: 20, partOfSpeech: 'Noun' },
  { arabic: 'سنة', root: 'س-ن-ه', transliteration: 'sanah', meaning: 'year', frequency: 19, partOfSpeech: 'Noun' },
  { arabic: 'دهر', root: 'د-ه-ر', transliteration: 'dahr', meaning: 'time, age, era', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'أمد', root: 'أ-م-د', transliteration: 'amad', meaning: 'period, term, appointed time', frequency: 3, partOfSpeech: 'Noun' },
  
  { arabic: 'أول', root: 'أ-و-ل', transliteration: 'awwal', meaning: 'first, beginning', frequency: 88, partOfSpeech: 'Adj' },
  { arabic: 'آخر', root: 'أ-خ-ر', transliteration: 'akhir', meaning: 'last, end, final', frequency: 91, partOfSpeech: 'Adj' },
  { arabic: 'جديد', root: 'ج-د-د', transliteration: 'jadid', meaning: 'new', frequency: 5, partOfSpeech: 'Adj' },
  { arabic: 'قديم', root: 'ق-د-م', transliteration: 'qadim', meaning: 'old, ancient', frequency: 7, partOfSpeech: 'Adj' },
  
  // EMOTIONAL & MORAL TERMS (400-450)
  { arabic: 'حب', root: 'ح-ب-ب', transliteration: 'hubb', meaning: 'love', frequency: 83, partOfSpeech: 'Noun' },
  { arabic: 'كره', root: 'ك-ر-ه', transliteration: 'karah', meaning: 'hatred, dislike', frequency: 12, partOfSpeech: 'Noun' },
  { arabic: 'خوف', root: 'خ-و-ف', transliteration: 'khawf', meaning: 'fear', frequency: 124, partOfSpeech: 'Noun' },
  { arabic: 'أمن', root: 'أ-م-ن', transliteration: 'amn', meaning: 'safety, security, peace', frequency: 24, partOfSpeech: 'Noun' },
  { arabic: 'رجاء', root: 'ر-ج-و', transliteration: 'raja', meaning: 'hope, expectation', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'حزن', root: 'ح-ز-ن', transliteration: 'huzn', meaning: 'sorrow, grief, sadness', frequency: 39, partOfSpeech: 'Noun' },
  { arabic: 'فرح', root: 'ف-ر-ح', transliteration: 'farah', meaning: 'joy, happiness', frequency: 25, partOfSpeech: 'Noun' },
  { arabic: 'غضب', root: 'غ-ض-ب', transliteration: 'ghadab', meaning: 'anger, wrath', frequency: 42, partOfSpeech: 'Noun' },
  { arabic: 'صبر', root: 'ص-ب-ر', transliteration: 'sabr', meaning: 'patience, perseverance', frequency: 103, partOfSpeech: 'Noun' },
  { arabic: 'كبر', root: 'ك-ب-ر', transliteration: 'kibr', meaning: 'pride, arrogance', frequency: 48, partOfSpeech: 'Noun' },
  
  { arabic: 'تواضع', root: 'و-ض-ع', transliteration: 'tawadu', meaning: 'humility, modesty', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'حلم', root: 'ح-ل-م', transliteration: 'hilm', meaning: 'forbearance, gentleness', frequency: 16, partOfSpeech: 'Noun' },
  { arabic: 'غفر', root: 'غ-ف-ر', transliteration: 'ghafara', meaning: 'to forgive', frequency: 234, partOfSpeech: 'Verb' },
  { arabic: 'توبة', root: 'ت-و-ب', transliteration: 'tawbah', meaning: 'repentance', frequency: 17, partOfSpeech: 'Noun' },
  { arabic: 'ذنب', root: 'ذ-ن-ب', transliteration: 'dhanb', meaning: 'sin, fault', frequency: 39, partOfSpeech: 'Noun' },
  { arabic: 'إثم', root: 'أ-ث-م', transliteration: 'ithm', meaning: 'sin, wrongdoing', frequency: 48, partOfSpeech: 'Noun' },
  { arabic: 'فاحشة', root: 'ف-ح-ش', transliteration: 'fahishah', meaning: 'immorality, lewdness', frequency: 24, partOfSpeech: 'Noun' },
  { arabic: 'معروف', root: 'ع-ر-ف', transliteration: 'maʿruf', meaning: 'good, recognized, known', frequency: 38, partOfSpeech: 'Noun/Adj' },
  { arabic: 'منكر', root: 'ن-ك-ر', transliteration: 'munkar', meaning: 'evil, wrong, unrecognized', frequency: 17, partOfSpeech: 'Noun/Adj' },
  { arabic: 'حكمة', root: 'ح-ك-م', transliteration: 'hikmah', meaning: 'wisdom', frequency: 20, partOfSpeech: 'Noun' },
  
  { arabic: 'جهل', root: 'ج-ه-ل', transliteration: 'jahl', meaning: 'ignorance', frequency: 24, partOfSpeech: 'Noun' },
  { arabic: 'نور', root: 'ن-و-ر', transliteration: 'nur', meaning: 'light', frequency: 49, partOfSpeech: 'Noun' },
  { arabic: 'ظلمة', root: 'ظ-ل-م', transliteration: 'zulmah', meaning: 'darkness', frequency: 23, partOfSpeech: 'Noun' },
  { arabic: 'هدى', root: 'ه-د-ي', transliteration: 'huda', meaning: 'guidance', frequency: 79, partOfSpeech: 'Noun' },
  { arabic: 'ضلالة', root: 'ض-ل-ل', transliteration: 'dalalah', meaning: 'misguidance, error', frequency: 12, partOfSpeech: 'Noun' },
  { arabic: 'شر', root: 'ش-ر-ر', transliteration: 'sharr', meaning: 'evil, harm', frequency: 140, partOfSpeech: 'Noun' },
  { arabic: 'خير', root: 'خ-ي-ر', transliteration: 'khayr', meaning: 'good, goodness, better', frequency: 180, partOfSpeech: 'Noun/Adj' },
  { arabic: 'سوء', root: 'س-و-أ', transliteration: 'su', meaning: 'evil, bad, worst', frequency: 52, partOfSpeech: 'Noun' },
  { arabic: 'حسن', root: 'ح-س-ن', transliteration: 'husn', meaning: 'good, beautiful, excellent', frequency: 195, partOfSpeech: 'Noun/Adj' },
  
  // PHYSICAL ATTRIBUTES & DESCRIPTORS (450-500)
  { arabic: 'كبير', root: 'ك-ب-ر', transliteration: 'kabir', meaning: 'big, great, large', frequency: 122, partOfSpeech: 'Adj' },
  { arabic: 'صغير', root: 'ص-غ-ر', transliteration: 'saghir', meaning: 'small, little', frequency: 13, partOfSpeech: 'Adj' },
  { arabic: 'عظيم', root: 'ع-ظ-م', transliteration: 'ʿazim', meaning: 'great, mighty, tremendous', frequency: 110, partOfSpeech: 'Adj' },
  { arabic: 'قوي', root: 'ق-و-ي', transliteration: 'qawi', meaning: 'strong, powerful', frequency: 37, partOfSpeech: 'Adj' },
  { arabic: 'ضعيف', root: 'ض-ع-ف', transliteration: 'daʿif', meaning: 'weak', frequency: 13, partOfSpeech: 'Adj' },
  { arabic: 'طويل', root: 'ط-و-ل', transliteration: 'tawil', meaning: 'long, tall', frequency: 5, partOfSpeech: 'Adj' },
  { arabic: 'قصير', root: 'ق-ص-ر', transliteration: 'qasir', meaning: 'short', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'سريع', root: 'س-ر-ع', transliteration: 'sari', meaning: 'quick, swift', frequency: 16, partOfSpeech: 'Adj' },
  { arabic: 'بطيء', root: 'ب-ط-أ', transliteration: 'bati', meaning: 'slow', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'ثقيل', root: 'ث-ق-ل', transliteration: 'thaqil', meaning: 'heavy', frequency: 4, partOfSpeech: 'Adj' },
  
  { arabic: 'خفيف', root: 'خ-ف-ف', transliteration: 'khafif', meaning: 'light, lightweight', frequency: 2, partOfSpeech: 'Adj' },
  { arabic: 'واسع', root: 'و-س-ع', transliteration: 'wasi', meaning: 'wide, vast, spacious', frequency: 21, partOfSpeech: 'Adj' },
  { arabic: 'ضيق', root: 'ض-ي-ق', transliteration: 'dayyiq', meaning: 'narrow, tight', frequency: 3, partOfSpeech: 'Adj' },
  { arabic: 'جميل', root: 'ج-م-ل', transliteration: 'jamil', meaning: 'beautiful', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'قبيح', root: 'ق-ب-ح', transliteration: 'qabih', meaning: 'ugly, repulsive', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'نظيف', root: 'ن-ظ-ف', transliteration: 'nazif', meaning: 'clean, pure', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'طاهر', root: 'ط-ه-ر', transliteration: 'tahir', meaning: 'pure, purified', frequency: 12, partOfSpeech: 'Adj' },
  { arabic: 'نجس', root: 'ن-ج-س', transliteration: 'najs', meaning: 'impure, filthy', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'حي', root: 'ح-ي-ي', transliteration: 'hayy', meaning: 'alive, living', frequency: 58, partOfSpeech: 'Adj' },
  { arabic: 'ميت', root: 'م-و-ت', transliteration: 'mayyit', meaning: 'dead', frequency: 59, partOfSpeech: 'Adj' },
  
  // ADDITIONAL COMMON VERBS (500-600)
  { arabic: 'وجد', root: 'و-ج-د', transliteration: 'wajada', meaning: 'to find', frequency: 107, partOfSpeech: 'Verb' },
  { arabic: 'فقد', root: 'ف-ق-د', transliteration: 'faqada', meaning: 'to lose', frequency: 7, partOfSpeech: 'Verb' },
  { arabic: 'بقي', root: 'ب-ق-ي', transliteration: 'baqiya', meaning: 'to remain, stay', frequency: 21, partOfSpeech: 'Verb' },
  { arabic: 'زال', root: 'ز-و-ل', transliteration: 'zala', meaning: 'to cease, disappear', frequency: 14, partOfSpeech: 'Verb' },
  { arabic: 'صار', root: 'ص-ي-ر', transliteration: 'sara', meaning: 'to become', frequency: 25, partOfSpeech: 'Verb' },
  { arabic: 'نام', root: 'ن-و-م', transliteration: 'nama', meaning: 'to sleep', frequency: 7, partOfSpeech: 'Verb' },
  { arabic: 'استيقظ', root: 'ي-ق-ظ', transliteration: 'istayqaza', meaning: 'to wake up', frequency: 3, partOfSpeech: 'Verb' },
  { arabic: 'أكل', root: 'أ-ك-ل', transliteration: 'akala', meaning: 'to eat', frequency: 110, partOfSpeech: 'Verb' },
  { arabic: 'شرب', root: 'ش-ر-ب', transliteration: 'shariba', meaning: 'to drink', frequency: 34, partOfSpeech: 'Verb' },
  { arabic: 'لبس', root: 'ل-ب-س', transliteration: 'labisa', meaning: 'to wear, dress', frequency: 7, partOfSpeech: 'Verb' },
  { arabic: 'نزع', root: 'ن-ز-ع', transliteration: 'nazaʿa', meaning: 'to remove, pull out', frequency: 18, partOfSpeech: 'Verb' },
  { arabic: 'مشى', root: 'م-ش-ي', transliteration: 'masha', meaning: 'to walk', frequency: 18, partOfSpeech: 'Verb' },
  { arabic: 'جرى', root: 'ج-ر-ي', transliteration: 'jara', meaning: 'to run, flow', frequency: 64, partOfSpeech: 'Verb' },
  { arabic: 'وقف', root: 'و-ق-ف', transliteration: 'waqafa', meaning: 'to stand, stop', frequency: 12, partOfSpeech: 'Verb' },
  { arabic: 'قعد', root: 'ق-ع-د', transliteration: 'qaʿada', meaning: 'to sit', frequency: 9, partOfSpeech: 'Verb' },
  { arabic: 'ركب', root: 'ر-ك-ب', transliteration: 'rakiba', meaning: 'to ride, mount', frequency: 13, partOfSpeech: 'Verb' },
  { arabic: 'نزل', root: 'ن-ز-ل', transliteration: 'nazala', meaning: 'to descend, come down', frequency: 88, partOfSpeech: 'Verb' },
  { arabic: 'صعد', root: 'ص-ع-د', transliteration: 'saʿida', meaning: 'to ascend, go up', frequency: 7, partOfSpeech: 'Verb' },
  { arabic: 'دخل', root: 'د-خ-ل', transliteration: 'dakhala', meaning: 'to enter', frequency: 72, partOfSpeech: 'Verb' },
  { arabic: 'خرج', root: 'خ-ر-ج', transliteration: 'kharaja', meaning: 'to exit, go out', frequency: 282, partOfSpeech: 'Verb' },
  { arabic: 'فتح', root: 'ف-ت-ح', transliteration: 'fataha', meaning: 'to open, conquer', frequency: 61, partOfSpeech: 'Verb' },
  { arabic: 'أغلق', root: 'غ-ل-ق', transliteration: 'aghlaq', meaning: 'to close, lock', frequency: 3, partOfSpeech: 'Verb' },
  { arabic: 'كسر', root: 'ك-س-ر', transliteration: 'kasara', meaning: 'to break', frequency: 1, partOfSpeech: 'Verb' },
  { arabic: 'بنى', root: 'ب-ن-ي', transliteration: 'bana', meaning: 'to build, construct', frequency: 16, partOfSpeech: 'Verb' },
  { arabic: 'هدم', root: 'ه-د-م', transliteration: 'hadama', meaning: 'to demolish, destroy', frequency: 5, partOfSpeech: 'Verb' },
  { arabic: 'كتب', root: 'ك-ت-ب', transliteration: 'kataba', meaning: 'to write', frequency: 319, partOfSpeech: 'Verb' },
  { arabic: 'محا', root: 'م-ح-و', transliteration: 'maha', meaning: 'to erase, wipe out', frequency: 5, partOfSpeech: 'Verb' },
  { arabic: 'طلب', root: 'ط-ل-ب', transliteration: 'talaba', meaning: 'to seek, request', frequency: 29, partOfSpeech: 'Verb' },
  { arabic: 'سأل', root: 'س-أ-ل', transliteration: 'saala', meaning: 'to ask, question', frequency: 129, partOfSpeech: 'Verb' },
  { arabic: 'أجاب', root: 'ج-و-ب', transliteration: 'ajaba', meaning: 'to answer, respond', frequency: 24, partOfSpeech: 'Verb' },
  
  // BUSINESS & ECONOMICS (600-650)
  { arabic: 'تجارة', root: 'ت-ج-ر', transliteration: 'tijarah', meaning: 'trade, commerce', frequency: 9, partOfSpeech: 'Noun' },
  { arabic: 'بيع', root: 'ب-ي-ع', transliteration: 'bayʿ', meaning: 'selling, sale', frequency: 16, partOfSpeech: 'Noun' },
  { arabic: 'شراء', root: 'ش-ر-ي', transliteration: 'shira', meaning: 'buying, purchase', frequency: 21, partOfSpeech: 'Noun' },
  { arabic: 'ثمن', root: 'ث-م-ن', transliteration: 'thaman', meaning: 'price, cost', frequency: 8, partOfSpeech: 'Noun' },
  { arabic: 'ربا', root: 'ر-ب-و', transliteration: 'riba', meaning: 'usury, interest', frequency: 20, partOfSpeech: 'Noun' },
  { arabic: 'دين', root: 'د-ي-ن', transliteration: 'dayn', meaning: 'debt, loan', frequency: 10, partOfSpeech: 'Noun' },
  { arabic: 'مال', root: 'م-و-ل', transliteration: 'mal', meaning: 'wealth, property, money', frequency: 86, partOfSpeech: 'Noun' },
  { arabic: 'فقر', root: 'ف-ق-ر', transliteration: 'faqr', meaning: 'poverty', frequency: 7, partOfSpeech: 'Noun' },
  { arabic: 'غنى', root: 'غ-ن-ي', transliteration: 'ghina', meaning: 'wealth, richness', frequency: 12, partOfSpeech: 'Noun' },
  { arabic: 'أجر', root: 'أ-ج-ر', transliteration: 'ajr', meaning: 'reward, wage', frequency: 107, partOfSpeech: 'Noun' },
  { arabic: 'عقد', root: 'ع-ق-د', transliteration: 'ʿaqd', meaning: 'contract, agreement', frequency: 4, partOfSpeech: 'Noun' },
  { arabic: 'وعد', root: 'و-ع-د', transliteration: 'waʿd', meaning: 'promise', frequency: 80, partOfSpeech: 'Noun' },
  { arabic: 'عهد', root: 'ع-ه-د', transliteration: 'ʿahd', meaning: 'covenant, pledge', frequency: 48, partOfSpeech: 'Noun' },
  { arabic: 'أمانة', root: 'أ-م-ن', transliteration: 'amanah', meaning: 'trust, honesty, deposit', frequency: 7, partOfSpeech: 'Noun' },
  { arabic: 'خيانة', root: 'خ-و-ن', transliteration: 'khiyanah', meaning: 'betrayal, treachery', frequency: 16, partOfSpeech: 'Noun' },
  
  // LEGAL & JURISPRUDENCE TERMS (650-700)
  { arabic: 'حكم', root: 'ح-ك-م', transliteration: 'hukm', meaning: 'judgment, ruling, wisdom', frequency: 210, partOfSpeech: 'Noun' },
  { arabic: 'قضاء', root: 'ق-ض-ي', transliteration: 'qada', meaning: 'decree, judgment', frequency: 66, partOfSpeech: 'Noun' },
  { arabic: 'فرض', root: 'ف-ر-ض', transliteration: 'fard', meaning: 'obligation, duty', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'واجب', root: 'و-ج-ب', transliteration: 'wajib', meaning: 'obligatory, duty', frequency: 13, partOfSpeech: 'Noun' },
  { arabic: 'حرام', root: 'ح-ر-م', transliteration: 'haram', meaning: 'forbidden, prohibited', frequency: 87, partOfSpeech: 'Adj' },
  { arabic: 'حلال', root: 'ح-ل-ل', transliteration: 'halal', meaning: 'lawful, permitted', frequency: 51, partOfSpeech: 'Adj' },
  { arabic: 'مباح', root: 'ب-و-ح', transliteration: 'mubah', meaning: 'permissible', frequency: 1, partOfSpeech: 'Adj' },
  { arabic: 'سنة', root: 'س-ن-ن', transliteration: 'sunnah', meaning: 'way, practice, tradition', frequency: 16, partOfSpeech: 'Noun' },
  { arabic: 'بدعة', root: 'ب-د-ع', transliteration: 'bidʿah', meaning: 'innovation', frequency: 4, partOfSpeech: 'Noun' },
  { arabic: 'إجماع', root: 'ج-م-ع', transliteration: 'ijmaʿ', meaning: 'consensus', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'قياس', root: 'ق-ي-س', transliteration: 'qiyas', meaning: 'analogy, measurement', frequency: 3, partOfSpeech: 'Noun' },
  { arabic: 'اجتهاد', root: 'ج-ه-د', transliteration: 'ijtihad', meaning: 'independent reasoning', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'تفسير', root: 'ف-س-ر', transliteration: 'tafsir', meaning: 'interpretation, exegesis', frequency: 1, partOfSpeech: 'Noun' },
  { arabic: 'تأويل', root: 'أ-و-ل', transliteration: 'tawil', meaning: 'interpretation', frequency: 17, partOfSpeech: 'Noun' },
  
  // WORSHIP & RITUAL TERMS (700-750)
  { arabic: 'عبادة', root: 'ع-ب-د', transliteration: 'ʿibadah', meaning: 'worship, devotion', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'ذكر', root: 'ذ-ك-ر', transliteration: 'dhikr', meaning: 'remembrance, mention', frequency: 292, partOfSpeech: 'Noun' },
  { arabic: 'دعاء', root: 'د-ع-و', transliteration: 'duʿa', meaning: 'supplication, prayer', frequency: 5, partOfSpeech: 'Noun' },
  { arabic: 'تسبيح', root: 'س-ب-ح', transliteration: 'tasbih', meaning: 'glorification', frequency: 89, partOfSpeech: 'Noun' },
  { arabic: 'تكبير', root: 'ك-ب-ر', transliteration: 'takbir', meaning: 'magnification (Allah)', frequency: 37, partOfSpeech: 'Noun' },
  { arabic: 'ركوع', root: 'ر-ك-ع', transliteration: 'rukuʿ', meaning: 'bowing (in prayer)', frequency: 13, partOfSpeech: 'Noun' },
  { arabic: 'سجود', root: 'س-ج-د', transliteration: 'sujud', meaning: 'prostration', frequency: 92, partOfSpeech: 'Noun' },
  { arabic: 'قيام', root: 'ق-و-م', transliteration: 'qiyam', meaning: 'standing (in prayer)', frequency: 61, partOfSpeech: 'Noun' },
  { arabic: 'تلاوة', root: 'ت-ل-و', transliteration: 'tilawah', meaning: 'recitation', frequency: 63, partOfSpeech: 'Noun' },
  { arabic: 'قرآن', root: 'ق-ر-أ', transliteration: 'Quran', meaning: 'The Quran, recitation', frequency: 70, partOfSpeech: 'Noun' },
  { arabic: 'إنجيل', root: 'ن-ج-ل', transliteration: 'Injil', meaning: 'Gospel', frequency: 12, partOfSpeech: 'Noun' },
  { arabic: 'توراة', root: 'و-ر-ي', transliteration: 'Tawrah', meaning: 'Torah', frequency: 18, partOfSpeech: 'Noun' },
  { arabic: 'زبور', root: 'ز-ب-ر', transliteration: 'Zabur', meaning: 'Psalms', frequency: 3, partOfSpeech: 'Noun' },
  { arabic: 'صحف', root: 'ص-ح-ف', transliteration: 'suhuf', meaning: 'scriptures, pages', frequency: 9, partOfSpeech: 'Noun' },
  { arabic: 'وحي', root: 'و-ح-ي', transliteration: 'wahy', meaning: 'revelation', frequency: 78, partOfSpeech: 'Noun' },
  { arabic: 'آمين', root: 'أ-م-ن', transliteration: 'amin', meaning: 'amen, truly', frequency: 1, partOfSpeech: 'Interjection' },
  
  // ESCHATOLOGY & AFTERLIFE (750-800)
  { arabic: 'آخرة', root: 'أ-خ-ر', transliteration: 'akhirah', meaning: 'hereafter, afterlife', frequency: 115, partOfSpeech: 'Noun' },
  { arabic: 'دنيا', root: 'د-ن-و', transliteration: 'dunya', meaning: 'this world, worldly life', frequency: 115, partOfSpeech: 'Noun' },
  { arabic: 'قيامة', root: 'ق-و-م', transliteration: 'qiyamah', meaning: 'resurrection, Day of Judgment', frequency: 70, partOfSpeech: 'Noun' },
  { arabic: 'بعث', root: 'ب-ع-ث', transliteration: 'baʿth', meaning: 'resurrection, raising', frequency: 66, partOfSpeech: 'Noun' },
  { arabic: 'حساب', root: 'ح-س-ب', transliteration: 'hisab', meaning: 'reckoning, account', frequency: 102, partOfSpeech: 'Noun' },
  { arabic: 'ميزان', root: 'و-ز-ن', transliteration: 'mizan', meaning: 'scale, balance', frequency: 23, partOfSpeech: 'Noun' },
  { arabic: 'صراط', root: 'ص-ر-ط', transliteration: 'sirat', meaning: 'path, bridge', frequency: 45, partOfSpeech: 'Noun' },
  { arabic: 'جهنم', root: 'ج-ه-ن', transliteration: 'jahannam', meaning: 'hell', frequency: 77, partOfSpeech: 'Noun' },
  { arabic: 'فردوس', root: 'ف-ر-د', transliteration: 'firdaws', meaning: 'paradise', frequency: 2, partOfSpeech: 'Noun' },
  { arabic: 'عدن', root: 'ع-د-ن', transliteration: 'ʿadn', meaning: 'Eden, eternal abode', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'نعيم', root: 'ن-ع-م', transliteration: 'naʿim', meaning: 'bliss, delight', frequency: 16, partOfSpeech: 'Noun' },
  { arabic: 'عقاب', root: 'ع-ق-ب', transliteration: 'ʿiqab', meaning: 'punishment', frequency: 14, partOfSpeech: 'Noun' },
  { arabic: 'ثواب', root: 'ث-و-ب', transliteration: 'thawab', meaning: 'reward', frequency: 3, partOfSpeech: 'Noun' },
  { arabic: 'صبر', root: 'ص-ب-ر', transliteration: 'sabr', meaning: 'patience', frequency: 103, partOfSpeech: 'Noun' },
  
  // PROPHETS & MESSENGERS (800-850)
  { arabic: 'آدم', root: 'أ-د-م', transliteration: 'Adam', meaning: 'Adam', frequency: 25, partOfSpeech: 'Proper Noun' },
  { arabic: 'إدريس', root: 'د-ر-س', transliteration: 'Idris', meaning: 'Enoch', frequency: 2, partOfSpeech: 'Proper Noun' },
  { arabic: 'نوح', root: 'ن-و-ح', transliteration: 'Nuh', meaning: 'Noah', frequency: 43, partOfSpeech: 'Proper Noun' },
  { arabic: 'هود', root: 'ه-و-د', transliteration: 'Hud', meaning: 'Hud', frequency: 7, partOfSpeech: 'Proper Noun' },
  { arabic: 'صالح', root: 'ص-ل-ح', transliteration: 'Salih', meaning: 'Salih', frequency: 9, partOfSpeech: 'Proper Noun' },
  { arabic: 'إبراهيم', root: 'ب-ر-ه', transliteration: 'Ibrahim', meaning: 'Abraham', frequency: 69, partOfSpeech: 'Proper Noun' },
  { arabic: 'لوط', root: 'ل-و-ط', transliteration: 'Lut', meaning: 'Lot', frequency: 27, partOfSpeech: 'Proper Noun' },
  { arabic: 'إسماعيل', root: 'س-م-ع', transliteration: 'Ismail', meaning: 'Ishmael', frequency: 12, partOfSpeech: 'Proper Noun' },
  { arabic: 'إسحاق', root: 'س-ح-ق', transliteration: 'Ishaq', meaning: 'Isaac', frequency: 17, partOfSpeech: 'Proper Noun' },
  { arabic: 'يعقوب', root: 'ع-ق-ب', transliteration: 'Yaʿqub', meaning: 'Jacob', frequency: 16, partOfSpeech: 'Proper Noun' },
  { arabic: 'يوسف', root: 'ي-و-س', transliteration: 'Yusuf', meaning: 'Joseph', frequency: 27, partOfSpeech: 'Proper Noun' },
  { arabic: 'أيوب', root: 'أ-ي-ب', transliteration: 'Ayyub', meaning: 'Job', frequency: 4, partOfSpeech: 'Proper Noun' },
  { arabic: 'شعيب', root: 'ش-ع-ب', transliteration: 'Shuʿayb', meaning: 'Jethro', frequency: 11, partOfSpeech: 'Proper Noun' },
  { arabic: 'موسى', root: 'م-و-س', transliteration: 'Musa', meaning: 'Moses', frequency: 136, partOfSpeech: 'Proper Noun' },
  { arabic: 'هارون', root: 'ه-ر-ن', transliteration: 'Harun', meaning: 'Aaron', frequency: 20, partOfSpeech: 'Proper Noun' },
  { arabic: 'داود', root: 'د-و-د', transliteration: 'Dawud', meaning: 'David', frequency: 16, partOfSpeech: 'Proper Noun' },
  { arabic: 'سليمان', root: 'س-ل-م', transliteration: 'Sulayman', meaning: 'Solomon', frequency: 17, partOfSpeech: 'Proper Noun' },
  { arabic: 'إلياس', root: 'ل-ي-س', transliteration: 'Ilyas', meaning: 'Elijah', frequency: 2, partOfSpeech: 'Proper Noun' },
  { arabic: 'اليسع', root: 'ي-س-ع', transliteration: 'Alyasaʿ', meaning: 'Elisha', frequency: 2, partOfSpeech: 'Proper Noun' },
  { arabic: 'يونس', root: 'ي-و-ن', transliteration: 'Yunus', meaning: 'Jonah', frequency: 4, partOfSpeech: 'Proper Noun' },
  { arabic: 'زكريا', root: 'ز-ك-ر', transliteration: 'Zakariya', meaning: 'Zechariah', frequency: 7, partOfSpeech: 'Proper Noun' },
  { arabic: 'يحيى', root: 'ح-ي-ي', transliteration: 'Yahya', meaning: 'John the Baptist', frequency: 5, partOfSpeech: 'Proper Noun' },
  { arabic: 'عيسى', root: 'ع-ي-س', transliteration: 'Isa', meaning: 'Jesus', frequency: 25, partOfSpeech: 'Proper Noun' },
  { arabic: 'محمد', root: 'ح-م-د', transliteration: 'Muhammad', meaning: 'Muhammad', frequency: 4, partOfSpeech: 'Proper Noun' },
  { arabic: 'أحمد', root: 'ح-م-د', transliteration: 'Ahmad', meaning: 'Ahmad (another name for Muhammad)', frequency: 1, partOfSpeech: 'Proper Noun' },
  
  // ADDITIONAL HIGH-FREQUENCY WORDS (850-950)
  { arabic: 'جعل', root: 'ج-ع-ل', transliteration: 'jaʿala', meaning: 'to make, create, appoint', frequency: 370, partOfSpeech: 'Verb' },
  { arabic: 'نزل', root: 'ن-ز-ل', transliteration: 'nazzala', meaning: 'to send down, reveal', frequency: 293, partOfSpeech: 'Verb' },
  { arabic: 'أتى', root: 'أ-ت-ي', transliteration: 'ata', meaning: 'to come, bring', frequency: 548, partOfSpeech: 'Verb' },
  { arabic: 'قول', root: 'ق-و-ل', transliteration: 'qawl', meaning: 'saying, statement, word', frequency: 1722, partOfSpeech: 'Noun' },
  { arabic: 'يوم', root: 'ي-و-م', transliteration: 'yawm', meaning: 'day', frequency: 475, partOfSpeech: 'Noun' },
  { arabic: 'أهل', root: 'أ-ه-ل', transliteration: 'ahl', meaning: 'family, people, folk', frequency: 127, partOfSpeech: 'Noun' },
  { arabic: 'قوم', root: 'ق-و-م', transliteration: 'qawm', meaning: 'people, nation, folk', frequency: 383, partOfSpeech: 'Noun' },
  { arabic: 'بني', root: 'ب-ن-ي', transliteration: 'bani', meaning: 'children of, sons of', frequency: 199, partOfSpeech: 'Noun' },
  { arabic: 'أمة', root: 'أ-م-م', transliteration: 'ummah', meaning: 'nation, community', frequency: 64, partOfSpeech: 'Noun' },
  { arabic: 'ملك', root: 'م-ل-ك', transliteration: 'malik', meaning: 'king', frequency: 20, partOfSpeech: 'Noun' },
  { arabic: 'ملكوت', root: 'م-ل-ك', transliteration: 'malakut', meaning: 'kingdom, sovereignty', frequency: 4, partOfSpeech: 'Noun' },
  { arabic: 'سلطان', root: 'س-ل-ط', transliteration: 'sultan', meaning: 'authority, power', frequency: 37, partOfSpeech: 'Noun' },
  { arabic: 'حق', root: 'ح-ق-ق', transliteration: 'haqq', meaning: 'truth, right, due', frequency: 287, partOfSpeech: 'Noun' },
  { arabic: 'باطل', root: 'ب-ط-ل', transliteration: 'batil', meaning: 'falsehood, vanity', frequency: 36, partOfSpeech: 'Noun' },
  { arabic: 'صدق', root: 'ص-د-ق', transliteration: 'sidq', meaning: 'truthfulness, sincerity', frequency: 169, partOfSpeech: 'Noun' },
  { arabic: 'كذب', root: 'ك-ذ-ب', transliteration: 'kidhb', meaning: 'lying, falsehood', frequency: 75, partOfSpeech: 'Noun' },
  { arabic: 'علم', root: 'ع-ل-م', transliteration: 'ʿilm', meaning: 'knowledge', frequency: 854, partOfSpeech: 'Noun' },
  { arabic: 'حكمة', root: 'ح-ك-م', transliteration: 'hikmah', meaning: 'wisdom', frequency: 20, partOfSpeech: 'Noun' },
  { arabic: 'فضل', root: 'ف-ض-ل', transliteration: 'fadl', meaning: 'grace, favor, bounty', frequency: 100, partOfSpeech: 'Noun' },
  { arabic: 'رحمة', root: 'ر-ح-م', transliteration: 'rahmah', meaning: 'mercy, compassion', frequency: 114, partOfSpeech: 'Noun' },
  
  // BODY PARTS & SENSES (950-1000)
  { arabic: 'قلب', root: 'ق-ل-ب', transliteration: 'qalb', meaning: 'heart', frequency: 132, partOfSpeech: 'Noun' },
  { arabic: 'فؤاد', root: 'ف-أ-د', transliteration: 'fuad', meaning: 'heart, innermost heart', frequency: 15, partOfSpeech: 'Noun' },
  { arabic: 'عين', root: 'ع-ي-ن', transliteration: 'ʿayn', meaning: 'eye, spring', frequency: 58, partOfSpeech: 'Noun' },
  { arabic: 'أذن', root: 'أ-ذ-ن', transliteration: 'udhn', meaning: 'ear', frequency: 11, partOfSpeech: 'Noun' },
  { arabic: 'لسان', root: 'ل-س-ن', transliteration: 'lisan', meaning: 'tongue, language', frequency: 25, partOfSpeech: 'Noun' },
  { arabic: 'يد', root: 'ي-د-د', transliteration: 'yad', meaning: 'hand', frequency: 120, partOfSpeech: 'Noun' },
  { arabic: 'رجل', root: 'ر-ج-ل', transliteration: 'rijl', meaning: 'foot, leg', frequency: 13, partOfSpeech: 'Noun' },
  { arabic: 'رأس', root: 'ر-أ-س', transliteration: 'ras', meaning: 'head', frequency: 16, partOfSpeech: 'Noun' },
  { arabic: 'وجه', root: 'و-ج-ه', transliteration: 'wajh', meaning: 'face, direction', frequency: 72, partOfSpeech: 'Noun' },
  { arabic: 'جسد', root: 'ج-س-د', transliteration: 'jasad', meaning: 'body', frequency: 4, partOfSpeech: 'Noun' },
  { arabic: 'نفس', root: 'ن-ف-س', transliteration: 'nafs', meaning: 'soul, self, person', frequency: 298, partOfSpeech: 'Noun' },
  { arabic: 'روح', root: 'ر-و-ح', transliteration: 'ruh', meaning: 'spirit, soul', frequency: 21, partOfSpeech: 'Noun' },
  { arabic: 'عقل', root: 'ع-ق-ل', transliteration: 'ʿaql', meaning: 'intellect, reason', frequency: 49, partOfSpeech: 'Noun' },
  
  // DIRECTIONS & PLACES (1000-1050)
  { arabic: 'شرق', root: 'ش-ر-ق', transliteration: 'sharq', meaning: 'east', frequency: 5, partOfSpeech: 'Noun' },
  { arabic: 'غرب', root: 'غ-ر-ب', transliteration: 'gharb', meaning: 'west', frequency: 4, partOfSpeech: 'Noun' },
  { arabic: 'يمين', root: 'ي-م-ن', transliteration: 'yamin', meaning: 'right (direction), oath', frequency: 45, partOfSpeech: 'Noun' },
  { arabic: 'شمال', root: 'ش-م-ل', transliteration: 'shimal', meaning: 'left, north', frequency: 4, partOfSpeech: 'Noun' },
  { arabic: 'فوق', root: 'ف-و-ق', transliteration: 'fawq', meaning: 'above, over', frequency: 28, partOfSpeech: 'Prep' },
  { arabic: 'تحت', root: 'ت-ح-ت', transliteration: 'taht', meaning: 'under, below', frequency: 30, partOfSpeech: 'Prep' },
  { arabic: 'بين', root: 'ب-ي-ن', transliteration: 'bayn', meaning: 'between, among', frequency: 143, partOfSpeech: 'Prep' },
  { arabic: 'عند', root: 'ع-ن-د', transliteration: 'ʿinda', meaning: 'at, with, near', frequency: 362, partOfSpeech: 'Prep' },
  { arabic: 'قبل', root: 'ق-ب-ل', transliteration: 'qabl', meaning: 'before, prior to', frequency: 57, partOfSpeech: 'Prep' },
  { arabic: 'بعد', root: 'ب-ع-د', transliteration: 'baʿd', meaning: 'after, behind', frequency: 119, partOfSpeech: 'Prep' },
  { arabic: 'مكة', root: 'م-ك-ك', transliteration: 'Makkah', meaning: 'Mecca', frequency: 1, partOfSpeech: 'Proper Noun' },
  { arabic: 'مدينة', root: 'م-د-ن', transliteration: 'madinah', meaning: 'city, Medina', frequency: 14, partOfSpeech: 'Noun' },
  { arabic: 'بيت', root: 'ب-ي-ت', transliteration: 'bayt', meaning: 'house', frequency: 52, partOfSpeech: 'Noun' },
  { arabic: 'مسجد', root: 'س-ج-د', transliteration: 'masjid', meaning: 'mosque, place of prostration', frequency: 28, partOfSpeech: 'Noun' },
  { arabic: 'كعبة', root: 'ك-ع-ب', transliteration: 'Kaʿbah', meaning: 'Kaaba', frequency: 2, partOfSpeech: 'Proper Noun' },
  
  // ACTIONS & COMMON VERBS (1050-1100)
  { arabic: 'أخذ', root: 'أ-خ-ذ', transliteration: 'akhadha', meaning: 'to take, seize', frequency: 247, partOfSpeech: 'Verb' },
  { arabic: 'أعطى', root: 'ع-ط-ي', transliteration: 'aʿta', meaning: 'to give', frequency: 127, partOfSpeech: 'Verb' },
  { arabic: 'تركَ', root: 'ت-ر-ك', transliteration: 'taraka', meaning: 'to leave, abandon', frequency: 42, partOfSpeech: 'Verb' },
  { arabic: 'حمل', root: 'ح-م-ل', transliteration: 'hamala', meaning: 'to carry, bear', frequency: 37, partOfSpeech: 'Verb' },
  { arabic: 'وضع', root: 'و-ض-ع', transliteration: 'wadaʿa', meaning: 'to put, place', frequency: 18, partOfSpeech: 'Verb' },
  { arabic: 'رفع', root: 'ر-ف-ع', transliteration: 'rafaʿa', meaning: 'to raise, elevate', frequency: 25, partOfSpeech: 'Verb' },
  { arabic: 'خفض', root: 'خ-ف-ض', transliteration: 'khafada', meaning: 'to lower, humble', frequency: 2, partOfSpeech: 'Verb' },
  { arabic: 'أرسل', root: 'ر-س-ل', transliteration: 'arsala', meaning: 'to send', frequency: 244, partOfSpeech: 'Verb' },
  { arabic: 'بعث', root: 'ب-ع-ث', transliteration: 'baʿatha', meaning: 'to send, raise, resurrect', frequency: 66, partOfSpeech: 'Verb' },
  { arabic: 'جمع', root: 'ج-م-ع', transliteration: 'jamaʿa', meaning: 'to gather, collect', frequency: 129, partOfSpeech: 'Verb' },
  { arabic: 'فرق', root: 'ف-ر-ق', transliteration: 'faraqa', meaning: 'to separate, divide', frequency: 30, partOfSpeech: 'Verb' },
  { arabic: 'حفظ', root: 'ح-ف-ظ', transliteration: 'hafaza', meaning: 'to guard, preserve', frequency: 44, partOfSpeech: 'Verb' },
  { arabic: 'ضيع', root: 'ض-ي-ع', transliteration: 'dayaʿa', meaning: 'to waste, lose', frequency: 3, partOfSpeech: 'Verb' },
  { arabic: 'شكر', root: 'ش-ك-ر', transliteration: 'shakara', meaning: 'to thank, be grateful', frequency: 75, partOfSpeech: 'Verb' },
  { arabic: 'كفر', root: 'ك-ف-ر', transliteration: 'kafara', meaning: 'to disbelieve, deny', frequency: 525, partOfSpeech: 'Verb' },
  { arabic: 'آمن', root: 'أ-م-ن', transliteration: 'amana', meaning: 'to believe, have faith', frequency: 537, partOfSpeech: 'Verb' },
  { arabic: 'صدق', root: 'ص-د-ق', transliteration: 'sadaqa', meaning: 'to be truthful, speak truth', frequency: 169, partOfSpeech: 'Verb' },
  { arabic: 'كذب', root: 'ك-ذ-ب', transliteration: 'kadhaba', meaning: 'to lie, deny', frequency: 75, partOfSpeech: 'Verb' },
  
  // QUALITIES & ATTRIBUTES (1100-1150)
  { arabic: 'عظيم', root: 'ع-ظ-م', transliteration: 'ʿazim', meaning: 'great, magnificent', frequency: 95, partOfSpeech: 'Adj' },
  { arabic: 'كريم', root: 'ك-ر-م', transliteration: 'karim', meaning: 'generous, noble', frequency: 47, partOfSpeech: 'Adj' },
  { arabic: 'رحيم', root: 'ر-ح-م', transliteration: 'rahim', meaning: 'merciful, compassionate', frequency: 227, partOfSpeech: 'Adj' },
  { arabic: 'رحمن', root: 'ر-ح-م', transliteration: 'rahman', meaning: 'Most Merciful', frequency: 170, partOfSpeech: 'Adj' },
  { arabic: 'غفور', root: 'غ-ف-ر', transliteration: 'ghafur', meaning: 'most forgiving', frequency: 91, partOfSpeech: 'Adj' },
  { arabic: 'عليم', root: 'ع-ل-م', transliteration: 'ʿalim', meaning: 'all-knowing', frequency: 160, partOfSpeech: 'Adj' },
  { arabic: 'حكيم', root: 'ح-ك-م', transliteration: 'hakim', meaning: 'wise', frequency: 97, partOfSpeech: 'Adj' },
  { arabic: 'قدير', root: 'ق-د-ر', transliteration: 'qadir', meaning: 'powerful, able', frequency: 45, partOfSpeech: 'Adj' },
  { arabic: 'عزيز', root: 'ع-ز-ز', transliteration: 'ʿaziz', meaning: 'mighty, dear', frequency: 92, partOfSpeech: 'Adj' },
  { arabic: 'سميع', root: 'س-م-ع', transliteration: 'samiʿ', meaning: 'all-hearing', frequency: 45, partOfSpeech: 'Adj' },
  { arabic: 'بصير', root: 'ب-ص-ر', transliteration: 'basir', meaning: 'all-seeing', frequency: 51, partOfSpeech: 'Adj' },
  { arabic: 'لطيف', root: 'ل-ط-ف', transliteration: 'latif', meaning: 'subtle, gentle', frequency: 7, partOfSpeech: 'Adj' },
  { arabic: 'خبير', root: 'خ-ب-ر', transliteration: 'khabir', meaning: 'aware, expert', frequency: 45, partOfSpeech: 'Adj' },
  { arabic: 'حليم', root: 'ح-ل-م', transliteration: 'halim', meaning: 'forbearing, clement', frequency: 15, partOfSpeech: 'Adj' },
];

async function seedExpansion() {
  console.log('🌱 Starting comprehensive vocabulary expansion...');
  console.log(`📊 Adding ${commonQuranicWords.length} common Quranic words...`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const word of commonQuranicWords) {
    try {
      // Check if root already exists
      const existing = await db.select().from(roots).where(sql`${roots.root} = ${word.root}`);
      
      if (existing.length > 0) {
        skipCount++;
        continue;
      }
      
      // Insert new root with basic meaning
      await db.insert(roots).values({
        root: word.root,
        meanings: [{
          arabic: word.arabic,
          english: word.meaning,
          context: `${word.partOfSpeech} - Frequency: ${word.frequency}`,
        }],
        classicalDefinition: `Common Quranic word appearing ${word.frequency} times. Part of speech: ${word.partOfSpeech}. Transliteration: ${word.transliteration}.`,
        modernUsage: `Modern Arabic usage of ${word.arabic} (${word.transliteration}): ${word.meaning}`
      });
      
      successCount++;
      
      // Log progress every 50 words
      if (successCount % 50 === 0) {
        console.log(`✅ Progress: ${successCount} words added...`);
      }
    } catch (error) {
      console.error(`❌ Error adding word ${word.arabic}:`, error);
    }
  }
  
  console.log(`\n✅ Expansion complete!`);
  console.log(`   - ${successCount} new words added`);
  console.log(`   - ${skipCount} words skipped (already exist)`);
  console.log(`   - Total vocabulary: ~${successCount + skipCount} words`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedExpansion()
    .then(() => {
      console.log('✨ Expansion seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Expansion seed failed:', error);
      process.exit(1);
    });
}

export { seedExpansion, commonQuranicWords };
