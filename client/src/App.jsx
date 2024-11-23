import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { AuthGuard } from './components/auth-guard';
import { Layout } from './components/layout';
import { Home } from './pages/home';
import { PartyRoom } from './pages/party-room';
import { AuthCallback } from './pages/auth-callback';

const router = createBrowserRouter(
	createRoutesFromElements(
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
	),
	{
		future: {
			v7_startTransition: true,
			v7_relativeSplatPath: true
		}
	}
);

export default function App() {
	return <RouterProvider router={router} />;
}
