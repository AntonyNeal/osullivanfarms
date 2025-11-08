/**
 * Content Audit & Migration Tool
 * Scans files for template content and suggests replacements
 */

import type { ThemeConfig } from '../generators/theme';

export interface AuditResult {
  file: string;
  issues: AuditIssue[];
  score: number;  // 0-100, higher is better
  status: 'clean' | 'warning' | 'critical';
}

export interface AuditIssue {
  type: 'outdated-terminology' | 'template-content' | 'missing-seo' | 'broken-link' | 'placeholder-text';
  severity: 'low' | 'medium' | 'high' | 'critical';
  line?: number;
  column?: number;
  found: string;
  suggestion: string;
  context?: string;
}

export interface AuditReport {
  summary: AuditSummary;
  results: AuditResult[];
  recommendations: string[];
}

export interface AuditSummary {
  totalFiles: number;
  filesWithIssues: number;
  totalIssues: number;
  criticalIssues: number;
  averageScore: number;
}

// Template content patterns to flag
const TEMPLATE_PATTERNS = [
  // Generic escort template
  { pattern: /escort|companion|gfe|girlfriend experience/gi, severity: 'critical' as const, type: 'template-content' as const },
  { pattern: /claire hamilton/gi, severity: 'critical' as const, type: 'template-content' as const },
  { pattern: /canberra companion/gi, severity: 'critical' as const, type: 'template-content' as const },
  
  // Generic placeholders
  { pattern: /\[your business name\]/gi, severity: 'high' as const, type: 'placeholder-text' as const },
  { pattern: /\[your city\]/gi, severity: 'high' as const, type: 'placeholder-text' as const },
  { pattern: /\[business name\]/gi, severity: 'high' as const, type: 'placeholder-text' as const },
  { pattern: /yourdomain\.com/gi, severity: 'high' as const, type: 'placeholder-text' as const },
  { pattern: /your-organization/gi, severity: 'medium' as const, type: 'placeholder-text' as const },
  { pattern: /contact@example\.com/gi, severity: 'medium' as const, type: 'placeholder-text' as const },
  
  // Generic service descriptions
  { pattern: /professional services in your city/gi, severity: 'medium' as const, type: 'template-content' as const },
  { pattern: /book your service/gi, severity: 'low' as const, type: 'outdated-terminology' as const },
  
  // Lorem ipsum
  { pattern: /lorem ipsum/gi, severity: 'high' as const, type: 'placeholder-text' as const },
  
  // Example/test data
  { pattern: /test@test\.com/gi, severity: 'medium' as const, type: 'placeholder-text' as const },
  { pattern: /john doe/gi, severity: 'low' as const, type: 'placeholder-text' as const },
  { pattern: /jane smith/gi, severity: 'low' as const, type: 'placeholder-text' as const },
];

// SEO requirements
const SEO_PATTERNS = [
  { pattern: /<meta\s+property="og:title"/i, name: 'Open Graph title', required: true },
  { pattern: /<meta\s+property="og:description"/i, name: 'Open Graph description', required: true },
  { pattern: /<meta\s+property="og:image"/i, name: 'Open Graph image', required: true },
  { pattern: /<meta\s+property="twitter:card"/i, name: 'Twitter card', required: true },
  { pattern: /<meta\s+name="description"/i, name: 'Meta description', required: true },
];

/**
 * Audit a single file for issues
 */
export function auditFile(filePath: string, content: string, theme?: ThemeConfig): AuditResult {
  const issues: AuditIssue[] = [];
  const lines = content.split('\n');

  // Check for template patterns
  for (const { pattern, severity, type } of TEMPLATE_PATTERNS) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const line = lines[lineNumber - 1];
      
      issues.push({
        type,
        severity,
        line: lineNumber,
        found: match[0],
        suggestion: generateSuggestion(match[0], theme),
        context: line.trim(),
      });
    }
  }

  // Check for missing SEO tags (HTML files only)
  if (filePath.endsWith('.html') || filePath.endsWith('.tsx')) {
    for (const { pattern, name, required } of SEO_PATTERNS) {
      if (required && !pattern.test(content)) {
        issues.push({
          type: 'missing-seo',
          severity: 'high',
          found: 'Missing tag',
          suggestion: `Add ${name} meta tag`,
        });
      }
    }
  }

  // Check for outdated terminology
  if (theme) {
    const terminologyChecks = [
      { old: 'book', new: theme.terminology.book },
      { old: 'service', new: theme.terminology.service },
      { old: 'client', new: theme.terminology.client },
      { old: 'booking', new: theme.terminology.booking },
    ];

    for (const { old, new: newTerm } of terminologyChecks) {
      if (old !== newTerm) {
        const regex = new RegExp(`\\b${old}\\b`, 'gi');
        const matches = content.matchAll(regex);
        for (const match of matches) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          issues.push({
            type: 'outdated-terminology',
            severity: 'low',
            line: lineNumber,
            found: match[0],
            suggestion: `Consider using "${newTerm}" instead of "${old}"`,
            context: lines[lineNumber - 1].trim(),
          });
        }
      }
    }
  }

  // Calculate score
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const mediumCount = issues.filter(i => i.severity === 'medium').length;
  const lowCount = issues.filter(i => i.severity === 'low').length;

  const score = Math.max(0, 100 - (criticalCount * 25) - (highCount * 10) - (mediumCount * 5) - (lowCount * 2));
  
  const status = criticalCount > 0 ? 'critical' : highCount > 0 ? 'warning' : 'clean';

  return {
    file: filePath,
    issues,
    score,
    status,
  };
}

/**
 * Generate replacement suggestion based on found pattern
 */
function generateSuggestion(found: string, theme?: ThemeConfig): string {
  const lower = found.toLowerCase();

  // Template content
  if (lower.includes('escort') || lower.includes('companion')) {
    return 'Remove or replace with industry-appropriate content';
  }
  if (lower.includes('claire hamilton')) {
    return theme ? `Replace with "${theme.terminology.client}" or actual business owner name` : 'Replace with actual name';
  }

  // Placeholders
  if (lower.includes('[your business name]') || lower.includes('[business name]')) {
    return 'Replace with actual business name';
  }
  if (lower.includes('[your city]')) {
    return 'Replace with actual city/location';
  }
  if (lower.includes('yourdomain.com')) {
    return 'Replace with actual domain';
  }
  if (lower.includes('your-organization')) {
    return 'Replace with actual organization name';
  }

  // Generic
  if (lower.includes('lorem ipsum')) {
    return 'Replace with actual content';
  }
  if (lower.includes('test@')) {
    return 'Replace with real email address';
  }

  return 'Update with project-specific content';
}

/**
 * Audit multiple files
 */
export function auditFiles(files: { path: string; content: string }[], theme?: ThemeConfig): AuditReport {
  const results = files.map(f => auditFile(f.path, f.content, theme));
  
  const totalFiles = results.length;
  const filesWithIssues = results.filter(r => r.issues.length > 0).length;
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const criticalIssues = results.reduce((sum, r) => 
    sum + r.issues.filter(i => i.severity === 'critical').length, 0
  );
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalFiles;

  const recommendations = generateRecommendations(results);

  return {
    summary: {
      totalFiles,
      filesWithIssues,
      totalIssues,
      criticalIssues,
      averageScore: Math.round(averageScore),
    },
    results: results.filter(r => r.issues.length > 0).sort((a, b) => a.score - b.score),
    recommendations,
  };
}

/**
 * Generate recommendations based on audit results
 */
function generateRecommendations(results: AuditResult[]): string[] {
  const recommendations: string[] = [];

  const criticalFiles = results.filter(r => r.status === 'critical');
  if (criticalFiles.length > 0) {
    recommendations.push(`⚠️ CRITICAL: ${criticalFiles.length} file(s) contain template content that must be replaced immediately`);
  }

  const missingMeta = results.filter(r => 
    r.issues.some(i => i.type === 'missing-seo')
  );
  if (missingMeta.length > 0) {
    recommendations.push(`📊 Add Open Graph and Twitter Card meta tags for better social media sharing`);
  }

  const placeholders = results.filter(r =>
    r.issues.some(i => i.type === 'placeholder-text')
  );
  if (placeholders.length > 0) {
    recommendations.push(`✏️ Replace placeholder text with actual business information in ${placeholders.length} file(s)`);
  }

  const terminology = results.filter(r =>
    r.issues.some(i => i.type === 'outdated-terminology')
  );
  if (terminology.length > 0) {
    recommendations.push(`🔄 Consider updating terminology to match your industry standards`);
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ No issues found - content appears clean!');
  }

  return recommendations;
}

/**
 * Format audit report as readable text
 */
export function formatAuditReport(report: AuditReport): string {
  let output = '';

  // Summary
  output += `\n${'='.repeat(60)}\n`;
  output += `  CONTENT AUDIT REPORT\n`;
  output += `${'='.repeat(60)}\n\n`;
  output += `Total Files Scanned: ${report.summary.totalFiles}\n`;
  output += `Files with Issues: ${report.summary.filesWithIssues}\n`;
  output += `Total Issues Found: ${report.summary.totalIssues}\n`;
  output += `Critical Issues: ${report.summary.criticalIssues}\n`;
  output += `Average Score: ${report.summary.averageScore}/100\n\n`;

  // Recommendations
  if (report.recommendations.length > 0) {
    output += `RECOMMENDATIONS:\n`;
    output += `${'-'.repeat(60)}\n`;
    report.recommendations.forEach(rec => {
      output += `${rec}\n`;
    });
    output += '\n';
  }

  // Detailed issues
  if (report.results.length > 0) {
    output += `DETAILED ISSUES:\n`;
    output += `${'-'.repeat(60)}\n\n`;
    
    for (const result of report.results) {
      output += `📁 ${result.file} (Score: ${result.score}/100, Status: ${result.status.toUpperCase()})\n`;
      
      const grouped = groupIssuesBySeverity(result.issues);
      
      for (const [severity, issues] of Object.entries(grouped)) {
        if (issues.length > 0) {
          const icon = severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : severity === 'medium' ? '🟡' : '🟢';
          output += `  ${icon} ${severity.toUpperCase()} (${issues.length}):\n`;
          
          issues.slice(0, 5).forEach(issue => {  // Show max 5 per severity
            output += `     Line ${issue.line || '?'}: "${issue.found}"\n`;
            output += `     → ${issue.suggestion}\n`;
            if (issue.context) {
              output += `     Context: ${issue.context.substring(0, 80)}${issue.context.length > 80 ? '...' : ''}\n`;
            }
            output += '\n';
          });
          
          if (issues.length > 5) {
            output += `     ... and ${issues.length - 5} more ${severity} issue(s)\n\n`;
          }
        }
      }
      output += '\n';
    }
  }

  return output;
}

/**
 * Group issues by severity
 */
function groupIssuesBySeverity(issues: AuditIssue[]): Record<string, AuditIssue[]> {
  return {
    critical: issues.filter(i => i.severity === 'critical'),
    high: issues.filter(i => i.severity === 'high'),
    medium: issues.filter(i => i.severity === 'medium'),
    low: issues.filter(i => i.severity === 'low'),
  };
}

/**
 * Generate migration script for automated fixes
 */
export function generateMigrationScript(results: AuditResult[], theme: ThemeConfig): string {
  const replacements: Array<{ file: string; old: string; new: string }> = [];

  for (const result of results) {
    for (const issue of result.issues) {
      if (issue.type === 'outdated-terminology' || issue.type === 'placeholder-text') {
        replacements.push({
          file: result.file,
          old: issue.found,
          new: generateReplacement(issue.found, theme),
        });
      }
    }
  }

  let script = '#!/bin/bash\n\n';
  script += '# Auto-generated migration script\n';
  script += '# Review before running!\n\n';

  for (const { file, old, new: newText } of replacements) {
    const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    script += `sed -i 's/${escaped}/${newText}/g' "${file}"\n`;
  }

  return script;
}

/**
 * Generate replacement text
 */
function generateReplacement(found: string, theme: ThemeConfig): string {
  const term = theme.terminology;
  
  if (/\bbook\b/i.test(found)) return term.book;
  if (/\bservice\b/i.test(found)) return term.service;
  if (/\bclient\b/i.test(found)) return term.client;
  if (/\bbooking\b/i.test(found)) return term.booking;
  
  return '[REPLACE_ME]';
}

/**
 * Export audit report to JSON
 */
export function exportAuditJSON(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}
