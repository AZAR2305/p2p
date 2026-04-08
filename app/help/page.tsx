import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Mail, ShieldCheck, ArrowRight } from 'lucide-react'

const helpTopics = [
  { icon: MessageCircle, title: 'Account help', description: 'Need help signing in, updating your profile, or managing sessions?' },
  { icon: ShieldCheck, title: 'Safety and trust', description: 'Learn how we keep profiles, messaging, and payments secure.' },
  { icon: Mail, title: 'Billing support', description: 'Questions about payments, refunds, or tutor fees.' },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find quick answers or reach out to our support team.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {helpTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <Card key={topic.title} className="border-2 border-border">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-8">
          <h2 className="text-2xl font-semibold">Still need help?</h2>
          <p className="mt-2 text-muted-foreground">Send us a message and we’ll get back to you soon.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/contact">
                Contact support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/faq">Read FAQs</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}