import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalUsers, totalCandidates, totalRecruiters, totalJobs, totalApplications] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'CANDIDATE' } }),
        prisma.user.count({ where: { role: 'RECRUITER' } }),
        prisma.job.count(),
        prisma.application.count(),
      ]);

    const recentJobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        postedBy: { select: { name: true } },
        _count: { select: { applications: true } },
      },
    });

    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({
      stats: { totalUsers, totalCandidates, totalRecruiters, totalJobs, totalApplications },
      recentJobs,
      allUsers,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}