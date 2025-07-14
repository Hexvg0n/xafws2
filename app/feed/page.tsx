import { FeedContent } from "@/components/feed/feed-content"

export default function FeedPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Feed Społeczności</h1>
          <p className="text-white/70">Najnowsze zakupy i recenzje od społeczności RepMafia</p>
        </div>

        <FeedContent />
      </div>
    </div>
  )
}
