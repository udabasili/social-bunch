import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImagePost from './post/image-post.component';
import VideoPost from './post/video-post.component';
import TextPost from './post/text-post.component';


const Posts = ({ 
    posts,
    currentUser
    }) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [paginationPosts, setPaginationPosts] = useState([])

    useEffect(() => {
        paginationFunction(pageNumber)
    
    }, [pageNumber, posts])

    function paginationFunction(pageNumber){
        const recordPerPage = 5;
        var begin = ((pageNumber - 1) * recordPerPage);
        var end = begin + recordPerPage;
        const results =  posts.slice(0, end)
        setPaginationPosts(results)
    }

    function loadMoreHandler (){
        setPageNumber(prevState => prevState + 1)
    }

    const handlePostType = (post) => {
        const type = post.type;
        switch (type) {
            case 'image':
                return ( 
                    <ImagePost 
                        post={post}
                        currentUser={currentUser}
                    /> )
            case 'text':
                return ( 
                    <TextPost 
                        post={post}
                        currentUser={currentUser}
                    /> 
                    )
            case 'video':
                return ( 
                    <VideoPost 
                        post={post}
                        currentUser={currentUser}
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
                                <React.Fragment key={post._id}>
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

Posts.propTypes = {
    posts: PropTypes.array
}


export default Posts
