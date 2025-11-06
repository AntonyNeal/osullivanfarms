import { Helmet } from 'react-helmet-async';

const photos = [
  'https://pbs.twimg.com/media/G2zQudFaAAAsyX7.jpg:large',
  'https://pbs.twimg.com/media/G3Gh-hdbUAAQTDo.jpg:large',
  'https://pbs.twimg.com/media/G3hgK2hX0AAB8RL.jpg:large',
  'https://pbs.twimg.com/media/G3qlG5VWwAAkv0w.jpg:large',
  'https://pbs.twimg.com/media/G3yV5lZXgAACZVc.png:large',
  'https://pbs.twimg.com/media/G4OoP7-WoAA4YbX.jpg:large',
  'https://pbs.twimg.com/media/G4qJY0iaQAAaUHG.jpg:large',
  'https://pbs.twimg.com/media/G4QVg0nXMAAaiqD.jpg:large',
  'https://pbs.twimg.com/media/G22dAifaYAA9f5R.jpg:large',
  'https://pbs.twimg.com/media/G22stVEaYAAuqaG.jpg:large',
  'https://pbs.twimg.com/media/G46gwJfWgAAXSPO.png:large',
  'https://pbs.twimg.com/media/G362TdFXgAAMQMD.jpg:large',
];

export default function Gallery() {
  return (
    <>
      <Helmet>
        <title>Gallery - Claire Hamilton</title>
        <meta name="description" content="Claire Hamilton's photo gallery" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-b from-rose-50 to-white">
          <div className="container mx-auto px-4 py-16">
            <div
              className="text-center cursor-pointer"
              onClick={() => {
                console.log('[HEADER-CLICK] Direct header div click fired!');
                const now = new Date().toLocaleTimeString();
                console.log(`[HEADER-CLICK] Time: ${now}`);
                console.log('[HEADER-CLICK] Executing navigation to /admin');
                window.location.href = '/admin';
              }}
              onClickCapture={(e) => {
                console.log('[HEADER-CLICK-CAPTURE] Capture phase click on header');
                console.log('[HEADER-CLICK-CAPTURE] Event:', e);
              }}
            >
              <h1
                className="text-5xl font-light text-gray-900 mb-2 tracking-tight"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Claire Hamilton
              </h1>
              <div className="h-1 w-16 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 mx-auto mb-6" />
              <p className="text-lg text-gray-700 font-light tracking-wide">
                A Collection of Moments
              </p>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-500 border border-rose-100 hover:border-rose-300"
                >
                  <img
                    src={photo}
                    alt={`Claire Hamilton ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Back to Home */}
        <footer className="bg-gradient-to-b from-white to-rose-50 border-t border-rose-200">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <a
                href="/"
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-sm hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
