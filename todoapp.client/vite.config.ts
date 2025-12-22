import { defineConfig } from 'vite'
import fs from 'fs';
import path from 'path';
import plugin from '@vitejs/plugin-react';
import child_process from 'child_process';
import { fileURLToPath, URL } from 'node:url';
import { env } from 'process';

interface LaunchProfile {
    commandName?: string;
    applicationUrl?: string;
    environmentVariables?: Record<string, string>;
}

interface LaunchSettings {
    profiles: Record<string, LaunchProfile>;
}
  
const launchSettingsPath = path.resolve(__dirname, '../TodoApp.Server/Properties/launchSettings.json');

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "TodoApp.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

let target = "";
try {
    const launchSettings: LaunchSettings = JSON.parse(fs.readFileSync(launchSettingsPath, 'utf-8'));
    const profiles = launchSettings.profiles;
  
    const httpsProfile = Object.values(profiles).find(profile =>
      profile.applicationUrl?.includes('https://')
    );
  
    if (httpsProfile?.applicationUrl) {
      const urls = httpsProfile.applicationUrl.split(';');
      const httpsUrl = urls.find(url => url.startsWith('https://'));
      if (httpsUrl) {
        target = httpsUrl;
      }
    }
} catch (err) {
    console.warn('⚠️ Could not load or parse launchSettings.json. Using default target.', err);
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/todo': {
                target,
                secure: false
            }
        },
        port: 7293,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})

