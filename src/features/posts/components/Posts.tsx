import React, { useEffect, useState } from 'react'
import useGetPosts from '../api/getPosts'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { PostAttribute } from '../types'
import ImagePost from './ImagePost'
import TextPost from './TextPost'
import VideoPost from './VideoPosts'



const Posts = () => {

    const [pageNumber, setPageNumber] = useState(1)
    const [paginationPosts, setPaginationPosts] = useState<PostAttribute[]>([])
    const {posts, isLoading} = useGetPosts()

    if (isLoading) {
        <FullScreenLoader/>
    }

    useEffect(() => {
        paginationFunction(pageNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, posts])

    function paginationFunction(pageNumber: number){
        const recordPerPage = 5;
        var begin = ((pageNumber - 1) * recordPerPage);
        var end = begin + recordPerPage;
        const results =  posts.slice(0, end)
        setPaginationPosts(results)
    }

    function loadMoreHandler (){
        setPageNumber(prevState => prevState + 1)
    }

    const handlePostType = (post: PostAttribute) => {
        const type = post.type;
        switch (type) {
            case 'image':
                return ( 
                    <ImagePost 
                        post={post}
                    /> )
            case 'text':
                return ( 
                    <TextPost 
                        post={post}
                    /> 
                    )
            case 'video':
                return ( 
                    <VideoPost 
                        post={post}
                        /> 
                    )
            default:
                <div/>
        }
    }

    return (
        <div className="posts">
            {
                paginationPosts.length > 0 &&
                    <React.Fragment>
                        {
                            paginationPosts.map((post) => (
                                <React.Fragment key={post.id}>
                                    { handlePostType(post) }
                                </React.Fragment>
                            ))
                        }
                        {
                            posts.length !== paginationPosts.length && (
                                <button 
                                    className="button button--submit"
                                    onClick={loadMoreHandler}
                                >
                                    Load More
                                </button>
                            )
                        }
                    
                        
                    </React.Fragment>
            }
        </div>
    )
}


export default Posts
