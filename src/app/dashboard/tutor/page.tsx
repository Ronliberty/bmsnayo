"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

interface Tutorial {
  id: number
  title: string
  videoUrl: string // Embed URL for demo (e.g., YouTube embed)
  thumbnailUrl: string // Placeholder thumbnail for better UX
  isPremium: boolean
  description: string
  categories: string[]
  language: string
  published_at: string
  is_featured: boolean
}

export default function TutorialPage() {
  const [isSubscribed, setIsSubscribed] = useState(false) // Demo state; in real app, fetch from auth/user context
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState("all")

  // Sample data for tutorials with added categories (array), language, published_at, is_featured
  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Introduction to Basics",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl: "https://via.placeholder.com/640x360?text=Intro+Video",
      isPremium: false,
      description: "Learn the fundamentals in this free tutorial. This covers the basic concepts and provides a solid foundation for beginners.",
      categories: ["Beginner", "Basics"],
      language: "English",
      published_at: "2023-01-15",
      is_featured: true,
    },
    {
      id: 2,
      title: "Intermediate Techniques",
      videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
      thumbnailUrl: "https://via.placeholder.com/640x360?text=Intermediate+Video",
      isPremium: false,
      description: "Build on the basics with practical examples. Explore more complex scenarios and hands-on exercises to enhance your skills.",
      categories: ["Intermediate", "Techniques"],
      language: "English",
      published_at: "2023-06-20",
      is_featured: false,
    },
    {
      id: 3,
      title: "Advanced Strategies",
      videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      thumbnailUrl: "https://via.placeholder.com/640x360?text=Advanced+Video",
      isPremium: true,
      description: "Exclusive content for subscribers: Dive deep into advanced topics. Learn optimization strategies and real-world applications.",
      categories: ["Advanced", "Strategies"],
      language: "Spanish",
      published_at: "2024-02-10",
      is_featured: false,
    },
    {
      id: 4,
      title: "Pro Tips and Tricks",
      videoUrl: "https://www.youtube.com/embed/2Vv-BfVoq4g",
      thumbnailUrl: "https://via.placeholder.com/640x360?text=Pro+Video",
      isPremium: true,
      description: "Subscriber-only: Master-level insights and optimizations. Discover hidden features and expert techniques to take your knowledge to the next level.",
      categories: ["Expert", "Tips"],
      language: "French",
      published_at: "2024-05-05",
      is_featured: false,
    },
  ]

  /* -------- Derived Data -------- */
  const allCategories = useMemo(() => {
    const map = new Map<string, { id: number; name: string; slug: string }>()

    tutorials.forEach((tutorial, index) => {
      tutorial.categories?.forEach((cat) => {
        const slug = cat.toLowerCase().replace(/\s+/g, "-")
        map.set(slug, { id: index + 1, name: cat, slug })
      })
    })

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [tutorials])

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((t) => {
      const languageMatch = selectedLanguage === "all" || t.language === selectedLanguage

      const categoryMatch =
        selectedCategories.length === 0 ||
        t.categories?.some((c) => selectedCategories.includes(c.toLowerCase().replace(/\s+/g, "-")))

      return languageMatch && categoryMatch
    })
  }, [tutorials, selectedCategories, selectedLanguage])

  const featured = filteredTutorials.find((t) => t.is_featured)

  function toggleExpand(id: number) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderVideo = (tutorial: Tutorial) => {
    return (
      <div className="relative aspect-video mb-4">
        {tutorial.isPremium && !isSubscribed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 rounded-md">
            <img
              src={tutorial.thumbnailUrl}
              alt={tutorial.title}
              className="absolute inset-0 w-full h-full object-cover blur-sm rounded-md"
            />
            <div className="relative z-10 text-center">
              <span className="text-4xl mb-2">🔒</span>
              <p className="text-muted-foreground font-semibold">Subscribe to Unlock</p>
            </div>
          </div>
        ) : (
          <iframe
            src={tutorial.videoUrl}
            title={tutorial.title}
            className="w-full h-full rounded-md"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    )
  }

  return (
    <>
      {/* Filter Panel */}
      {filtersOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-background border-l z-50
        transform transition-transform duration-300
        ${filtersOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Filters</h3>
          <Button size="icon" variant="ghost" onClick={() => setFiltersOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6 text-sm">
          {/* Language */}
          <div>
            <p className="font-medium mb-2">Language</p>
            <select
    value={selectedLanguage}
    onChange={(e) => setSelectedLanguage(e.target.value)}
    className="w-full border rounded-md p-2 bg-background text-foreground appearance-none cursor-pointer"
  >
    <option value="all">All</option>
    <option value="English">English</option>
    <option value="Spanish">Spanish</option>
    <option value="French">French</option>
  </select>
  
  {/* Custom arrow */}
  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </span>
          </div>

          {/* Categories */}
          <div>
            <p className="font-medium mb-2">Categories</p>
            <div className="space-y-2 max-h-60 overflow-auto pr-1">
              {allCategories.map((category) => (
                <label key={category.slug} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(category.slug)
                          ? prev.filter((t) => t !== category.slug)
                          : [...prev, category.slug]
                      )
                    }}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedLanguage("all")
              selectedCategories.forEach((slug) =>
                setSelectedCategories((prev) => prev.filter((t) => t !== slug))
              )
            }}
          >
            Clear filters
          </Button>
        </div>
      </aside>

      <div className="max-w-5xl mx-auto px-6 py-10 pb-28 space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Tutorials</h1>
            <p className="text-muted-foreground">Filter by category and language</p>
          </div>

          <Button variant="outline" size="icon" onClick={() => setFiltersOpen(true)}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Demo subscription toggle */}
        <div className="flex justify-center sm:justify-start">
          <Button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {isSubscribed ? "Unsubscribe (Demo)" : "Subscribe (Demo)"}
          </Button>
        </div>

        {featured && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>🌟 Featured: {featured.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderVideo(featured)}
              <p className="text-sm">{featured.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id}>
              <CardHeader>
                <CardTitle className="text-base">{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderVideo(tutorial)}

                <p className="text-sm text-muted-foreground">
                  {expanded[tutorial.id]
                    ? tutorial.description
                    : tutorial.description.slice(0, 300) + (tutorial.description.length > 300 ? "..." : "")}
                </p>

                <div className="flex justify-between text-xs mt-2">
                  <span>{tutorial.categories.join(", ")}</span>
                  <span>{formatDate(tutorial.published_at)}</span>
                </div>

                {tutorial.description.length > 300 && (
                  <button
                    onClick={() => toggleExpand(tutorial.id)}
                    className="text-primary text-sm mt-2"
                  >
                    {expanded[tutorial.id] ? "Show less" : "Read more"}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredTutorials.length === 0 && (
            <p className="text-center text-muted-foreground">No tutorials match the selected filters.</p>
          )}
        </div>
      </div>
    </>
  )
}