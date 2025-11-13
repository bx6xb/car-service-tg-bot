import { API_URL } from '../config';

export const createImagePath = (path: string): string => `${API_URL}/storage/app/public/${path}`;
