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

// ═══════════════════════════════════════
// MODO FAMÍLIA
// ═══════════════════════════════════════

function gerarCodigoLocal() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export async function criarFamilia(userId, nome, nomeUsuario) {
  const codigo = gerarCodigoLocal()
  const { data: familia, error: errFamilia } = await supabase
    .from('families')
    .insert({ name: nome, invite_code: codigo, created_by: userId })
    .select()
    .single()
  if (errFamilia) throw errFamilia

  const { error: errMembro } = await supabase
    .from('family_members')
    .insert({ family_id: familia.id, user_id: userId, member_name: nomeUsuario })
  if (errMembro) throw errMembro

  return familia
}

export async function entrarNaFamilia(userId, codigo, nomeUsuario) {
  const { data: familia, error: errBusca } = await supabase
    .from('families')
    .select('*')
    .eq('invite_code', codigo.toUpperCase().trim())
    .single()
  if (errBusca || !familia) throw new Error('Código de convite inválido ou expirado.')

  const { error: errMembro } = await supabase
    .from('family_members')
    .insert({ family_id: familia.id, user_id: userId, member_name: nomeUsuario })
  if (errMembro) {
    if (errMembro.code === '23505') throw new Error('Você já faz parte desta família.')
    throw errMembro
  }

  return familia
}

export async function buscarMinhaFamilia(userId) {
  const { data: membro, error: errMembro } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (errMembro || !membro) return null

  const { data: familia, error: errFamilia } = await supabase
    .from('families')
    .select('*')
    .eq('id', membro.family_id)
    .single()
  if (errFamilia) return null

  const { data: membros, error: errMembros } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', membro.family_id)
  if (errMembros) throw errMembros

  return { ...familia, membros: membros || [] }
}

export async function sairDaFamilia(userId, familyId) {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('user_id', userId)
    .eq('family_id', familyId)
  if (error) throw error
}

export async function buscarTransacoesFamilia(familyId, memberIds) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .in('user_id', memberIds)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function criarMetaFamilia(familyId, userId, meta) {
  const { data, error } = await supabase
    .from('family_goals')
    .insert({ family_id: familyId, created_by: userId, ...meta })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function buscarMetasFamilia(familyId) {
  const { data, error } = await supabase
    .from('family_goals')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function atualizarMetaFamilia(id, current) {
  const { data, error } = await supabase
    .from('family_goals')
    .update({ current })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removerMetaFamilia(metaId) {
  const { error } = await supabase
    .from('family_goals')
    .delete()
    .eq('id', metaId)
  if (error) throw error
}
