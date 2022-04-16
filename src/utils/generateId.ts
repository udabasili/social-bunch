import { v4 as uuid } from 'uuid';

export const generateId = () => {
    const unique_id = uuid();
    const id = unique_id.slice(0,8)
    return id
}