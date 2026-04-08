import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react'

const tutors = [
  { name: 'Maya Chen', skill: 'React & Next.js', rating: '4.9', rate: '$40/hr', location: 'Remote' },
  { name: 'Daniel Brooks', skill: 'Data Science', rating: '4.8', rate: '$35/hr', location: 'Remote' },
  { name: 'Ava Patel', skill: 'Graphic Design', rating: '5.0', rate: '$30/hr', location: 'Remote' },
]

export default function TutorsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4">Featured tutors</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Find a tutor who fits your goals</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse experienced peers who teach practical, real-world skills.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tutors.map((tutor) => (
            <Card key={tutor.name} className="border-2 border-border">
              <CardHeader>
                <CardTitle>{tutor.name}</CardTitle>
                <CardDescription>{tutor.skill}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{tutor.rating} average rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{tutor.rate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{tutor.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/skills">
              Browse all skills
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/sign-up">Become a tutor</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}