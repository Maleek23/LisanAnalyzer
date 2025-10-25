import FeaturedWordCard from '../FeaturedWordCard';

export default function FeaturedWordCardExample() {
  return (
    <div className="bg-cream p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <FeaturedWordCard
        arabicWord="ضرب"
        root="ض-ر-ب"
        meaning="Can mean 'to strike', 'to set forth (a parable)', 'to travel', or 'to separate'"
        onClick={() => console.log('Clicked ضرب')}
      />
      <FeaturedWordCard
        arabicWord="قوام"
        root="ق-و-م"
        meaning="Often translated as 'maintainers' or 'protectors'"
        onClick={() => console.log('Clicked قوام')}
      />
      <FeaturedWordCard
        arabicWord="جلباب"
        root="ج-ل-ب"
        meaning="Outer garment or cloak"
        onClick={() => console.log('Clicked جلباب')}
      />
    </div>
  );
}
