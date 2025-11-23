import React, { useState } from 'react';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('sheepsheet_auth') === 'true';
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'hope') {
      sessionStorage.setItem('sheepsheet_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Not quite, mate. Ask Julian for the password.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {/* Decorative header with bush poetry aesthetic */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800"></div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header - Bush Poetry Style */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-2 tracking-wide">
              SheepSheet
            </h1>
            <div className="h-1 bg-amber-800 mx-auto mb-4"></div>
            <p className="text-xl text-amber-800 font-serif italic">
              A Drover&apos;s Digital Companion
            </p>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white/90 backdrop-blur shadow-2xl rounded-lg border-4 border-amber-800 overflow-hidden">
          {/* Decorative top bar */}
          <div className="bg-amber-800 h-3"></div>

          <div className="p-8 md:p-12">
            {/* Welcome message - Bush poetry style */}
            <div className="prose prose-lg max-w-none mb-8 text-amber-900">
              <p className="text-lg leading-relaxed font-serif mb-6 text-center italic">
                <em>
                  &quot;Where the wattle blooms golden and the wool clips run deep,
                  <br />A farmer must know every last one of his sheep.&quot;
                </em>
              </p>

              <div className="space-y-4 text-base">
                <p className="leading-relaxed">
                  G&apos;day Leigh! Welcome to <strong>SheepSheet</strong> — your digital stockbook
                  for the modern age. This platform was built especially for O&apos;Sullivan Farms
                  to help you track your mobs, monitor breeding performance, and get practical
                  advice from your AI farm advisor.
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-700 p-6 my-6 rounded-r">
                  <h3 className="text-xl font-serif text-amber-900 mb-3 mt-0">
                    How to Make the Most of It:
                  </h3>
                  <ul className="space-y-2 mb-0">
                    <li>
                      <strong>Dashboard:</strong> See all your mobs at a glance with live KPIs and
                      breeding stage tracking
                    </li>
                    <li>
                      <strong>Farm Advisor:</strong> Ask questions about breeding, mob management,
                      target percentages — like having an experienced shearer in your pocket
                    </li>
                    <li>
                      <strong>Use it daily:</strong> Check it while you&apos;re out in the paddock,
                      making decisions, or planning the next season
                    </li>
                    <li>
                      <strong>Share it around:</strong> Show your team, share with other farmers,
                      see what they think
                    </li>
                  </ul>
                </div>

                <p className="leading-relaxed">
                  This is an early version being actively developed. Your feedback is gold — tell
                  Julian what works, what doesn&apos;t, and what you&apos;d like to see next.
                  He&apos;s building this for practical farmers like you.
                </p>

                <div className="bg-orange-50 border-l-4 border-orange-600 p-6 my-6 rounded-r">
                  <p className="mb-0">
                    <strong>📧 Send feedback to:</strong>{' '}
                    <a
                      href="mailto:julian.dellabosca@gmail.com"
                      className="text-orange-700 hover:text-orange-900 underline"
                    >
                      julian.dellabosca@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Password form */}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-serif font-medium text-amber-900 mb-2"
                >
                  Password Required
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ask Julian for the password"
                  className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-sans"
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-700 font-serif">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-serif text-lg py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Enter SheepSheet
              </button>
            </form>

            {/* Footer quote */}
            <div className="mt-8 pt-6 border-t-2 border-amber-200">
              <p className="text-center text-amber-700 font-serif italic text-sm">
                &quot;In the land where horizons stretch wide and far,
                <br />
                Good record keeping shows you just where you are.&quot;
              </p>
            </div>
          </div>

          {/* Decorative bottom bar */}
          <div className="bg-amber-800 h-3"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-amber-800 text-sm font-serif">
          <p>Built for Australian sheep farmers • Echuca, Victoria</p>
        </div>
      </div>
    </div>
  );
}
