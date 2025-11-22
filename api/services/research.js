const fs = require('fs');
const path = require('path');

/**
 * Research Paper Service
 * Manages PDF research papers for LLM context injection
 */

// In-memory store for research content (in production, use Redis or vector DB)
let researchCache = null;
let lastLoadTime = null;
const CACHE_TTL = 3600000; // 1 hour

/**
 * Load and parse research papers from the research folder
 */
async function loadResearchPapers() {
  // Check cache
  if (researchCache && lastLoadTime && Date.now() - lastLoadTime < CACHE_TTL) {
    return researchCache;
  }

  try {
    const researchDir = path.join(__dirname, '../research');
    const papers = [];

    // Check if research directory exists
    if (!fs.existsSync(researchDir)) {
      console.log('[Research] Research directory not found, creating...');
      fs.mkdirSync(researchDir, { recursive: true });

      // Create a placeholder README
      fs.writeFileSync(
        path.join(researchDir, 'README.md'),
        `# Research Papers

Place your PDF research papers in this folder for LLM context injection.

Supported formats:
- PDF (.pdf)
- Text (.txt)
- Markdown (.md)

The chatbot will have direct access to this content when answering questions.
`
      );

      return {
        papers: [],
        totalChunks: 0,
      };
    }

    const files = fs.readdirSync(researchDir);

    for (const file of files) {
      const filePath = path.join(researchDir, file);
      const ext = path.extname(file).toLowerCase();

      // Skip non-document files
      if (!['.pdf', '.txt', '.md'].includes(ext)) {
        continue;
      }

      // For now, handle text-based files
      // TODO: Add PDF parsing with pdf-parse library
      if (ext === '.txt' || ext === '.md') {
        const content = fs.readFileSync(filePath, 'utf-8');
        const chunks = chunkText(content, 1000); // 1000 char chunks

        papers.push({
          filename: file,
          title: path.basename(file, ext),
          format: ext.slice(1),
          chunks: chunks.length,
          content: chunks,
          loadedAt: new Date().toISOString(),
        });
      } else if (ext === '.pdf') {
        // Placeholder for PDF parsing
        papers.push({
          filename: file,
          title: path.basename(file, ext),
          format: 'pdf',
          chunks: 0,
          content: ['[PDF parsing not yet implemented - add pdf-parse library]'],
          loadedAt: new Date().toISOString(),
          needsParser: true,
        });
      }
    }

    researchCache = {
      papers,
      totalChunks: papers.reduce((sum, p) => sum + p.chunks, 0),
      lastUpdated: new Date().toISOString(),
    };

    lastLoadTime = Date.now();

    console.log(
      `[Research] Loaded ${papers.length} research papers with ${researchCache.totalChunks} total chunks`
    );

    return researchCache;
  } catch (error) {
    console.error('[Research] Error loading research papers:', error);
    return {
      papers: [],
      totalChunks: 0,
      error: error.message,
    };
  }
}

/**
 * Chunk text into smaller pieces for better LLM context
 */
function chunkText(text, chunkSize = 1000, overlap = 100) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap; // Overlap to maintain context
  }

  return chunks;
}

/**
 * Build research context for system prompt
 */
async function buildResearchContext() {
  const research = await loadResearchPapers();

  if (!research.papers || research.papers.length === 0) {
    return null;
  }

  // Build context string
  let context = '\n\n**RESEARCH KNOWLEDGE BASE:**\n';
  context += `You have access to ${research.papers.length} research paper(s):\n\n`;

  for (const paper of research.papers) {
    context += `**${paper.title}** (${paper.format.toUpperCase()}):\n`;

    if (paper.needsParser) {
      context += `[PDF content extraction pending - install pdf-parse library]\n\n`;
      continue;
    }

    // Include first few chunks or summary
    const previewChunks = paper.content.slice(0, 3); // First 3 chunks
    context += previewChunks.join('\n...\n') + '\n\n';

    if (paper.chunks > 3) {
      context += `[${paper.chunks - 3} additional chunks available]\n\n`;
    }
  }

  context += `\nUse this research knowledge when providing advice. Reference specific findings when relevant.\n`;

  return context;
}

/**
 * Search research papers for relevant content
 * Simple keyword search - in production, use vector similarity
 */
async function searchResearch(query, maxResults = 5) {
  const research = await loadResearchPapers();

  if (!research.papers || research.papers.length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const results = [];

  for (const paper of research.papers) {
    if (paper.needsParser) continue;

    for (let i = 0; i < paper.content.length; i++) {
      const chunk = paper.content[i];
      if (chunk.toLowerCase().includes(queryLower)) {
        results.push({
          paper: paper.title,
          chunkIndex: i,
          content: chunk,
          relevance: calculateRelevance(chunk, queryLower),
        });
      }
    }
  }

  // Sort by relevance and limit results
  results.sort((a, b) => b.relevance - a.relevance);
  return results.slice(0, maxResults);
}

/**
 * Simple relevance scoring
 */
function calculateRelevance(text, query) {
  const textLower = text.toLowerCase();
  const matches = (textLower.match(new RegExp(query, 'g')) || []).length;
  return matches;
}

/**
 * Get research summary for initial system prompt
 */
async function getResearchSummary() {
  const research = await loadResearchPapers();

  if (!research.papers || research.papers.length === 0) {
    return 'No research papers currently loaded.';
  }

  return `${research.papers.length} research paper(s) available: ${research.papers.map((p) => p.title).join(', ')}`;
}

/**
 * Clear research cache (call when papers are added/removed)
 */
function clearCache() {
  researchCache = null;
  lastLoadTime = null;
}

module.exports = {
  loadResearchPapers,
  buildResearchContext,
  searchResearch,
  getResearchSummary,
  clearCache,
};
