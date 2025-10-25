import VerseCard from '../VerseCard';

export default function VerseCardExample() {
  return (
    <div className="bg-cream p-8 max-w-6xl">
      <VerseCard
        surah={4}
        ayah={34}
        arabicText="الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَىٰ بَعْضٍ"
        highlightWord="قَوَّامُونَ"
        transliteration="Ar-rijālu qawwāmūna 'ala an-nisā'i bimā faḍḍala Allāhu ba'ḍahum 'alā ba'ḍ"
        translations={[
          {
            translator: "Sahih International",
            text: "Men are in charge of women by [right of] what Allah has given one over the other..."
          },
          {
            translator: "Yusuf Ali",
            text: "Men are the protectors and maintainers of women, because Allah has given the one more (strength) than the other..."
          },
          {
            translator: "Pickthall",
            text: "Men are in charge of women, because Allah hath made the one of them to excel the other..."
          }
        ]}
      />
    </div>
  );
}
