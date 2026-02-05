import axios from 'axios';

const RANDOM_USER_URL = 'https://randomuser.me/api/';

export const fetchRandomUsers = async (results = 10) => {
  try {
    const response = await axios.get(RANDOM_USER_URL, {
      params: { results },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching random users:', error);
    throw error;
  }
};