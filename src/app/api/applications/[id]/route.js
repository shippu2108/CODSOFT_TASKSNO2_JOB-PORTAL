import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { sendApplicationStatusEmail } from '@/lib/mailer';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { postedBy: true } },
        candidate: true,
      },
    });

    if (!application || application.job.postedById !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    if (['SHORTLISTED', 'REJECTED', 'HIRED'].includes(status)) {
      sendApplicationStatusEmail({
        to: application.candidate.email,
        candidateName: application.candidate.name,
        jobTitle: application.job.title,
        companyName: application.job.postedBy.name,
        status,
      }).catch((err) => console.error('Email failed:', err));
    }

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}