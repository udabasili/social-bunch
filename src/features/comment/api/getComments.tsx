import React, { useEffect, useState } from 'react'
import { useDocument } from 'swr-firestore-v9'
import { CommentAttributes } from '../type';

type CommentsProps = {
    [x:string]: CommentAttributes
}
// export default function useGetComments (commentId: string | null) {

//     const { data, error } = useDocument<CommentsProps>(commentId ? `comments/${commentId}` : null);
//     const [comment, setComment] = useState<Array<CommentAttributes>>([])

//     useEffect(() => {
//         let commentsData = []
//         if (data) {
//             if (Object.keys(data).length > 0) {
//             for (let key in data) {
//                 if (data[key]) {
//                     commentsData.push({
//                     ...data[key],
//                 });
//                 }
//             }
//             commentsData.sort(function (a, b) {
//                 return b.createdOn.seconds - a.createdOn.seconds;
//             });
//             }
//             setComments([...commentsData])
//         }

    
//     }, [data])
    

    
//     return {
//         error,
//         comments,
//         isLoading: !error && !data
//     }

// }