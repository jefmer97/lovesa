import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const versionPath = path.join(process.cwd(), 'public', 'version.json');
    if (fs.existsSync(versionPath)) {
      const data = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (err) {
    // Fallback si no se puede leer el archivo en runtime
  }

  return NextResponse.json({
    name: 'Lovesa Mobile',
    slug: 'lovesa-mobile',
    version: '1.0.0+3',
    versionCode: 3,
    versionName: '1.0.0',
    mandatory: true,
    changelog: 'Lovesa Mobile release con Clean Architecture y Turbo Push',
    updatedAt: new Date().toISOString(),
    timestamp: Date.now(),
    downloadUrl: 'https://frontend-production-424f.up.railway.app/downloads/lovesa-release.apk',
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
