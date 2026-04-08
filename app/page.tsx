import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Star, Clock, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SkillBridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/skills" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Skills
            </Link>
            <Link href="/tutors" className="text-muted-foreground hover:text-foreground transition-colors">
              Find Tutors
            </Link>
            <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm mb-6">
            <Zap className="h-4 w-4" />
            <span>Peer-to-peer learning reimagined</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
            Learn from peers.
            <br />
            <span className="text-muted-foreground">Teach what you know.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            SkillBridge connects learners with skilled peers for personalized tutoring sessions. 
            Exchange knowledge, build connections, and grow together.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/sign-up">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/skills">Explore Skills</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Learners' },
              { value: '2,500+', label: 'Expert Tutors' },
              { value: '150+', label: 'Skills Available' },
              { value: '4.9', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why SkillBridge?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A modern platform designed for meaningful peer-to-peer learning experiences.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: 'Peer Matching',
              description: 'Our algorithm connects you with the perfect tutor based on your learning goals and schedule.',
            },
            {
              icon: BookOpen,
              title: 'Diverse Skill Catalog',
              description: 'From programming to music, find tutors for virtually any skill you want to master.',
            },
            {
              icon: Clock,
              title: 'Flexible Scheduling',
              description: 'Book sessions at times that work for you. Learn at your own pace, on your own terms.',
            },
            {
              icon: Star,
              title: 'Verified Reviews',
              description: 'Read honest feedback from real students to find the best tutors for your needs.',
            },
            {
              icon: Shield,
              title: 'Secure Platform',
              description: 'Safe payments, protected data, and verified profiles for peace of mind.',
            },
            {
              icon: Zap,
              title: 'Session Tracking',
              description: 'Monitor your progress, track completed sessions, and celebrate your achievements.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border-2 border-border p-6 hover:border-foreground/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-background" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg opacity-70 max-w-2xl mx-auto">
              Get started in minutes and begin your learning journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up, tell us about your skills, and what you want to learn or teach.',
              },
              {
                step: '02',
                title: 'Find Your Match',
                description: 'Browse tutors, check reviews, and book a session that fits your schedule.',
              },
              {
                step: '03',
                title: 'Start Learning',
                description: 'Connect via video call, learn new skills, and leave feedback after each session.',
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border-2 border-background/30 text-2xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="opacity-70 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to start learning?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of learners and tutors already on SkillBridge.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/sign-up">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
                  <span className="text-background font-bold">S</span>
                </div>
                <span className="font-bold">SkillBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting learners with skilled peers for personalized tutoring experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/skills" className="hover:text-foreground transition-colors">Browse Skills</Link></li>
                <li><Link href="/tutors" className="hover:text-foreground transition-colors">Find Tutors</Link></li>
                <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
