import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-2 border-foreground/10 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Authentication error</CardTitle>
          <CardDescription>We couldn’t complete your sign-in or recovery flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}