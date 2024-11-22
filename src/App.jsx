import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpotifyAuthProvider } from './contexts/spotify-auth-context';
import { AuthGuard } from './components/auth-guard';
import { Layout } from './components/layout';
import { Home } from './pages/home';
import { PartyRoom } from './pages/party-room';
import { AuthCallback } from './pages/auth-callback';

export default function App() {
  return (
    <SpotifyAuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route
              path="/party/:roomId"
              element={
                <AuthGuard>
                  <PartyRoom />
                </AuthGuard>
              }
            />
          </Route>
        </Routes>
      </Router>
    </SpotifyAuthProvider>
  );
}