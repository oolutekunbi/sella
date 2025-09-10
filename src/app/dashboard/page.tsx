'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/lib/auth'
import { User } from '@supabase/supabase-js'
import { Loader2, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await authService.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> {user?.email}</p>
                <p className="text-sm"><strong>User ID:</strong> {user?.id}</p>
                <p className="text-sm"><strong>Created:</strong> {new Date(user?.created_at || '').toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with Sella</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-[#A9968D] hover:bg-[#8a7a6f] text-white" 
                  onClick={() => router.push('/create')}
                >
                  Create Product Tag
                </Button>
                <Button className="w-full" variant="outline">
                  View Gallery
                </Button>
                <Button className="w-full" variant="outline">
                  My Products
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
