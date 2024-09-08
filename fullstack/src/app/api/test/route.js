// src/app/api/posts/route.js
import db from '../../../db'; // Adjust the path as necessary

export async function GET() {
  try {
    const posts = await db.any('SELECT * FROM posts');
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error('Database query failed', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, content } = await request.json();
    const result = await db.one(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Database query failed', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), { status: 500 });
  }
}