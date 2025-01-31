import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <ContentLayout title="Home">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <div className="h-screen flex items-center mt-2 justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to the Home Page
          </h2>

          {session ? (
            <div>
              <p className="text-lg">Welcome, {session.user?.name}!</p>
              <Link
                href="/api/auth/signout"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-lg">You are not signed in.</p>
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
