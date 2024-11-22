import { Button } from '../components/ui/button/index.js';
import { useNavigate } from 'react-router-dom';
import { loginUrl } from '../lib/spotify';

export function Home() {
  const navigate = useNavigate();

  const createParty = () => {
    console.log('Create party clicked!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] w-full">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            DJ Party
          </h1>
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg sm:text-xl text-white/80">
              Create a party, invite friends, and take turns being the DJ!
            </p>
            <Button 
              onClick={createParty} 
              size="lg" 
              className="w-full sm:w-auto px-8 py-3"
            >
              Start a Party
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}