'use client';

const categories = [
  "Overseas",
  "Book Now", 
  "Used Bikes",
  "Used Cars",
  "Property for sale",
  "Property for rent",
  "Commercial"
];

export default function TrendingCategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mb-8">
            Submit question
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Trending categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
