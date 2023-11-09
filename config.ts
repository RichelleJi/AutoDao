export type ConfigType = {
  supabaseUrl: string;
  supabaseKey: string;
  openaiApiKey: string;
};

export const config : ConfigType = {
  supabaseUrl: 'https://xnfzcqhdkpngvwpqkvfr.supabase.co',
  supabaseKey: process.env.SUPABASE_ANON_API_KEY == null ? '' : process.env.SUPABASE_ANON_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY == null ? '' : process.env.OPENAI_API_KEY
};