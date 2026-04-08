'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSessionBooking(input: {
  tutorId: string
  skillId: string
  scheduledAtIso: string
  durationMinutes: number
  notes?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book a session.' }
  }

  if (user.id === input.tutorId) {
    return { error: 'You cannot book a session with yourself.' }
  }

  const { data: tutorSkill } = await supabase
    .from('profile_skills')
    .select('skill_id')
    .eq('profile_id', input.tutorId)
    .eq('skill_id', input.skillId)
    .eq('is_teaching', true)
    .maybeSingle()

  if (!tutorSkill) {
    return { error: 'Selected tutor does not currently teach this skill.' }
  }

  const { data: tutorProfile } = await supabase
    .from('profiles')
    .select('hourly_rate')
    .eq('id', input.tutorId)
    .maybeSingle()

  const price = tutorProfile?.hourly_rate
    ? (Number(tutorProfile.hourly_rate) * input.durationMinutes) / 60
    : null

  const { error } = await supabase.from('sessions').insert({
    tutor_id: input.tutorId,
    student_id: user.id,
    skill_id: input.skillId,
    scheduled_at: input.scheduledAtIso,
    duration_minutes: input.durationMinutes,
    notes: input.notes || null,
    price,
    status: 'pending',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/sessions')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function updateSessionStatusAction(sessionId: string, status: 'confirmed' | 'completed' | 'cancelled') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in.' }
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('id, tutor_id, student_id, status')
    .eq('id', sessionId)
    .maybeSingle()

  if (!session) {
    return { error: 'Session not found.' }
  }

  const isTutor = session.tutor_id === user.id
  const isParticipant = isTutor || session.student_id === user.id

  if (!isParticipant) {
    return { error: 'You are not allowed to update this session.' }
  }

  if ((status === 'confirmed' || status === 'completed') && !isTutor) {
    return { error: 'Only the tutor can confirm or complete sessions.' }
  }

  if (status === 'confirmed' && session.status !== 'pending') {
    return { error: 'Only pending sessions can be confirmed.' }
  }

  if (status === 'completed' && session.status !== 'confirmed') {
    return { error: 'Only confirmed sessions can be completed.' }
  }

  if (status === 'cancelled' && session.status === 'completed') {
    return { error: 'Completed sessions cannot be cancelled.' }
  }

  const { error } = await supabase
    .from('sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/sessions')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function submitSessionReviewAction(input: {
  sessionId: string
  rating: number
  comment?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in.' }
  }

  if (input.rating < 1 || input.rating > 5) {
    return { error: 'Rating must be between 1 and 5.' }
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('id, tutor_id, student_id, status')
    .eq('id', input.sessionId)
    .maybeSingle()

  if (!session) {
    return { error: 'Session not found.' }
  }

  const isParticipant = session.tutor_id === user.id || session.student_id === user.id
  if (!isParticipant) {
    return { error: 'You can only review your own sessions.' }
  }

  if (session.status !== 'completed') {
    return { error: 'Reviews can only be submitted for completed sessions.' }
  }

  const revieweeId = session.tutor_id === user.id ? session.student_id : session.tutor_id

  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('session_id', input.sessionId)
    .eq('reviewer_id', user.id)
    .maybeSingle()

  if (existing) {
    return { error: 'You have already reviewed this session.' }
  }

  const { error } = await supabase.from('reviews').insert({
    session_id: input.sessionId,
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    rating: input.rating,
    comment: input.comment?.trim() ? input.comment.trim() : null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/sessions')
  revalidatePath('/dashboard/reviews')

  return { success: true }
}
