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

export default defineConfig(()=>{
    let target = "";

    try {
        const launchSettings: LaunchSettings = JSON.parse(fs.readFileSync(launchSettingsPath, "utf-8"));
        const profiles = launchSettings.profiles ?? {};
        const allUrls = Object.values(profiles).flatMap(p => (p.applicationUrl ?? "").split(";")).map(u => u.trim()).filter(Boolean);

        const inCI = process.env.GITHUB_ACTIONS === "true" || process.env.CI === "true";
        const preferredScheme = inCI ? "http://" : "https://";
        const fallbackScheme = inCI ? "https://" : "http://";

        const preferred = allUrls.find(u => u.startsWith(preferredScheme));
        const fallback = allUrls.find(u => u.startsWith(fallbackScheme));

        const picked = preferred || fallback;
        if (!target && picked){
            target = picked;
        }
    } 
    catch (err) {
        console.warn("⚠️ Could not load or parse launchSettings.json. Using default target.", err);
    }

    return{
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
    }

})

