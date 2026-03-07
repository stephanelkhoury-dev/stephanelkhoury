type Certificate = {
  id: string;
  title: string;
  issuer: string;
  fileUrl: string;
  externalUrl: string | null;
};

type CertificatesSectionProps = {
  certificates: Certificate[];
};

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  return (
    <section id="certificates" className="py-20 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-3 text-center">Certificates</h2>
      <p className="text-gray-400 text-center mb-10">
        Professional certifications and completed programs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {certificates.map((certificate) => (
          <article key={certificate.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-1">{certificate.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{certificate.issuer}</p>

            <div className="flex flex-wrap gap-2">
              <a
                href={certificate.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-[#3b82f6]/20 border border-white/10 text-sm"
              >
                Open PDF
              </a>
              {certificate.externalUrl && (
                <a
                  href={certificate.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-white/10 text-sm"
                >
                  Preview
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
