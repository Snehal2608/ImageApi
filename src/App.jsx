import './App.css';
import ImageSearcher from './components/ImageSearcher';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8">Image Searcher</h1>
      <ImageSearcher />
    </div>
  );
}

export default App;
