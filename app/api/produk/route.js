export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Gunakan API seller yang sudah terbukti berfungsi
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/produk/seller`)
  const products = await res.json()

  return Response.json(products)
}
