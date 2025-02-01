"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialLink {
  platform: string;
  url: string;
  icon: any;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const currentDate = new Date();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "GitHub", url: "", icon: Github },
    { platform: "LinkedIn", url: "", icon: Linkedin },
    { platform: "Twitter", url: "", icon: Twitter },
    { platform: "Instagram", url: "", icon: Instagram },
    { platform: "Website", url: "", icon: Globe },
  ]);

  const handleSocialLinkChange = (index: number, url: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].url = url;
    setSocialLinks(newLinks);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-xl bg-white p-8 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full"
              >
                Edit
              </Button>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {session?.user?.name || "User Name"}
            </h2>
            <p className="text-gray-500">{session?.user?.email}</p>
            {/* Social Links */}
            <div className="mt-4 space-y-3">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-3">
                  {socialLinks.map((link, index) => (
                    <div
                      key={link.platform}
                      className="flex items-center gap-3"
                    >
                      <link.icon className="h-5 w-5 text-gray-600" />
                      <Input
                        type="url"
                        placeholder={`${link.platform} URL`}
                        value={link.url}
                        onChange={(e) =>
                          handleSocialLinkChange(index, e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <TooltipProvider key={link.platform}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={link.url ? "default" : "outline"}
                            size="icon"
                            className={
                              link.url ? "bg-green-600 hover:bg-green-700" : ""
                            }
                            asChild
                          >
                            {link.url ? (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <link.icon className="h-4 w-4" />
                              </a>
                            ) : (
                              <span>
                                <link.icon className="h-4 w-4" />
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {link.url
                            ? `Visit ${link.platform}`
                            : `Add ${link.platform}`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>

            {/*Extra etc */}
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="default"
          className="bg-green-600 hover:bg-green-700"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input
            disabled={!isEditing}
            defaultValue={session?.user?.name || ""}
            placeholder="Your Full Name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nick Name</label>
          <Input disabled={!isEditing} placeholder="Your Nick Name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Gender</label>
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
          <label className="text-sm font-medium text-gray-700">Country</label>
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
          <label className="text-sm font-medium text-gray-700">Language</label>
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
          <label className="text-sm font-medium text-gray-700">Time Zone</label>
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
        <h3 className="text-lg font-medium text-gray-900">My email Address</h3>
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
  );
}
