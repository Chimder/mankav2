import Link from 'next/link'
import { useRouter } from 'next/router'
import { Chapter } from '@/shared/api/swagger/generated'
import { cn } from '@/shared/lib/tailwind'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { feedApi } from '@/hooks/api/feeds'

import { Skeleton } from '../ui/skeleton'

dayjs.extend(relativeTime)

interface ExtendedChapter extends Chapter {
  attributes: Chapter['attributes'] & {
    allTranslatedChapter?: Chapter[]
  }
}

const Chapters = () => {
  const router = useRouter()
  const mangaId = router?.query?.id as string
  const { data: chapters, isFetching } = feedApi.useMangaFeed(mangaId)

  function filterChapters(chapters: Chapter[] | undefined): ExtendedChapter[] {
    if (!chapters) return []

    const groupedChapters = chapters.reduce(
      (acc, item) => {
        const chapterNumber = item.attributes?.chapter
        if (!chapterNumber) return acc

        if (!acc[chapterNumber]) {
          acc[chapterNumber] = {
            ...item,
            attributes: {
              ...item.attributes,
              allTranslatedChapter: [],
            },
          }
        }

        acc[chapterNumber].attributes?.allTranslatedChapter?.push(item)
        return acc
      },
      {} as Record<string, ExtendedChapter>,
    )

    return Object.values(groupedChapters).sort((a, b) => {
      const chapterA = parseFloat(a.attributes.chapter || '0')
      const chapterB = parseFloat(b.attributes.chapter || '0')
      return chapterB - chapterA
    })
  }

  const filteredChapters = filterChapters(chapters?.data)

  console.log('BOOLE', filterChapters.length === 0)
  return (
    <section className="w-3/5 border border-green-400 text-white">
      <ul className="w-full p-5">
        {isFetching ? (
          Array.from({ length: 16 }, (_, index) => (
            <div
              key={`skeletonTitle-${index}`}
              className="mx-0 my-1.5 flex h-[54px] border border-gray-600 p-1"
            >
              <Skeleton className="h-full w-full bg-slate-500" />
            </div>
          ))
        ) : filteredChapters.length ? (
          filteredChapters.map(chapter => (
            <div
              className="mx-0 my-1.5 flex min-h-[52px] flex-wrap border border-gray-900 p-1 text-lg hover:border-teal-300"
              key={chapter.id}
            >
              <div className="flex grow flex-wrap items-center">
                <div>
                  Ch.{chapter.attributes?.chapter}{' '}
                  {chapter.attributes?.title
                    ? `- ${chapter.attributes.title}`
                    : ''}
                </div>
                <div className="ml-4 flex flex-wrap">
                  {chapter.attributes?.allTranslatedChapter?.map(chap => (
                    <Link
                      key={chap.id}
                      className="ml-4 cursor-pointer text-teal-300 hover:underline"
                      href={
                        chap.attributes?.externalUrl ??
                        `/chapter/${chap.id}?manga=${router.query.id}&lang=${chap.attributes?.translatedLanguage}`
                      }
                    >
                      {chap.attributes?.translatedLanguage}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="ml-auto self-end text-right">
                {chapter.attributes?.publishAt
                  ? dayjs(chapter.attributes.publishAt).fromNow()
                  : 'No data'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-white">No chapters</div>
        )}
      </ul>
    </section>
  )
}

export default Chapters
