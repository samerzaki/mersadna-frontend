import type { CSSProperties, ElementType, ReactNode } from 'react';

type MarkdownContentProps = {
  content: string;
  className?: string;
  style?: CSSProperties;
};

const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\[[^\]]+\]\([^)\s]+\)|\*[^*]+\*|_[^_]+_)/g;

function renderInline(value: string): ReactNode[] {
  return value.split(inlinePattern).filter(Boolean).map((token, index) => {
    const key = `${token}-${index}`;
    if (token.startsWith('`')) return <code key={key} className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] dark:bg-slate-800">{token.slice(1, -1)}</code>;
    if (token.startsWith('**') || token.startsWith('__')) return <strong key={key}>{token.slice(2, -2)}</strong>;
    if (token.startsWith('~~')) return <del key={key}>{token.slice(2, -2)}</del>;
    if (token.startsWith('[')) {
      const match = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(token);
      return match ? <a key={key} href={match[2]} target="_blank" rel="noreferrer" className="text-primary-600 underline underline-offset-4 dark:text-primary-400">{match[1]}</a> : token;
    }
    if (token.startsWith('*') || token.startsWith('_')) return <em key={key}>{token.slice(1, -1)}</em>;
    return token;
  });
}

/** A safe, dependency-free renderer for the article Markdown returned by the news API. */
export function MarkdownContent({ content, className, style }: MarkdownContentProps) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(<pre key={`code-${index}`} className="my-5 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100"><code data-language={language || undefined}>{code.join('\n')}</code></pre>);
      continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      const Tag = `h${heading[1].length}` as ElementType;
      blocks.push(<Tag key={`heading-${index}`} className="mt-8 mb-3 font-bold leading-tight">{renderInline(heading[2])}</Tag>);
      index += 1;
      continue;
    }
    if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      blocks.push(<hr key={`rule-${index}`} className="my-8 border-slate-200 dark:border-slate-800" />);
      index += 1;
      continue;
    }
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith('> ')) quote.push(lines[index++].slice(2));
      blocks.push(<blockquote key={`quote-${index}`} className="my-5 border-s-4 border-primary-400 ps-4 italic text-slate-600 dark:text-slate-300">{renderInline(quote.join(' '))}</blockquote>);
      continue;
    }
    const list = /^(?:[-*+]\s+|\d+\.\s+)(.+)$/.exec(line);
    if (list) {
      const ordered = /^\d+\.\s+/.test(line);
      const entries: string[] = [];
      while (index < lines.length) {
        const item = /^(?:[-*+]\s+|\d+\.\s+)(.+)$/.exec(lines[index]);
        if (!item || /^\d+\.\s+/.test(lines[index]) !== ordered) break;
        entries.push(item[1]); index += 1;
      }
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={`list-${index}`} className={`my-5 ${ordered ? 'list-decimal' : 'list-disc'} space-y-2 ps-6`}>{entries.map((entry, itemIndex) => <li key={itemIndex}>{renderInline(entry)}</li>)}</List>);
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^(#{1,6})\s+|^```|^> |^(?:[-*+]\s+|\d+\.\s+)/.test(lines[index])) paragraph.push(lines[index++]);
    blocks.push(<p key={`paragraph-${index}`} className="my-5 leading-8">{paragraph.map((part, partIndex) => <span key={partIndex}>{partIndex > 0 && <br />}{renderInline(part)}</span>)}</p>);
  }

  return <article className={className} style={style}>{blocks}</article>;
}
