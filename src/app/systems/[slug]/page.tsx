import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SystemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/platforms/${slug}`);
}
