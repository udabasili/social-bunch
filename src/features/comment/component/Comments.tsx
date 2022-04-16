import React, { useState, useRef, FormEvent } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { PostAttribute, PostLikedBy } from "@/features/posts/types";
import Comment from "./Comment";
import { useAuth } from "@/lib/auth";
import { useReplyComment } from "../api/replyComment";
import { useEditPostComment } from "../api/editPostComment";
import { useAddCommentToPost } from "../api/addCommentToPost";
import { Button } from "@/components/Elements";

type CommentsProps = {
  owner: string;
  post: PostAttribute;
  setShowModal: (show: boolean) => void;
  liked: Array<PostLikedBy> | null;
};

function Comments({ setShowModal, post, owner, liked = null }: CommentsProps) {
  const scrollTop = useRef(null);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { addReplyToComment } = useReplyComment(commentId);
  const { editPostComment } = useEditPostComment(commentId);
  const { addCommentToPost } = useAddCommentToPost(post.id);
  // if (!data) return <Text>Loading...</Text>

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    let commentContent = {
      authorName: currentUser.username,
      authorImage: currentUser.image,
      comment,
      createdOn: new Date(),
    };
    const checkSubmit = comment.split(":");
    const checkMode = comment.split("::");

    if (checkMode.length === 2) {
      commentContent = {
        authorName: currentUser.username,
        authorImage: currentUser.image,
        comment: checkMode[1],
        createdOn: new Date(),
      };
      editPostComment({ commentContent })
        .then(() => {
          toast.success("Comment edited");
          setComment("");
          setIsLoading(false);
        })
        .catch((e) => {
            setIsLoading(false)
        });
      return;
    }

    if (checkSubmit.length === 2) {
      addReplyToComment({ reply: checkSubmit[1] }).then((response) => {
        setIsLoading(false)
    })
    .catch((e) => {
        setIsLoading(false)
    });
      setComment("");
    } else {
      addCommentToPost({ commentContent, postOwner: owner })
        .then((response) => {
            setIsLoading(false)
            toast.success("Comment Added");
            setComment("");
        })
        .catch((e) => {
            setIsLoading(false)
        });
    }
  };

  return (
    <React.Fragment>
      <div ref={scrollTop} />
      <div className="comments">
        <form className="comment__form" onSubmit={submitComment}>
          <AiFillCloseCircle
            onClick={() => setShowModal(false)}
            className="close-button"
          />
          {liked && liked.length > 0 && (
            <div className="likes">
              {liked.length > 1 ? (
                <div className="likes__count">
                  {` ${liked.length} people liked this post`}
                </div>
              ) : (
                <div className="likes__count">
                  {`${liked.length} person liked this post`}
                </div>
              )}
            </div>
          )}

          <textarea
            autoFocus={true}
            value={comment}
            placeholder="Enter comment here..."
            onChange={(e) => setComment(e.target.value)}
            className="comment__input"
          />
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            disabled={!(comment.length > 0) || isLoading}
          >
            Submit
          </Button>
         
        </form>
        <ul className="comment__list">
          {post &&
            post.comments?.reverse().map((commentId, index) => (
              <Comment
                key={commentId}
                commentId={commentId}
                postId={post.id}
                scrollTop={scrollTop}
                setComment={setComment}
                setCommentId={setCommentId}
                currentUserId={currentUser.uid}
              />
            ))}
        </ul>
      </div>
    </React.Fragment>
  );
}

Comments.propTypes = {
  commentList: PropTypes.array,
  setShowModal: PropTypes.func,
  currentUser: PropTypes.object,
  addCommentToPost: PropTypes.func,
  postId: PropTypes.string,
  editCommentToPost: PropTypes.func,
};

export default Comments;
