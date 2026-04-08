export type UserRole = 'tutor' | 'student' | 'both'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  bio: string | null
  hourly_rate: number | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string | null
  created_at: string
}

export interface ProfileSkill {
  id: string
  profile_id: string
  skill_id: string
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  is_teaching: boolean
  is_learning: boolean
  created_at: string
  skill?: Skill
}

export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Session {
  id: string
  tutor_id: string
  student_id: string
  skill_id: string
  scheduled_at: string
  duration_minutes: number
  status: SessionStatus
  notes: string | null
  meeting_link: string | null
  price: number | null
  created_at: string
  updated_at: string
  tutor?: Profile
  student?: Profile
  skill?: Skill
}

export interface Review {
  id: string
  session_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer?: Profile
  reviewee?: Profile
  session?: Session
}

export interface TutorWithSkills extends Profile {
  skills: (ProfileSkill & { skill: Skill })[]
  average_rating: number
  total_reviews: number
}
