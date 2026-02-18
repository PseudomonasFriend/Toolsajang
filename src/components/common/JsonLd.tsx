type JsonLdProps = { data: Record<string, unknown> };

/** JSON-LD 스키마 출력 (SEO) */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
