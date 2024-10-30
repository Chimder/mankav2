import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
  const route = useRouter()
  const query = route.query


  const id = 'c9c13bf0-abd8-46a8-9b82-18c248b1db89'
  // const { data: manga, isFetching } = mangaApi.useMangaByID(id)
  // console.log(manga?.data)

  // const { data } = tagsApi.useMangaTags()

  // console.log(data)
  // if (isFetching) return <div>LODOADOSAODOAODOOSAODSOADOAODOADo</div>

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/* <div>{manga?.data?.attributes?.title?.en}</div> */}
        <footer></footer>
      </div>
    </>
  )
}
