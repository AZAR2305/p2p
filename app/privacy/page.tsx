import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sections = [
  { title: 'What we collect', text: 'We collect account details, profile information, session data, and limited usage data to run the platform.' },
  { title: 'How we use data', text: 'We use data to match learners and tutors, manage bookings, improve the experience, and provide support.' },
  { title: 'Your choices', text: 'You can update profile details, manage account settings, and request account deletion through support.' },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-lg text-muted-foreground">A simple summary of how we handle your information.</p>

        <div className="mt-10 grid gap-6">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild><Link href="/contact">Contact us about privacy</Link></Button>
        </div>
      </section>
    </main>
  )
}