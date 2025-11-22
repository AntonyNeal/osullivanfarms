# Quick Start: Adding Your Research Paper

## Step 1: Place Your Research Paper

1. Navigate to: `api/research/`
2. Add your PDF research paper (or text/markdown file)
3. Example: `sheep-breeding-research.pdf`

## Step 2: Run Database Migration

In Azure Data Studio or via API:

```sql
-- Connect to your PostgreSQL database
-- Run: db/migrations/005_add_agent_memory.sql

CREATE TABLE IF NOT EXISTS agent_memory (
  memory_id SERIAL PRIMARY KEY,
  memory_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plus mob_events table if not exists
-- See full migration file for details
```

## Step 3: Enable OpenAI (Optional but Recommended)

### For Azure Functions:
1. Go to Azure Portal → Your Function App
2. Navigate to **Configuration** → **Application Settings**
3. Add new setting:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-...` (your OpenAI API key)
4. Click **Save** and **Restart** the function app

### For Local Development:
Add to `api/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "OPENAI_API_KEY": "sk-proj-...",
    "DATABASE_URL": "postgresql://..."
  }
}
```

## Step 4: Install OpenAI Library (if not already)

```bash
cd api
npm install openai
```

For PDF parsing support:
```bash
npm install pdf-parse
```

## Step 5: Test the System

### With OpenAI Enabled:
Ask the chatbot:
- "What's my best performing mob?" (uses `get_mobs` tool)
- "Move Mob 2 to Paddock 15" (requests confirmation)
- "What does the research say about [topic]?" (searches your PDF)

### Without OpenAI (Pattern Matching):
Basic questions still work:
- "What's my average scanning percentage?"
- "How many mobs do I have?"
- "Which mob is struggling?"

## Current System Status

**✅ Deployed:**
- MCP-style tools system (7 database tools)
- Research paper integration framework
- Project memory system
- Comprehensive instruction set
- Confirmation dialog UI
- Pattern matching fallback

**⚙️ To Enable:**
- OpenAI API key (for full AI capabilities)
- Database migration (for memory persistence)
- PDF parsing library (for PDF research papers)

**📄 Current Support:**
- TXT files: ✅ Working now
- MD files: ✅ Working now
- PDF files: ⚠️ Needs `pdf-parse` library

## Testing Checklist

- [ ] Database migration run
- [ ] OpenAI API key added
- [ ] Research paper placed in `api/research/`
- [ ] Test read operation: "What's my best mob?"
- [ ] Test write operation: "Move Mob X to Paddock Y"
- [ ] Confirm approval dialog appears
- [ ] Test research query: "What does the research say about X?"
- [ ] Check memory persistence across sessions

## Example Research Paper Test

1. Add `sheep-breeding-best-practices.txt` to `api/research/`
2. Ask: "What does the research say about scanning rates?"
3. AI will:
   - Search the research file
   - Find relevant chunks
   - Synthesize answer with your farm data
   - Reference specific research findings

## Troubleshooting

### "OpenAI library not installed"
```bash
cd api
npm install openai
func start  # Restart local functions
```

### "Agent memory table not found"
Run the migration: `db/migrations/005_add_agent_memory.sql`

### "PDF parsing not yet implemented"
Add a `.txt` or `.md` version of your research, or install:
```bash
npm install pdf-parse
```

### Confirmation dialog not appearing
1. Check browser console for errors
2. Verify OpenAI API key is set
3. Test with: "Move Mob 1 to Paddock 5"
4. Should see yellow confirmation box

## Architecture Summary

```
User Question
    ↓
[Context Loading]
├── Farm Data (mobs, stats)
├── Research Papers (from api/research/)
└── Project Memory (from database)
    ↓
[System Prompt Building]
├── Instructions (Australian farm advisor role)
├── Tool Definitions (7 database tools)
└── Context Summaries
    ↓
[AI Processing]
├── OpenAI: Function calling with tools
└── Fallback: Pattern matching
    ↓
[Tool Execution]
├── Read: Immediate execution
└── Write: Confirmation required
    ↓
[Memory Storage]
└── Log important events
```

## Next Steps

1. **Immediate:** Run database migration
2. **Recommended:** Add OpenAI API key
3. **Optional:** Add research papers
4. **Test:** Try all question types
5. **Monitor:** Check Azure Function logs for errors

## Support

See `FARM-ADVISOR-AGENTIC-SYSTEM.md` for full documentation.
