import { log } from "console";

const API_BASE_URL = 'http://localhost:5000';

// Upload API
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.url;
};

// Card API
export interface CardLoveData {
  person_one: string;
  img_person_one: string;
  person_two: string;
  img_person_two: string;
  start_date: string;
  url_youtube: string;
  message?: string;
}

export const createCard = async (cardData: CardLoveData) => {

    console.log({cardData});

  const response = await fetch(`${API_BASE_URL}/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cardData),
  });

  if (!response.ok) {
    throw new Error('Failed to create card');
  }

  return response.json();
};

export const getCards = async (page = 1, limit = 20, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { q: search }),
  });

  const response = await fetch(`${API_BASE_URL}/card?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }

  return response.json();
};

export const getCardById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/card/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch card');
  }

  return response.json();
};

export const updateCard = async (id: string, cardData: Partial<CardLoveData>) => {
  const response = await fetch(`${API_BASE_URL}/card/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cardData),
  });

  if (!response.ok) {
    throw new Error('Failed to update card');
  }

  return response.json();
};

export const deleteCard = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/card/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete card');
  }

  return response.ok;
};
