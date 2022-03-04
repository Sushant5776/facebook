import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { EmojiHappyIcon } from '@heroicons/react/outline'
import { CameraIcon, VideoCameraIcon } from '@heroicons/react/solid'
import { useRef, useState } from 'react'
import { fireStore, storage } from '../../firebaseApp'
import {
	collection,
	addDoc,
	serverTimestamp,
	setDoc,
	doc,
} from 'firebase/firestore'
import {
	ref,
	uploadString,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage'

const InputBox = () => {
	const { data: session } = useSession()
	const inputRef = useRef(null)
	const filePickerRef = useRef(null)
	const [imageToPost, setImageToPost] = useState(null)

	const addImageToPost = (event) => {
		const reader = new FileReader()
		console.log(event.target.files)
		if (event.target.files[0]) {
			reader.readAsDataURL(event.target.files[0])
		}

		reader.onload = (readerEvent) => {
			setImageToPost(readerEvent.target.result)
		}
	}

	const removeImage = () => {
		setImageToPost(null)
	}

	const sendPost = (event) => {
		event.preventDefault()
		if (!inputRef.current.value) return

		addDoc(collection(fireStore, 'posts'), {
			message: inputRef.current.value,
			name: session.user.name,
			email: session.user.email,
			image: session.user.image,
			timestamp: serverTimestamp(),
		}).then((docRef) => {
			if (imageToPost) {
				console.log(docRef.id)
				const uploadTask = uploadString(
					ref(storage, `posts/${docRef.id}`),
					imageToPost,
					'data_url'
				)

				removeImage()

				uploadTask.then(() => {
					getDownloadURL(ref(storage, `posts/${docRef.id}`)).then((url) => {
						setDoc(
							doc(collection(fireStore, 'posts'), docRef.id),
							{ postImage: url },
							{ merge: true }
						)
					})
				})
			}
		})

		inputRef.current.value = ''
	}

	return (
		<div className='bg-white rounded-2xl shadow-md text-gray-500 font-medium mt-6'>
			<div className='flex space-x-4 items-center p-2'>
				<Image
					className='rounded-full'
					src={session.user.image}
					width={40}
					height={40}
					alt=''
				/>
				<form className='flex flex-1'>
					<input
						className='rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none'
						type='text'
						ref={inputRef}
						placeholder={`What's on your mind, ${
							session.user.name.split(' ')[0]
						}?`}
					/>
					<button type='submit' className='hidden' onClick={sendPost}>
						Submit
					</button>
				</form>
				{imageToPost && (
					<div
						onClick={removeImage}
						className='flex flex-col mt-2 cursor-pointer filter hover:brightness-110 transition duration-150 transform hover:scale-105'>
						<div className='w-12 h-12 relative'>
							<Image
								className='h-10 object-contain rounded-lg'
								src={imageToPost}
								alt=''
								layout='fill'
							/>
						</div>
						<p className='text-xs text-red-500 text-center'>Remove</p>
					</div>
				)}
			</div>

			<div className='flex justify-evenly p-3 border-t'>
				<div className='inputIcon'>
					<VideoCameraIcon className='h-7 text-red-500' />
					<p className='text-xs xl:text-base sm:text-sm'>Live Video</p>
				</div>

				<div
					onClick={() => filePickerRef.current.click()}
					className='inputIcon'>
					<CameraIcon className='h-7 text-green-400' />
					<p className='text-xs sm:text-sm xl:text-base'>Photo/Video</p>
					<input
						ref={filePickerRef}
						onChange={addImageToPost}
						type='file'
						hidden
					/>
				</div>

				<div className='inputIcon'>
					<EmojiHappyIcon className='h-7 text-yellow-300' />
					<p className='text-xs sm:text-sm xl:text-base'>Feeling/Activity</p>
				</div>
			</div>
		</div>
	)
}

export default InputBox
