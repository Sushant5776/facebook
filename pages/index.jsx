import Feed from '@/components/Feed'
import Header from '@/components/Header'
import Login from '@/components/Login'
import SideBar from '@/components/Sidebar'
import Widgets from '@/components/Widgets'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { fireStore } from '../firebaseApp'
import { getSession } from 'next-auth/react'
import Head from 'next/head'

export default function Home({ session, posts }) {
	if (!session) return <Login />
	return (
		<div className='h-screen bg-gray-100 overflow-hidden'>
			<Head>
				<title>Facebook</title>
				<meta
					name='description'
					content='Text your loved once and connect with people around you!'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{/* Header */}
			<Header />

			<main className='flex'>
				{/* Sidebar */}
				<SideBar />
				{/* Feed */}
				<Feed posts={posts} />
				{/* Widgets */}
				<Widgets />
			</main>
		</div>
	)
}

export async function getServerSideProps(context) {
	// get the user
	const session = await getSession(context)
	const posts = await getDocs(
		query(collection(fireStore, 'posts'), orderBy('timestamp', 'desc'))
	)
	const docs = posts.docs.map((post) => ({
		id: post.id,
		...post.data(),
		timestamp: null,
	}))
	return {
		props: { session, posts: docs },
	}
}
