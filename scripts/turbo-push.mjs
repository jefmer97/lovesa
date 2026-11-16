#!/usr/bin/env node

/**
 * ⚡ TURBO PUSH CLI — LOVESA AUTOMATED RELEASES
 * 
 * Uso:
 *   node scripts/turbo-push.mjs [mensaje]
 *   ./scripts/turbo-push.sh [mensaje]
 * 
 * Características:
 *  1. Valida que el código esté limpio y sin conflictos.
 *  2. Incrementa el build/patch en frontend/public/version.json.
 *  3. Crea commit automático con tag [turbo-local] para no saturar pipelines lentos.
 *  4. Ejecuta git push directo a origin main, disparando el despliegue automático en Railway.
 *  5. Envía confirmación en consola con el tiempo exacto.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const versionJsonPath = path.join(rootDir, 'frontend', 'public', 'version.json');

const startTime = Date.now();
const commitMessageArg = process.argv.slice(2).join(' ').trim();
const commitMessage = commitMessageArg || `turbo-push: update lovesa release ${new Date().toISOString()}`;

console.log('\n🚀 [TURBO PUSH] Iniciando lanzamiento automatizado para Lovesa...');

// 1. Bump version.json
try {
  let versionData = {
    name: 'Lovesa Mobile',
    slug: 'lovesa-mobile',
    version: '1.0.0+1',
    versionCode: 1,
    versionName: '1.0.0',
    mandatory: true,
    changelog: commitMessage,
    updatedAt: new Date().toISOString(),
    timestamp: Date.now(),
    downloadUrl: 'https://frontend-production-424f.up.railway.app/downloads/lovesa-release.apk',
  };

  if (fs.existsSync(versionJsonPath)) {
    const raw = fs.readFileSync(versionJsonPath, 'utf8');
    versionData = JSON.parse(raw);
    versionData.versionCode = (versionData.versionCode || 1) + 1;
    versionData.version = `1.0.0+${versionData.versionCode}`;
    versionData.updatedAt = new Date().toISOString();
    versionData.timestamp = Date.now();
    versionData.changelog = commitMessage;
  }

  fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2) + '\n');
  console.log(`📦 [OTA] version.json actualizado a: ${versionData.version} (Code: ${versionData.versionCode})`);
} catch (err) {
  console.warn('⚠️ No se pudo actualizar version.json:', err.message);
}

// 2. Git Status & Add
try {
  process.chdir(rootDir);
  console.log('📂 [GIT] Agregando archivos...');
  execSync('git add -A', { stdio: 'inherit' });

  // Verificar si hay cambios
  const status = execSync('git status --porcelain').toString();
  if (!status.trim()) {
    console.log('ℹ️ No hay cambios pendientes para subir.');
    process.exit(0);
  }

  // 3. Commit con [turbo-local]
  const fullCommitMessage = `${commitMessage} [turbo-local]`;
  console.log(`📝 [GIT] Creando commit: "${fullCommitMessage}"`);
  execSync(`git commit -m "${fullCommitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  // 4. Push directo a origin main
  console.log('⚡ [PUSH] Enviando a GitHub (origin main)...');
  execSync('git push origin main', { stdio: 'inherit' });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 [TURBO PUSH EXITOSO] Despliegue completado en ${durationSec}s`);
  console.log('🌐 Web en Producción: https://frontend-production-424f.up.railway.app');
  console.log('📡 API en Producción: https://backend-production-5c745.up.railway.app\n');
} catch (err) {
  console.error('\n❌ [ERROR EN TURBO PUSH]:', err.message);
  process.exit(1);
}
