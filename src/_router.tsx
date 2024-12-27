import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import AuthLayout from './layouts/auth.layout';
import MainLayout from './layouts/main.layout';

import AppPage from './pages/apps/[appId]';
import LoginPage from './pages/auth/login';
import PasswordRecoverPage from './pages/auth/password-recovery';
import SignUpPage from './pages/auth/signup';
import VerifyEmailPage from './pages/auth/verify-email';
import ChatbotPage from './pages/chatbot';
import AppsPage from './pages/creator/apps';
import AppEditorPage from './pages/creator/apps/[appId]';
import AppReleaseEditorPage from './pages/creator/apps/[appId]/new-release';
import RevenuePage from './pages/creator/revenue';
import DashboardPage from './pages/dashboard/[channelId]';
import DiscoverPage from './pages/discover';
import EditorsPage from './pages/editors';
import ErrorPage from './pages/error';
import MediaPage from './pages/media';
import MembershipPage from './pages/membership';
import PricingPage from './pages/pricing';
import SettingsPage from './pages/settings';
import WidgetPage from './pages/widgets/[widgetId]';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      {/* Layout: Auth */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          path="/auth/password-recovery"
          element={<PasswordRecoverPage />}
        />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Layout: Main */}
      <Route path="/" element={<MainLayout />}>
        {/* Router: / */}
        <Route index element={<DiscoverPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/editors" element={<EditorsPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Router: /stream-dashboard */}
        <Route
          path="/stream-dashboard/:channelId"
          element={<DashboardPage />}
        />

        {/* Router: /apps */}
        <Route path="/apps/:appId" element={<AppPage />} />

        {/* Router: /widgets */}
        <Route path="/widgets/:widgetId" element={<WidgetPage />} />

        {/* Router: /creator/ */}
        <Route path="/creator/">
          <Route path="/creator/revenue" element={<RevenuePage />} />
          <Route path="/creator/apps" element={<AppsPage />} />
          <Route path="/creator/apps/:appId" element={<AppEditorPage />} />
          <Route
            path="/creator/apps/:appId/new-release"
            element={<AppReleaseEditorPage />}
          />
        </Route>
      </Route>
    </Route>,
  ),
);

export default function Router() {
  return <RouterProvider router={router} />;
}
