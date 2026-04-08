import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const faqs = [
  { q: 'How do I sign up?', a: 'Create an account from the sign-up page, choose whether you want to learn, teach, or do both, then complete your profile.' },
  { q: 'How do payments work?', a: 'Tutors can set an hourly rate and sessions are managed from your dashboard.' },
  { q: 'Can I learn and teach?', a: 'Yes. You can set your role to both and switch between learning and teaching anytime.' },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">Frequently asked questions</h1>
        <p className="mt-4 text-lg text-muted-foreground">A few quick answers for common questions.</p>

        <Card className="mt-10">
          <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button asChild><Link href="/contact">Contact support</Link></Button>
          <Button variant="outline" asChild><Link href="/help">Visit help center</Link></Button>
        </div>
      </section>
    </main>
  )
}