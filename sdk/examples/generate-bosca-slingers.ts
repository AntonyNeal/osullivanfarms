/**
 * Example: Generate Bosca's Slingers from Prompt
 * 
 * This demonstrates how the SDK can generate a complete themed app
 * from a simple natural language prompt.
 */

import {
  parsePrompt,
  generateApp,
  generateFileStructure,
  generateAssetChecklist,
  auditFiles,
  formatAuditReport
} from '../src/index';

async function example() {
  console.log('\n=== BOSCA\'S SLINGERS GENERATION EXAMPLE ===\n');

  // 1. Parse the prompt
  const prompt = "MTG tournament platform called Bosca's Slingers with epic warrior theme and orange colors, domain boscaslingers.ai";
  
  console.log('📝 Prompt:', prompt, '\n');

  // 2. Generate complete app configuration
  const config = await generateApp(prompt);

  console.log('✅ Generated Configuration:');
  console.log('  Business Name:', config.name);
  console.log('  Domain:', config.domain);
  console.log('  Primary Color:', config.theme.colors.primary);
  console.log('  Font:', config.theme.typography.headingFont);
  console.log('  Style:', config.theme.animations.particleSystem ? 'Maximalist with particles' : 'Clean');
  console.log('\n  Terminology:');
  console.log('    "book" →', config.theme.terminology.book);
  console.log('    "service" →', config.theme.terminology.service);
  console.log('    "client" →', config.theme.terminology.client);
  console.log('\n  SEO:');
  console.log('    Title:', config.seo.title);
  console.log('    Description:', config.seo.description.substring(0, 80) + '...');
  console.log('    Keywords:', config.seo.keywords.slice(0, 4).join(', '));

  // 3. Generate file structure
  console.log('\n📁 Generated Files:');
  const files = generateFileStructure(config);
  for (const filePath of Object.keys(files)) {
    console.log('  ✓', filePath);
  }

  // 4. Show sample file content
  console.log('\n📄 Sample: index.html');
  console.log('---');
  console.log(files['index.html'].split('\n').slice(0, 20).join('\n'));
  console.log('...\n');

  // 5. Generate asset checklist
  console.log('🎨 Asset Checklist:');
  const checklist = generateAssetChecklist(config.assets);
  console.log(checklist.split('\n').slice(0, 25).join('\n'));
  console.log('...\n');

  // 6. Show what content audit would find in template
  console.log('🔍 Example Content Audit:');
  const sampleFiles = [
    {
      path: 'src/pages/About.tsx',
      content: `
        export default function About() {
          return (
            <div>
              <h1>About Claire Hamilton</h1>
              <p>Professional escort services in Canberra</p>
              <button>Book Your Service</button>
            </div>
          );
        }
      `
    },
    {
      path: 'index.html',
      content: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>[Your Business Name]</title>
            <meta name="description" content="Book your service with professional quality" />
          </head>
        </html>
      `
    }
  ];

  const auditReport = auditFiles(sampleFiles, config.theme);
  console.log(formatAuditReport(auditReport));

  // 7. Show transformation suggestions
  console.log('\n✨ What the SDK Would Transform:\n');
  console.log('Before: "Book your service"');
  console.log('After:  "Register your format"\n');
  console.log('Before: "client testimonials"');
  console.log('After:  "warrior testimonials"\n');
  console.log('Before: "Professional Services in Your City"');
  console.log('After:  "Epic Magic: The Gathering tournaments where legends are forged"\n');

  // 8. Summary
  console.log('\n=== SUMMARY ===\n');
  console.log('✅ Complete theme configuration generated');
  console.log('✅ All file templates created');
  console.log('✅ SEO meta tags configured');
  console.log('✅ Asset specifications provided');
  console.log('✅ Content audit identifies issues');
  console.log('✅ Ready to deploy!\n');
}

// Run example
example().catch(console.error);
