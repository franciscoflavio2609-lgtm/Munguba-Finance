import { supabase } from './supabase'

/* ── AUTH ── */
export async function signUp({ name, email, phone, password }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name, phone } }
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session))
}

/* ── TRANSACTIONS ── */
export async function fetchTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function insertTransaction(userId, tx) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...tx, user_id: userId }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

/* ── INVESTMENTS ── */
export async function fetchInvestments(userId) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertInvestment(userId, inv) {
  const { data, error } = await supabase
    .from('investments')
    .insert([{ ...inv, user_id: userId }])
    .select()
    .single()
  if (error) throw error
  return data
}

/* ── DREAMS ── */
export async function fetchDreams(userId) {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertDream(userId, dream) {
  const { data, error } = await supabase
    .from('dreams')
    .insert([{ ...dream, user_id: userId }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDreamDeposit(id, current) {
  const { data, error } = await supabase
    .from('dreams')
    .update({ current })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ── PROFILE ── */
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertProfile(userId, profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile })
    .select()
    .single()
  if (error) throw error
  return data
}
