# PDF Parser Fix

## Issue
The original `pdf-parse` library was causing `DOMMatrix is not defined` error in Node.js environment.

## Solution
Replaced `pdf-parse` with `pdf2json` - a pure JavaScript PDF parser that works reliably in Node.js without native dependencies.

## Changes Made

### 1. Removed Old Library
```bash
npm uninstall pdf-parse @types/pdf-parse
```

### 2. Installed New Library
```bash
npm install pdf2json
```

### 3. Updated Parser (`lib/parser.ts`)
- Replaced `pdf-parse` with `pdf2json`
- Implemented Promise-based text extraction
- Added proper error handling
- Extracts text from all PDF pages
- Decodes URI-encoded text properly

## How It Works

```typescript
// PDF text extraction flow:
1. Load PDF file using pdf2json
2. Parse PDF structure
3. Extract text from each page
4. Decode URI-encoded characters
5. Join all pages with line breaks
6. Return clean text
```

## Supported File Types

✅ **PDF** - Using `pdf2json`
✅ **DOCX** - Using `mammoth`

## Testing

```bash
# Build project
npm run build

# Start development server
npm run dev

# Upload a PDF resume
# Text should be extracted successfully
```

## Error Handling

If PDF parsing fails:
- Error is logged to console
- Upload continues (doesn't fail)
- Resume is saved with empty `extractedText`
- Groq AI can still extract data from manual input

## Benefits of pdf2json

✅ Pure JavaScript (no native dependencies)
✅ No canvas/DOMMatrix requirements
✅ Works in Node.js environment
✅ Reliable text extraction
✅ Handles multi-page PDFs
✅ Decodes special characters

## Alternative Libraries Tried

❌ **pdf-parse** - DOMMatrix error
❌ **pdfjs-dist** - Requires canvas dependency
✅ **pdf2json** - Works perfectly!

---

**Fixed**: 2026-04-28
**Library**: pdf2json
**Status**: ✅ Working
