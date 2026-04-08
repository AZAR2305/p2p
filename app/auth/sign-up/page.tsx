'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { signUpWithoutConfirmation } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Loader2, GraduationCap, Users, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { UserRole } from '@/lib/types'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const signUpResult = await signUpWithoutConfirmation({
      email,
      password,
      fullName,
      role,
    })

    if (signUpResult?.error) {
      toast.error(signUpResult.error)
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      toast.error(signInError.message)
      setIsLoading(false)
      return
    }

    toast.success('Account created successfully!')
    router.push('/dashboard')
    router.refresh()
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-2 border-foreground/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-xl">S</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>Join SkillBridge and start your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>
              <div className="space-y-3">
                <Label>I want to join as</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="grid grid-cols-3 gap-3">
                  <Label
                    htmlFor="student"
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      role === 'student' ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value="student" id="student" className="sr-only" />
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-sm font-medium">Student</span>
                  </Label>
                  <Label
                    htmlFor="tutor"
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      role === 'tutor' ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value="tutor" id="tutor" className="sr-only" />
                    <Users className="h-6 w-6" />
                    <span className="text-sm font-medium">Tutor</span>
                  </Label>
                  <Label
                    htmlFor="both"
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      role === 'both' ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value="both" id="both" className="sr-only" />
                    <Sparkles className="h-6 w-6" />
                    <span className="text-sm font-medium">Both</span>
                  </Label>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-foreground hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
