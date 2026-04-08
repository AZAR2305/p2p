import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We’re happy to help with account questions, partnerships, or support.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">support@skillbridge.dev</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> Phone</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">+1 (555) 014-2026</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Location</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Remote-first, available worldwide</p></CardContent>
          </Card>
        </div>

        <div className="mt-10 flex gap-4">
          <Button asChild><Link href="mailto:support@skillbridge.dev">Email support</Link></Button>
          <Button variant="outline" asChild><Link href="/help">Back to help</Link></Button>
        </div>
      </section>
    </main>
  )
}