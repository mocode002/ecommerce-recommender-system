"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const mockUsers = [
  { id: "user1", name: "Abdullah" },
  { id: "user2", name: "Soufiane" },
  { id: "user3", name: "Mohammed" },
]

export default function Navbar() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0])

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">E-Store</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{selectedUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {mockUsers.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={selectedUser.id === user.id ? "bg-blue-50" : ""}
                  >
                    {user.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
