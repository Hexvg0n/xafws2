// app/how-to/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';

async function getGuideBySlug(slug: string) {
    // Ta funkcja powinna być uruchamiana na serwerze, więc możemy bezpośrednio
    // odwołać się do bazy danych lub (bezpieczniej) do naszego API
    // Dla uproszczenia, załóżmy, że mamy dostęp do pełnego URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/guides`, { next: { revalidate: 60 } });

    if (!res.ok) return null;
    
    const guides = await res.json();
    return guides.find((guide: any) => guide.slug === slug);
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
    const guide = await getGuideBySlug(params.slug);

    if (!guide) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Button asChild variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                        <Link href="/how-to">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Powrót do poradników
                        </Link>
                    </Button>
                </div>

                <article>
                    <header className="mb-10">
                        <p className="text-emerald-400 font-semibold mb-2">{guide.category}</p>
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{guide.title}</h1>
                        <p className="text-lg text-white/70">{guide.description}</p>
                        {guide.image && (
                           <div className="mt-8 aspect-video relative rounded-xl overflow-hidden border border-white/10">
                               <Image src={guide.image} alt={guide.title} layout="fill" objectFit="cover" />
                           </div>
                        )}
                    </header>

                    <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-strong:text-white/90 prose-blockquote:border-emerald-500 prose-li:marker:text-emerald-400">
                       {guide.sections.map((section: any, index: number) => (
                           <section key={index} className="mb-8">
                               <h2 className="!text-2xl md:!text-3xl !mb-4">{section.title}</h2>
                               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                   {section.content}
                               </ReactMarkdown>
                           </section>
                       ))}
                    </div>
                </article>
            </div>
        </div>
    );
}