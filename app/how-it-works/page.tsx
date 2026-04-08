import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Calendar, Search, Video } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Discover', description: 'Search for a skill and compare tutors by reviews, pricing, and availability.' },
  { icon: Calendar, title: 'Book', description: 'Choose a session time that works for both of you and confirm in a few clicks.' },
  { icon: Video, title: 'Learn', description: 'Meet online, learn together, and keep track of your progress after each session.' },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">How SkillBridge works</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple path from discovery to your first learning session.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="border-2 border-border">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{index + 1}. {step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 flex gap-4">
          <Button asChild>
            <Link href="/auth/sign-up">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/skills">Explore skills</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}