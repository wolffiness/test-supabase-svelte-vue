import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('chat').select().order('created_at', { ascending: true });

	return {
		chat: data ?? []
	};
}
