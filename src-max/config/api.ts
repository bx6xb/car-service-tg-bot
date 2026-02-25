import axios from 'axios';
import { API_URL } from './variables';

export const $api = axios.create({
  baseURL: `${API_URL}/api`,
});
