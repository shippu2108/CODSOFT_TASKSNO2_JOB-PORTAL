import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    const applications = await prisma.application.findMany({
      where: {
        jobId,
        job: { postedById: session.user.id },
      },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
            candidateProfile: {
              select: { bio: true, skills: true, resumeUrl: true, experience: true },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
  }
}