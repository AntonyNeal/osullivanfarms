import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home - SW Website</title>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to SW Website</h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with React, TypeScript, Tailwind CSS, and Vite
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
    </>
  );
}
