"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl bg-white p-8 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {session?.user?.name || "User Name"}
                </h2>
                <p className="text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                disabled={!isEditing}
                defaultValue={session?.user?.name || ""}
                placeholder="Your Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nick Name
              </label>
              <Input disabled={!isEditing} placeholder="Your Nick Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <Select disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>
              <Select disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Language
              </label>
              <Select disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  {/* Add more languages as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <Select disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                  {/* Add more timezones as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              My email Address
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 bg-blue-100">
                  <AvatarFallback className="text-blue-600">@</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{session?.user?.email}</p>
                  <p className="text-sm text-gray-500">1 month ago</p>
                </div>
              </div>
              {isEditing && (
                <Button variant="outline" className="text-blue-600">
                  + Add Email Address
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
