// about/components/PricingSection.tsx
const pricingTiers = [
  {
    name: 'Basic',
    price: '$9',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    name: 'Pro',
    price: '$19',
    features: ['All Basic features', 'Advanced Feature 1', 'Priority Support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['All Pro features', 'Dedicated Account Manager', 'Custom Integration'],
  },
];

export default function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">{tier.name}</h3>
              <p className="text-4xl font-bold mb-6">{tier.price}</p>
              <ul className="mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="mb-2">• {feature}</li>
                ))}
              </ul>
              <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}