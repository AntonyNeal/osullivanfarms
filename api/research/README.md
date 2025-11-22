# Research Paper Integration Example

Place your research papers in this folder for the AI to access.

## Supported Formats

- **PDF** (.pdf) - Requires `pdf-parse` library (run `npm install pdf-parse`)
- **Text** (.txt) - Works immediately
- **Markdown** (.md) - Works immediately

## Example Files

### sheep-breeding-best-practices.txt

```
Australian Sheep Breeding Best Practices
========================================

Scanning Rates
--------------
Industry target: 150% scanning rate
Top performers: 160-180% scanning rates
Factors affecting scanning:
- Ewe nutrition pre-joining (target BCS 3.0-3.5)
- Ram fertility and health
- Joining period management (42 days optimal)

Twin Lamb Management
--------------------
Higher scanning rates mean more twins/triplets
Nutritional requirements increase 50% for twin-bearing ewes
Monitor body condition closely during pregnancy

...
```

### example-research.md

```markdown
# Merino Wool Production Research

## Executive Summary

This research examines optimal breeding strategies for Merino sheep...

## Key Findings

- Scanning rates correlate with nutrition quality
- Ram ratio: 1:50 to 1:60 ewes optimal
- Autumn joining produces best results in southern Australia

...
```

## How It Works

1. **File Detection:** System scans this folder on startup
2. **Content Extraction:**
   - Text files: Read directly
   - PDFs: Parsed with pdf-parse library
3. **Chunking:** Content split into 1000-character chunks with 100-char overlap
4. **Caching:** Loaded papers cached in memory for 1 hour
5. **Search:** Keyword search across all chunks (vector search coming soon)
6. **Context Injection:** Relevant chunks added to AI system prompt

## Testing Research Integration

After adding a file, ask the chatbot:

- "What does the research say about scanning rates?"
- "According to the research, what's the optimal ram ratio?"
- "What breeding recommendations does the research provide?"

The AI will:

1. Search your research papers
2. Find relevant sections
3. Combine with your farm data
4. Provide contextualized advice

## Example Conversation

**User:** "What does the research say about twin lambs?"

**AI Response:** "According to the research available, twin-bearing ewes require 50% higher nutritional intake during pregnancy. Your farm has an average scanning rate of 143%, which means you likely have a significant proportion of twin-bearing ewes. The research recommends monitoring body condition scores closely during pregnancy.

Looking at your current mobs:

- Mob 1 has 143% scanning (likely ~40% twins)
- This means approximately 350 of your 865 ewes may be carrying twins

I'd recommend increasing supplementary feeding for your high-scanning mobs, particularly Mob 1, to support the higher nutritional demands."

## Adding Your Research

1. Save your research paper in this folder
2. Name it descriptively (e.g., `australian-sheep-breeding-2024.pdf`)
3. Restart the API (Azure Functions auto-reload)
4. Ask questions that reference the research

## Memory Refresh

Research papers are cached for 1 hour. To force reload:

- Restart the API
- Or wait for 1-hour TTL expiration
- Or modify `api/services/research.js` to clear cache

## Advanced: PDF Parsing

Install the PDF parser:

```bash
cd api
npm install pdf-parse
```

The system will automatically detect and use it for PDF files.

## Future Enhancements

Coming soon:

- **Vector search** - Semantic similarity instead of keywords
- **Multi-document synthesis** - Combine multiple research sources
- **Citation tracking** - Reference specific papers in responses
- **Research summaries** - Auto-generate paper overviews
