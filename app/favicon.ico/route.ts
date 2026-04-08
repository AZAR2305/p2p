import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/icon-light-32x32.png', request.url))
}
