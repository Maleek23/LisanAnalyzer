import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="bg-cream p-8">
      <SearchBar onSearch={(query) => console.log('Search:', query)} />
    </div>
  );
}
