import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, Users, BookOpen } from 'lucide-react'

export default async function SkillsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get all skills
  let query = supabase.from('skills').select('*').order('name')
  
  if (params.category) {
    query = query.eq('category', params.category)
  }
  
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data: skills } = await query

  // Get unique categories
  const { data: allSkills } = await supabase.from('skills').select('category')
  const categories = [...new Set(allSkills?.map((s) => s.category) || [])]

  // Get tutor count per skill
  const { data: tutorCounts } = await supabase
    .from('profile_skills')
    .select('skill_id')
    .eq('is_teaching', true)

  const tutorCountMap = tutorCounts?.reduce((acc, item) => {
    acc[item.skill_id] = (acc[item.skill_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SkillBridge</span>
          </Link>
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

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Skill Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of skills and find expert tutors
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search skills..."
              defaultValue={params.search}
              className="pl-10 h-12"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            <Link href="/skills">
              <Badge
                variant={!params.category ? 'default' : 'secondary'}
                className="cursor-pointer h-8 px-4"
              >
                All
              </Badge>
            </Link>
            {categories.map((category) => (
              <Link key={category} href={`/skills?category=${encodeURIComponent(category)}`}>
                <Badge
                  variant={params.category === category ? 'default' : 'secondary'}
                  className="cursor-pointer h-8 px-4"
                >
                  {category}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {skills && skills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => {
              const tutorCount = tutorCountMap[skill.id] || 0
              return (
                <Link key={skill.id} href={`/skills/${skill.id}`}>
                  <Card className="h-full hover:border-foreground/30 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mb-2">
                          <BookOpen className="h-6 w-6 text-background" />
                        </div>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      {skill.description && (
                        <CardDescription className="line-clamp-2">
                          {skill.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{tutorCount} {tutorCount === 1 ? 'tutor' : 'tutors'} available</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No skills found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
