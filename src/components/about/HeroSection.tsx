// about/components/HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Nayo</h1>
        <p className="text-xl mb-8">Revolutionizing your productivity with AI-powered solutions</p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  );
}