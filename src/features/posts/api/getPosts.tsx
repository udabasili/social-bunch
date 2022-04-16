import React, { useEffect, useState } from 'react'
import { useCollection } from 'swr-firestore-v9'
import { PostAttribute } from '../types'

export default function useGetPosts () {

    const { data,  error, isValidating } = useCollection<PostAttribute>(`posts`)
    const [posts, setPosts] = useState<Array<PostAttribute>>([])
    useEffect(() => {
        let postsData = []
        if (data ) {
            if (Object.keys(data).length > 0) {
            for (let key in data) {
                if (data[key]) {
                    postsData.push({
                    ...data[key],
                });
                }
            }
            postsData.sort(function (a, b) {
                return b.createdAt - a.createdAt;
            });
            }
            setPosts([...postsData])
        }

    
    }, [data])
    

    
    return {
        error,
        posts,
        isLoading: !error && !data
    }

}