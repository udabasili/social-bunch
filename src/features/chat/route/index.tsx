import { Navigate, Route, Routes } from 'react-router-dom';
import { Chat } from './Chat';

export const ChatRoute = () => {
    return (
    <Routes>
        <Route path="/" element={<Chat/>}/>
        <Route path="*" element={<Navigate to="." />} />
    </Routes>
    )
}
