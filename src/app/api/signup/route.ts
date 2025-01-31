import { NextResponse } from "next/server"

// This is a simple in-memory user storage. In a real app, use a database instead.
const users: any[] = []

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (users.find((u) => u.email === email)) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 })
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    provider: "credentials",
  }

  users.push(newUser)

  return NextResponse.json({ message: "User created successfully" }, { status: 201 })
}

