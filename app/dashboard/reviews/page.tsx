'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MessageSquare } from 'lucide-react'
import type { Review, Profile, Session, Skill } from '@/lib/types'

type ReviewWithRelations = Review & {
  reviewer: Profile
  reviewee: Profile
  session: Session & { skill: Skill }
}

export default function ReviewsPage() {
  const [receivedReviews, setReceivedReviews] = useState<ReviewWithRelations[]>([])
  const [givenReviews, setGivenReviews] = useState<ReviewWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Fetch reviews received
      const { data: received } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(*),
          reviewee:profiles!reviews_reviewee_id_fkey(*),
          session:sessions(*, skill:skills(*))
        `)
        .eq('reviewee_id', user.id)
        .order('created_at', { ascending: false })

      // Fetch reviews given
      const { data: given } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(*),
          reviewee:profiles!reviews_reviewee_id_fkey(*),
          session:sessions(*, skill:skills(*))
        `)
        .eq('reviewer_id', user.id)
        .order('created_at', { ascending: false })

      setReceivedReviews(received || [])
      setGivenReviews(given || [])

      if (received && received.length > 0) {
        const avg = received.reduce((acc, r) => acc + r.rating, 0) / received.length
        setAverageRating(avg)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-1">
          See what others are saying about your sessions
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-foreground flex items-center justify-center">
                <Star className="h-8 w-8 text-background" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold">{receivedReviews.length}</div>
              <div className="text-sm text-muted-foreground">Reviews Received</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold">{givenReviews.length}</div>
              <div className="text-sm text-muted-foreground">Reviews Given</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="received" className="space-y-6">
        <TabsList>
          <TabsTrigger value="received" className="gap-2">
            <Star className="h-4 w-4" />
            Received ({receivedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="given" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Given ({givenReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No reviews received yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete sessions to start receiving feedback
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} type="received" />
            ))
          )}
        </TabsContent>

        <TabsContent value="given" className="space-y-4">
          {givenReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No reviews given yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Leave a review after completing a session
                </p>
              </CardContent>
            </Card>
          ) : (
            givenReviews.map((review) => (
              <ReviewCard key={review.id} review={review} type="given" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReviewCard({ review, type }: { review: ReviewWithRelations; type: 'received' | 'given' }) {
  const person = type === 'received' ? review.reviewer : review.reviewee
  const label = type === 'received' ? 'From' : 'To'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center text-background font-semibold flex-shrink-0">
            {person.full_name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{person.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {label} &middot; {review.session.skill.name}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? 'fill-foreground text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
