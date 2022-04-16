import { BaseEntity } from '@/types';

export type PostAttribute = {
    text?: string;
    currentImages?: Array<string>;
    title?: string;
    link?: string
    video: {
        title: null,
        link: null
    },
    image?: {
        title: string;
        images: Array<string>;
    }
    user: {
        uid: string;
        username: string;
        image: string;
    },
    type: string
    likes: Array<{
        uid: string;
        username: string;
        image: string}>,
    comments: Array<string>
    createdAt: {seconds: number}
    updatedAt: {seconds: number}
} & BaseEntity

export type PostDTO = {
    text?: string;
    currentImages?: Array<string>;
    title?: string;
    link?: string
} 

export type PostLikedBy = {
    uid: string;
    username: string;
    image: string;
}
