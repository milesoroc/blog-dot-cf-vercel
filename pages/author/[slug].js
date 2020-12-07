import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/author-body'
import Header from '../../components/header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import { CMS_NAME } from '../../lib/constants'

export default function Author({ author, morePosts, preview }) {
  const router = useRouter()

  if (!router.isFallback && !author) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <AuthorTitle>Loading…</AuthorTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {author.title} | Author with {CMS_NAME}
                </title>
                <meta property="og:image" content={author.picture.url} />
              </Head>
              <AuthorBody content={author.name} />
            </article>
            <SectionSeparator />
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPostAndMorePosts(params.slug, preview)

  return {
    props: {
      preview,
      author: data?.author ?? null,
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths: allPosts?.map(({ slug }) => `/author/${slug}`) ?? [],
    fallback: true,
  }
}
