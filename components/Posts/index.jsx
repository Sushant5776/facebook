import { collection, orderBy, query } from 'firebase/firestore'
import { fireStore } from '../../firebaseApp'
import { useCollection } from 'react-firebase-hooks/firestore'
import Post from '@/components/Post'

const Posts = ({ posts }) => {
	const [realtimePosts, loading, error] = useCollection(
		query(collection(fireStore, 'posts'), orderBy('timestamp', 'desc'))
	)
	return (
		<div>
			{realtimePosts
				? realtimePosts?.docs.map((post) => (
						<Post
							key={post.id}
							name={post.data().name}
							message={post.data().message}
							email={post.data().email}
							timestamp={post.data().timestamp}
							image={post.data().image}
							postImage={post.data().postImage}
						/>
				  ))
				: posts.map((post) => (
						<Post
							key={post.id}
							name={post.name}
							message={post.message}
							email={post.email}
							timestamp={post.timestamp}
							image={post.image}
							postImage={post.postImage}
						/>
				  ))}
		</div>
	)
}

export default Posts
