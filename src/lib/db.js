import { supabase } from './supabase'

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

export async function fetchTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  // normalize: map descricao -> desc for app compatibility
  return (data || []).map(t => ({ ...t, desc: t.descricao }))
}

export async function insertTransaction(userId, tx) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      date: tx.date,
      descricao: tx.desc,
      cat: tx.cat,
      val: tx.val,
      type: tx.type
    }])
    .select()
    .single()
  if (error) throw error
  return { ...data, desc: data.descricao }
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export async function fetchInvestments(userId) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function insertInvestment(userId, inv) {
  const { data, error } = await supabase
    .from('investments')
    .insert([{ user_id: userId, tp: inv.tp, nm: inv.nm, val: inv.val, rt: inv.rt || 0, date: inv.date }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchDreams(userId) {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function insertDream(userId, dream) {
  const { data, error } = await supabase
    .from('dreams')
    .insert([{
      user_id: userId,
      name: dream.name,
      icon: dream.icon,
      target: dream.target,
      current: dream.current || 0,
      why: dream.why,
      banner: dream.banner
    }])
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
