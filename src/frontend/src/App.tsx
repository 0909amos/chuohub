import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import AppLayout from "./components/AppLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import CommunityPage from "./pages/CommunityPage";
import HomeDashboard from "./pages/HomeDashboard";
import LandingPage from "./pages/LandingPage";
import NotesPage from "./pages/NotesPage";
import PastPapersPage from "./pages/PastPapersPage";
import PlannerPage from "./pages/PlannerPage";
import ProfilePage from "./pages/ProfilePage";
import QuizzesPage from "./pages/QuizzesPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  if (!identity) return <LandingPage />;
  return <>{children}</>;
}

const rootRoute = createRootRoute();

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: () => (
    <AuthGuard>
      <AppLayout />
    </AuthGuard>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/home",
  component: HomeDashboard,
});

const notesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/notes",
  component: NotesPage,
});

const pastPapersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/papers",
  component: PastPapersPage,
});

const quizzesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/quizzes",
  component: QuizzesPage,
});

const plannerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/planner",
  component: PlannerPage,
});

const communityRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/community",
  component: CommunityPage,
});

const profileRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  appRoute.addChildren([
    homeRoute,
    notesRoute,
    pastPapersRoute,
    quizzesRoute,
    plannerRoute,
    communityRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
