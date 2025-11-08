#!/usr/bin/env node

/**
 * CLI Tool for Service Booking Platform SDK
 * Usage: npx create-booking-app "MTG tournament platform with epic warrior theme"
 */

import { parsePrompt, generateApp, generateFileStructure } from '../generators/app';
import { formatAuditReport, auditFiles } from '../tools/audit';
import { generateAssetChecklist } from '../generators/assets';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  switch (command) {
    case 'generate':
    case 'create':
      await generateAppCommand(args.slice(1).join(' '));
      break;
    
    case 'audit':
      await auditCommand(args[1] || '.');
      break;
    
    case 'assets':
      await assetsCommand(args.slice(1).join(' '));
      break;
    
    default:
      // If no recognized command, treat entire args as prompt
      await generateAppCommand(args.join(' '));
  }
}

async function generateAppCommand(prompt: string) {
  if (!prompt) {
    console.error('Error: Please provide a prompt');
    console.log('Example: npx create-booking-app "fitness studio with modern blue theme"');
    process.exit(1);
  }

  console.log('\n🚀 Generating app from prompt...\n');
  console.log(`Prompt: "${prompt}"\n`);

  try {
    const config = await generateApp(prompt);
    
    console.log('✅ App configuration generated!\n');
    console.log('📋 Summary:');
    console.log(`  Business: ${config.name}`);
    console.log(`  Domain: ${config.domain}`);
    console.log(`  Theme: ${config.theme.colors.primary} (${config.theme.typography.headingFont})`);
    console.log(`  Style: ${config.theme.animations.particleSystem ? 'Maximalist' : 'Clean'}`);
    console.log(`  Terminology: ${config.theme.terminology.book} → ${config.theme.terminology.service}\n`);

    // Generate files
    console.log('📁 Generating files...\n');
    const files = generateFileStructure(config);
    
    const outputDir = path.join(process.cwd(), config.name.toLowerCase().replace(/\s+/g, '-'));
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write files
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(outputDir, filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`  ✓ ${filePath}`);
    }

    // Write config JSON
    const configPath = path.join(outputDir, 'app-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`  ✓ app-config.json\n`);

    // Show asset checklist
    console.log('🎨 Assets needed:');
    const checklist = generateAssetChecklist(config.assets);
    console.log(checklist.split('\n').slice(0, 15).join('\n'));
    console.log(`\nFull checklist saved to: ${outputDir}/asset-checklist.md\n`);
    fs.writeFileSync(path.join(outputDir, 'asset-checklist.md'), checklist, 'utf-8');

    console.log(`\n✨ App generated successfully in: ${outputDir}\n`);
    console.log('Next steps:');
    console.log(`  1. cd ${path.basename(outputDir)}`);
    console.log('  2. Copy template files from service-booking-platform-template');
    console.log('  3. Replace generated config files');
    console.log('  4. Create assets listed in asset-checklist.md');
    console.log('  5. npm install && npm run dev\n');

  } catch (error) {
    console.error('❌ Error generating app:', error);
    process.exit(1);
  }
}

async function auditCommand(directory: string) {
  console.log(`\n🔍 Auditing content in: ${directory}\n`);

  try {
    const files: { path: string; content: string }[] = [];
    
    // Scan directory for relevant files
    const extensions = ['.tsx', '.ts', '.html', '.jsx', '.js'];
    
    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          scanDir(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          files.push({ path: fullPath, content });
        }
      }
    }

    scanDir(directory);
    
    console.log(`Found ${files.length} files to audit...\n`);
    
    const report = auditFiles(files);
    const formatted = formatAuditReport(report);
    
    console.log(formatted);
    
    // Save report
    const reportPath = path.join(directory, 'audit-report.txt');
    fs.writeFileSync(reportPath, formatted, 'utf-8');
    console.log(`\n📄 Full report saved to: ${reportPath}\n`);

  } catch (error) {
    console.error('❌ Error running audit:', error);
    process.exit(1);
  }
}

async function assetsCommand(prompt: string) {
  if (!prompt) {
    console.error('Error: Please provide a theme prompt');
    console.log('Example: npx booking-sdk assets "MTG tournament with orange epic theme"');
    process.exit(1);
  }

  console.log('\n🎨 Generating asset suggestions...\n');

  try {
    const config = await generateApp(prompt);
    const checklist = generateAssetChecklist(config.assets);
    
    console.log(checklist);
    
    const checklistPath = path.join(process.cwd(), 'asset-checklist.md');
    fs.writeFileSync(checklistPath, checklist, 'utf-8');
    console.log(`\n📄 Checklist saved to: ${checklistPath}\n`);

  } catch (error) {
    console.error('❌ Error generating asset suggestions:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Service Booking Platform SDK CLI

USAGE:
  npx create-booking-app [command] [options]

COMMANDS:
  generate <prompt>    Generate a new app from natural language prompt
  create <prompt>      Alias for generate
  audit [directory]    Audit content for template issues
  assets <prompt>      Generate asset suggestions for a theme
  --help, -h          Show this help message

EXAMPLES:
  # Generate complete app
  npx create-booking-app "MTG tournament platform with epic warrior theme"
  
  # Generate with business details
  npx create-booking-app generate "Fitness studio called FitLife with modern blue theme"
  
  # Audit current directory
  npx create-booking-app audit .
  
  # Get asset suggestions
  npx create-booking-app assets "consulting firm with professional navy theme"

For more information, visit:
https://github.com/your-username/service-booking-platform-template
  `);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
