import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to the Home Page</h2>
        </div>
        {session ? (
          <div className="text-center">
            <p>Welcome, {session.user?.name}!</p>
            <Link href="/api/auth/signout" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign out
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p>You are not signed in.</p>
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

