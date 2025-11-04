import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Helmet>
        <title>SW Website</title>
        <meta name="description" content="Welcome to SW Website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
