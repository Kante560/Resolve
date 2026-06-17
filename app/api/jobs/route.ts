import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetching web3 related jobs from Remote OK
    const response = await fetch('https://remoteok.com/api?tag=web3', {
      headers: {
        'User-Agent': 'OnChainEscrowApp/1.0', 
      },
      // Revalidate every 60 seconds (1 minute) to keep it fast but fresh
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Remote OK API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json([]);
    }

    // The Remote OK API always returns a legal disclaimer as the very first item in the array.
    // We slice it off (index 1 onwards) to get just the actual job/gig listings.
    const rawGigs = data.length > 1 ? data.slice(1) : [];

    const gigs = rawGigs.map((job: any) => ({
      id: job.id,
      company: job.company,
      title: job.position,
      logo: job.company_logo,
      tags: job.tags,
      url: job.url,
      location: job.location,
      date: job.date
    }));

    return NextResponse.json(gigs);
  } catch (error: any) {
    console.error('Jobs API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gigs. Please try again later.' },
      { status: 500 }
    );
  }
}
