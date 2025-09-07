// about/components/ContactSection.tsx
export default function ContactSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        <div className="max-w-md mx-auto">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition-colors"
            >
              Send Message
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="mb-2">Email: contact@nayo.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </section>
  );
}