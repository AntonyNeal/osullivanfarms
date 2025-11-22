const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Research Paper Service
 * Manages PDF research papers for LLM context injection
 * Papers are loaded on first use (lazy loading)
 */

// In-memory store for research content (in production, use Redis or vector DB)
let researchCache = null;
let knowledgeMap = null;
let lastLoadTime = null;
const CACHE_TTL = 3600000; // 1 hour

// NOTE: Auto-load removed - papers load on first use to avoid startup crashes

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
        try {
          const stats = fs.statSync(filePath);
          const fileSizeMB = stats.size / (1024 * 1024);

          // Skip PDFs larger than 5MB to avoid memory issues
          if (fileSizeMB > 5) {
            console.warn(`[Research] Skipping large PDF: ${file} (${fileSizeMB.toFixed(2)}MB)`);
            papers.push({
              filename: file,
              title: path.basename(file, ext),
              format: 'pdf',
              chunks: 0,
              content: [
                `[PDF too large for parsing: ${fileSizeMB.toFixed(2)}MB - Please convert to text or markdown]`,
              ],
              loadedAt: new Date().toISOString(),
              tooLarge: true,
            });
            continue;
          }

          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await pdfParse(dataBuffer);
          const content = pdfData.text;

          // Limit content size (max 500KB of text)
          const limitedContent = content.length > 500000 ? content.slice(0, 500000) : content;
          const chunks = chunkText(limitedContent, 1000);

          papers.push({
            filename: file,
            title: path.basename(file, ext),
            format: 'pdf',
            chunks: chunks.length,
            content: chunks,
            metadata: {
              pages: pdfData.numpages,
              info: pdfData.info,
              truncated: content.length > 500000,
            },
            loadedAt: new Date().toISOString(),
          });

          console.log(
            `[Research] Parsed PDF: ${file} (${pdfData.numpages} pages, ${chunks.length} chunks${content.length > 500000 ? ', truncated' : ''})`
          );
        } catch (pdfError) {
          console.error(`[Research] Failed to parse PDF ${file}:`, pdfError.message);
          papers.push({
            filename: file,
            title: path.basename(file, ext),
            format: 'pdf',
            chunks: 0,
            content: [`[PDF parsing failed: ${pdfError.message}]`],
            loadedAt: new Date().toISOString(),
            error: pdfError.message,
          });
        }
      }
    }

    researchCache = {
      papers,
      totalChunks: papers.reduce((sum, p) => sum + p.chunks, 0),
      lastUpdated: new Date().toISOString(),
    };

    // Build knowledge map
    knowledgeMap = buildKnowledgeMap(papers);

    lastLoadTime = Date.now();

    console.log(
      `[Research] Loaded ${papers.length} research papers with ${researchCache.totalChunks} total chunks`
    );
    console.log(
      `[Research] Knowledge map created with ${Object.keys(knowledgeMap.topics).length} topics`
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
 * Build a structured knowledge map from research papers
 * This creates a topic-based index for faster retrieval
 */
function buildKnowledgeMap(papers) {
  const map = {
    topics: {},
    keyPhrases: [],
    summary: '',
  };

  // Extract key topics and concepts
  const allText = papers
    .filter((p) => !p.error)
    .map((p) => p.content.join(' '))
    .join(' ');

  // Simple topic extraction based on common farming terms
  const farmingTopics = {
    lambing: ['lamb', 'ewe', 'birth', 'pregnancy', 'gestation'],
    genetics: ['genetics', 'breeding', 'selection', 'trait', 'heritability'],
    nutrition: ['feed', 'nutrition', 'pasture', 'supplement', 'diet'],
    health: ['health', 'disease', 'parasite', 'treatment', 'vaccine'],
    performance: ['weight', 'growth', 'scanning', 'marking', 'weaning'],
    management: ['management', 'system', 'practice', 'operation', 'decision'],
    technology: ['technology', 'AI', 'data', 'sensor', 'automation'],
    economics: ['cost', 'profit', 'price', 'market', 'economic'],
  };

  // Count occurrences of topic keywords
  const textLower = allText.toLowerCase();
  for (const [topic, keywords] of Object.entries(farmingTopics)) {
    let count = 0;
    const relevantChunks = [];

    for (const paper of papers) {
      if (paper.error) continue;

      for (let i = 0; i < paper.content.length; i++) {
        const chunk = paper.content[i].toLowerCase();
        const matches = keywords.filter((kw) => chunk.includes(kw));

        if (matches.length > 0) {
          count += matches.length;
          relevantChunks.push({
            paper: paper.title,
            chunkIndex: i,
            preview: paper.content[i].slice(0, 200) + '...',
          });
        }
      }
    }

    if (count > 0) {
      map.topics[topic] = {
        count,
        keywords,
        relevantChunks: relevantChunks.slice(0, 5), // Top 5 chunks per topic
      };
    }
  }

  // Generate summary
  const topTopics = Object.entries(map.topics)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([topic, data]) => `${topic} (${data.count} references)`);

  map.summary = `Research covers: ${topTopics.join(', ')}`;

  return map;
}

/**
 * Get the knowledge map for system prompt
 */
function getKnowledgeMap() {
  return knowledgeMap;
}

/**
 * Clear research cache (call when papers are added/removed)
 */
function clearCache() {
  researchCache = null;
  knowledgeMap = null;
  lastLoadTime = null;
}

module.exports = {
  loadResearchPapers,
  buildResearchContext,
  searchResearch,
  getResearchSummary,
  getKnowledgeMap,
  clearCache,
};
