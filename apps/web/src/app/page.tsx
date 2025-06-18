import LoginForm from "@/components/LoginForm";
import UserProfile from "@/components/UserProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Vantage API Client Demo
          </h1>
          <p className="text-gray-600">
            Testing auto-generated React Query hooks with Orval
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔐 Authentication Test
            </h2>
            <LoginForm />
          </div>

          {/* User Profile Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              👥 User Profile Test
            </h2>
            <UserProfile />
          </div>
        </div>

        {/* API Status */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔗 API Server: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000</code>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Make sure your FastAPI server is running with <code>pnpm dev:api</code>
          </p>
        </div>
      </div>
    </div>
  );
}
