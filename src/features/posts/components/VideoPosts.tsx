import React, { useState } from "react";
import { AiFillLike, AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import { PostAttribute, PostLikedBy } from "../types";
import { useAuth } from "@/lib/auth";
import { useDeletePost } from "../api/deletePost";
import { useLikePost } from "../api/likePost";
import Comments from "@/features/comment/component/Comments";
import { timeAgo } from "@/utils/time";
import Modal from "@/components/Modal/Modal";
import AddPost from "./AddPost";
import ReactPlayer from "react-player";
import noImage from "@/assets/images/no-image.png";

interface Props {
  post: PostAttribute;
  show?: boolean;
  commentModal?: boolean;
}

function VideoPost({ post, commentModal = true, show = false }: Props) {
  const [showModal, setShowModal] = useState(show);
  const [editPost, setEditPost] = useState(false);
  const [editType, setEditType] = useState("");
  const [editData, setEditData] = useState<PostAttribute>();
  const { currentUser } = useAuth();
  const { likePost } = useLikePost(post.id);
  const { deletePostFn } = useDeletePost(post.id);

  const editPostHandler = (post: PostAttribute, type: string) => {
    setEditType(`${type}-tab`);
    setEditPost(true);
    setEditData(post);
  };

  const prefix = (value: number, type: string) => {
    if (value > 1) {
      return `${value} ${type}s`;
    } else {
      return `${value} ${type}`;
    }
  };

  const addLike = () => {
    const likedBy = {
      uid: currentUser.uid,
      username: currentUser.username,
      image: currentUser.image as string,
    };
    const postOwner = post.user.uid;
    likePost({ postOwner, likedBy });
  };

  const postLikedByCurrentUser = (array: Array<PostLikedBy>) => {
    return (
      array.filter((value) => {
        return value.uid === currentUser.uid;
      }).length > 0
    );
  };

  const commentComponent = () => {
    if (commentModal) {
      return (
        <Modal>
          <Comments
            post={post}
            liked={post.likes}
            owner={post.user.uid}
            commentList={post.comments}
            setShowModal={setShowModal}
          />
        </Modal>
      );
    } else {
      return (
        <Comments
          post={post}
          liked={post.likes}
          owner={post.user.uid}
          commentList={post.comments}
          setShowModal={setShowModal}
        />
      );
    }
  };

  return (
    <React.Fragment>
      {editPost && (
        <Modal>
          <AddPost
            editData={editData}
            editPost={editPost}
            editType={editType}
            closeModal={() => setEditPost(false)}
          />
        </Modal>
      )}
      <div className="post post--image" id={post.id}>
        <div
          className={`
                        avatar
                        ${post.user.image ? "" : "no-image"}
                    `}
        >
          {post.user.image && (
            <img
              src={
                post.user.image ||
                "https://img.icons8.com/ios/50/000000/user-male-circle.png"
              }
              alt={post.user.username}
            />
          )}
        </div>
        <div className="user-info">
          <span
            className={`
                        username
                        ${post.user.username ? "" : "no-username"}
                    `}
          >
            {post.user.username ? post.user.username : ""}
          </span>
          <span className="date">{timeAgo(post.createdAt)}</span>
        </div>
        <div className="u-margin-bottom-small u-margin-top-small" id="title">
          <h3 className="tertiary-header">{post.video.title}</h3>
        </div>
        <div className="video">
          {post.video.link && (
            <ReactPlayer width="100%" height="100%" url={post.video.link} />
          )}
        </div>
        <div className="post__options">
          <div className="post__status">
            <div className="likes">
              {post.likes !== undefined &&
                post.likes.length > 0 &&
                prefix(post.likes.length, " Like")}
            </div>
            <div className="comments" onClick={() => setShowModal(true)}>
              {post.comments !== undefined &&
                post.comments.length > 0 &&
                `${prefix(post.comments.length, "Comment")} `}
            </div>
          </div>
          {currentUser.username === post.user.username && (
            <div className="post__edit">
              <div
                className="edit"
                onClick={() => {
                  editPostHandler(post, post.type);
                }}
              >
                Edit
              </div>
              <div
                className="delete"
                onClick={() => {
                  deletePostFn();
                }}
              >
                Delete
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="response">
          {!postLikedByCurrentUser(post.likes) ? (
            <div
              className="response__item"
              style={{ color: "red", cursor: "pointer" }}
              onClick={addLike}
              title="like"
            >
              <AiOutlineLike className="response__icon" />
            </div>
          ) : (
            <div
              className="response__item liked"
              style={{ color: "red" }}
              title="liked"
            >
              <AiFillLike className="response__icon" />
              <p className="response__label">Liked</p>
            </div>
          )}
          <div className="response__item" onClick={() => setShowModal(true)}>
            <AiOutlineComment className="response__icon" />
          </div>
        </div>
        <hr />
        <div className="comment">
          <div className="comment__input-container">
            {
              <div className="avatar">
                <img
                  src={currentUser.image ? currentUser.image : noImage}
                  alt={currentUser.username}
                />
              </div>
            }
            <input
              className="comment__input"
              onClick={() => setShowModal(true)}
              type="text"
              placeholder="Add Comment"
            />
          </div>
          {showModal && commentComponent()}
        </div>
      </div>
    </React.Fragment>
  );
}

export default VideoPost;
