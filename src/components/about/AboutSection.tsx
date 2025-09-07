// about/components/AboutSection.tsx
export default function AboutSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">About Nayo</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg mb-6">
            Nayo is a cutting-edge platform designed to streamline your workflow and enhance productivity
            through intelligent automation and AI-powered features.
          </p>
          <p className="text-lg">
            Our mission is to empower individuals and businesses to achieve more with less effort,
            leveraging the latest advancements in artificial intelligence and machine learning.
          </p>
        </div>
      </div>
    </section>
  );
}