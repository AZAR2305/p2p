'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, BookOpen, GraduationCap, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Skill, ProfileSkill } from '@/lib/types'

const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
]

const proficiencyColors: Record<string, string> = {
  beginner: 'bg-muted text-muted-foreground',
  intermediate: 'bg-foreground/10 text-foreground',
  advanced: 'bg-foreground/20 text-foreground',
  expert: 'bg-foreground text-background',
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [mySkills, setMySkills] = useState<(ProfileSkill & { skill: Skill })[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('')
  const [proficiency, setProficiency] = useState('intermediate')
  const [isTeaching, setIsTeaching] = useState(false)
  const [isLearning, setIsLearning] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    
    // Get all available skills
    const { data: allSkills } = await supabase
      .from('skills')
      .select('*')
      .order('name')
    
    // Get user's skills
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: userSkills } = await supabase
        .from('profile_skills')
        .select('*, skill:skills(*)')
        .eq('profile_id', user.id)
    
      setMySkills(userSkills || [])
    }
    
    setSkills(allSkills || [])
    setLoading(false)
  }

  async function handleAddSkill() {
    if (!selectedSkill) {
      toast.error('Please select a skill')
      return
    }

    if (!isTeaching && !isLearning) {
      toast.error('Please select at least one option: Teaching or Learning')
      return
    }

    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('You must be logged in')
      setSubmitting(false)
      return
    }

    const { error } = await supabase
      .from('profile_skills')
      .insert({
        profile_id: user.id,
        skill_id: selectedSkill,
        proficiency_level: proficiency,
        is_teaching: isTeaching,
        is_learning: isLearning,
      })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Skill added successfully!')
      setDialogOpen(false)
      setSelectedSkill('')
      setProficiency('intermediate')
      setIsTeaching(false)
      setIsLearning(true)
      fetchData()
    }
    setSubmitting(false)
  }

  async function handleRemoveSkill(skillId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profile_skills')
      .delete()
      .eq('profile_id', user.id)
      .eq('skill_id', skillId)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Skill removed')
      fetchData()
    }
  }

  const teachingSkills = mySkills.filter((s) => s.is_teaching)
  const learningSkills = mySkills.filter((s) => s.is_learning)
  const existingSkillIds = mySkills.map((s) => s.skill_id)
  const availableSkills = skills.filter((s) => !existingSkillIds.includes(s.id))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
          <p className="text-muted-foreground mt-1">
            Manage the skills you teach and want to learn
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Skill</DialogTitle>
              <DialogDescription>
                Select a skill and specify whether you want to teach it, learn it, or both.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Skill</Label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Proficiency Level</Label>
                <Select value={proficiency} onValueChange={setProficiency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>I want to</Label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={isTeaching}
                      onCheckedChange={(checked) => setIsTeaching(checked as boolean)}
                    />
                    <span className="text-sm">Teach this skill to others</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={isLearning}
                      onCheckedChange={(checked) => setIsLearning(checked as boolean)}
                    />
                    <span className="text-sm">Learn this skill from others</span>
                  </label>
                </div>
              </div>
              <Button onClick={handleAddSkill} className="w-full" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Skill'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skills I Teach */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-background" />
              </div>
              <div>
                <CardTitle>Skills I Teach</CardTitle>
                <CardDescription>Share your knowledge with others</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {teachingSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No teaching skills yet</p>
                <p className="text-sm mt-1">Add skills you can teach others</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teachingSkills.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold">
                        {item.skill.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{item.skill.name}</p>
                        <p className="text-xs text-muted-foreground">{item.skill.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={proficiencyColors[item.proficiency_level]}>
                        {item.proficiency_level}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveSkill(item.skill_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills I'm Learning */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-background" />
              </div>
              <div>
                <CardTitle>Skills I&apos;m Learning</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {learningSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No learning goals yet</p>
                <p className="text-sm mt-1">Add skills you want to learn</p>
              </div>
            ) : (
              <div className="space-y-3">
                {learningSkills.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold">
                        {item.skill.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{item.skill.name}</p>
                        <p className="text-xs text-muted-foreground">{item.skill.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={proficiencyColors[item.proficiency_level]}>
                        {item.proficiency_level}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveSkill(item.skill_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
