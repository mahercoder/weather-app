import { supabase } from '../lib/supabase';
import { SearchHistoryItem } from '../types/weather';

export const addToSearchHistory = async (location: string): Promise<void> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;

    const { error } = await supabase
      .from('search_history')
      .insert({
        location: location,
        user_id: userId
      });

    if (error) throw error;

  } catch (error) {
    console.error('Error adding to search history:', error);
    throw error;
  }
};

export const getSearchHistory = async (limit = 5): Promise<SearchHistoryItem[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;

    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data as SearchHistoryItem[];
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
};