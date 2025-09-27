import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { tryCatch } from '@/lib/tryCatch';

interface RequestBody {
  slug?: string;
}

function parseRequestBody(input: unknown): RequestBody {
  if (input === null || typeof input !== 'object') {
    return {};
  }
  const obj = input as Record<string, unknown>;
  const slug = typeof obj.slug === 'string' ? obj.slug : undefined;
  return { slug };
}

export async function POST(req: Request) {
  const authorizationHeader = req.headers.get('authorization') ?? '';
  const providedSecret = authorizationHeader.replace(/^Bearer\s+/i, '');
  const expectedSecret = process.env.NEXT_REVALIDATE_SECRET;

  if (providedSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data, error } = await tryCatch<unknown>(req.json() as Promise<unknown>);
  if (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
  const { slug } = parseRequestBody(data);

  if (typeof slug !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid slug' },
      { status: 400 }
    );
  }

  revalidatePath(`/${slug}`);
  return NextResponse.json(
    { revalidated: true, path: `/${slug}`},
    { status: 200 }
  );
}
