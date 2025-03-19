import { Note } from '@prisma/client';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';

export type SearchResults = {
  results?: Array<Pick<Note, 'id' | 'title' | 'content' | 'createdAt' | 'updatedAt'>>;
  error?: string;
};

export async function action() {
  throw new Response('Not allowed', { status: 405 });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);

  let query = url.searchParams.get('query');
  if (!query) {
    return json({ results: [] });
  }

  // Clean and prepare search terms
  const searchTerms = query
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => term.replace(/"/g, '""'))
    .join(' | '); // Combine terms with OR operator

  try {
    const searchResults = await prisma.$queryRaw<
      Array<Pick<Note, 'id' | 'title' | 'content' | 'createdAt' | 'updatedAt'>>
    >`
      WITH search_query AS (SELECT to_tsquery('english', ${searchTerms}) AS query)
      SELECT 
        id, title, content, "createdAt", "updatedAt",
        ts_rank(
          to_tsvector('english', title || ' ' || content), 
          search_query.query
        ) AS rank
      FROM "Note", search_query
      WHERE 
        "userId" = ${userId}
        AND to_tsvector('english', title || ' ' || content) @@ search_query.query
      ORDER BY rank DESC
      LIMIT 25;
    `;

    return json({ results: searchResults });
  } catch (error) {
    console.error('Search error:', error);
    return json({ error: 'An error occurred while searching' }, { status: 500 });
  }
}
