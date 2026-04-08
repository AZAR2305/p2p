import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const terms = [
  { title: 'Using the service', text: 'Use SkillBridge respectfully and comply with local laws, platform policies, and the rights of other members.' },
  { title: 'Tutoring sessions', text: 'Tutors are responsible for the quality of their sessions and accurate information in their profiles.' },
  { title: 'Account safety', text: 'Keep your login details secure and notify support if you suspect unauthorized access.' },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-lg text-muted-foreground">These terms help keep the platform safe and fair for everyone.</p>

        <div className="mt-10 grid gap-6">
          {terms.map((term) => (
            <Card key={term.title}>
              <CardHeader><CardTitle>{term.title}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{term.text}</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild><Link href="/contact">Questions about terms?</Link></Button>
        </div>
      </section>
    </main>
  )
}