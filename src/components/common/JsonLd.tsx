type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

/** JSON-LD 스키마 출력 (SEO) */
export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
