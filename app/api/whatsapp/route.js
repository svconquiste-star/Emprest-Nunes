export const dynamic = 'force-dynamic';

const NUMBERS = ['5531971167633', '5531971545366'];

let counter = 0;

export async function GET() {
  const phone = NUMBERS[counter % NUMBERS.length];
  counter = (counter + 1) % NUMBERS.length;
  return Response.json({ phone }, { headers: { 'Cache-Control': 'no-store' } });
}
