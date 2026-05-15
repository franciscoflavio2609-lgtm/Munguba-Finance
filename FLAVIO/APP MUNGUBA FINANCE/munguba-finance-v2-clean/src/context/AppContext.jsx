import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import * as db from '../lib/db'
import { INITIAL_TRANSACTIONS, INITIAL_INVESTMENTS, INITIAL_DREAMS } from '../data/constants'

const AppContext = createContext(null)

const NOTIFS = [
  {id:1,t:'warn',e:'⚠️',tx:'Você gastou 78% do limite de Alimentação este mês.',tm:'Agora',r:false},
  {id:2,t:'tip',e:'💡',tx:'3 compras por impulso detectadas! Use o Verificador de Compra.',tm:'2h atrás',r:false},
  {id:3,t:'win',e:'🏆',tx:'Você poupou mais de 20% da renda este mês!',tm:'Ontem',r:false},
  {id:4,t:'tip',e:'📊',tx:'Gasto com Delivery cresceu 35% vs o mês passado.',tm:'2 dias',r:true},
  {id:5,t:'inv',e:'📈',tx:'Tesouro Selic acima de 13% a.a. Boa hora para reforçar a reserva.',tm:'3 dias',r:true},
]

const initialState = {
  transactions: [], investments: [], dreams: [],
  xp: 0, user: null, session: null,
  notifications: NOTIFS, loading: true
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload, loading: false }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_DATA':
      return { ...state, ...action.payload, loading: false }
    case 'SET_XP':
      return { ...state, xp: action.payload }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions], xp: state.xp + 20 }
    case 'ADD_INVESTMENT':
      return { ...state, investments: [action.payload, ...state.investments], xp: state.xp + 30 }
    case 'ADD_DREAM':
      return { ...state, dreams: [action.payload, ...state.dreams], xp: state.xp + 50 }
    case 'UPDATE_DREAM':
      return { ...state, dreams: state.dreams.map(d => d.id === action.payload.id ? action.payload : d) }
    case 'READ_NOTIF':
      return { ...state, notifications: state.notifications.map((n,i) => i===action.idx ? {...n,r:true} : n) }
    case 'READ_ALL_NOTIFS':
      return { ...state, notifications: state.notifications.map(n => ({...n,r:true})) }
    case 'LOGOUT':
      return { ...initialState, loading: false }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [dbReady, setDbReady] = useState(false)

  // Listen to auth changes
  useEffect(() => {
    const { data: { subscription } } = db.onAuthChange(async (session) => {
      dispatch({ type: 'SET_SESSION', payload: session })
      if (session?.user) {
        await loadUserData(session.user)
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (user) => {
    try {
      dispatch({ type: 'SET_USER', payload: user })
      const [txns, invs, drms, profile] = await Promise.all([
        db.fetchTransactions(user.id).catch(() => INITIAL_TRANSACTIONS),
        db.fetchInvestments(user.id).catch(() => INITIAL_INVESTMENTS),
        db.fetchDreams(user.id).catch(() => INITIAL_DREAMS),
        db.fetchProfile(user.id).catch(() => null),
      ])
      dispatch({
        type: 'SET_DATA',
        payload: {
          transactions: txns?.length ? txns : INITIAL_TRANSACTIONS,
          investments: invs?.length ? invs : INITIAL_INVESTMENTS,
          dreams: drms?.length ? drms : INITIAL_DREAMS,
          xp: profile?.xp || 100,
          user: { ...user, name: profile?.name || user.user_metadata?.name || 'Usuário' }
        }
      })
      setDbReady(true)
    } catch (e) {
      console.warn('Supabase não configurado ainda — usando dados locais', e.message)
      dispatch({
        type: 'SET_DATA',
        payload: {
          transactions: INITIAL_TRANSACTIONS,
          investments: INITIAL_INVESTMENTS,
          dreams: INITIAL_DREAMS,
          xp: 100
        }
      })
      setDbReady(false)
    }
  }

  const addTransaction = async (tx) => {
    try {
      if (state.session?.user && dbReady) {
        const saved = await db.insertTransaction(state.session.user.id, tx)
        dispatch({ type: 'ADD_TRANSACTION', payload: saved })
      } else {
        dispatch({ type: 'ADD_TRANSACTION', payload: { ...tx, id: Date.now() } })
      }
    } catch { dispatch({ type: 'ADD_TRANSACTION', payload: { ...tx, id: Date.now() } }) }
  }

  const addInvestment = async (inv) => {
    try {
      if (state.session?.user && dbReady) {
        const saved = await db.insertInvestment(state.session.user.id, inv)
        dispatch({ type: 'ADD_INVESTMENT', payload: saved })
      } else {
        dispatch({ type: 'ADD_INVESTMENT', payload: { ...inv, id: Date.now() } })
      }
    } catch { dispatch({ type: 'ADD_INVESTMENT', payload: { ...inv, id: Date.now() } }) }
  }

  const addDream = async (dream) => {
    try {
      if (state.session?.user && dbReady) {
        const saved = await db.insertDream(state.session.user.id, dream)
        dispatch({ type: 'ADD_DREAM', payload: saved })
      } else {
        dispatch({ type: 'ADD_DREAM', payload: { ...dream, id: Date.now() } })
      }
    } catch { dispatch({ type: 'ADD_DREAM', payload: { ...dream, id: Date.now() } }) }
  }

  const depositDream = async (dreamId, newCurrent) => {
    try {
      if (state.session?.user && dbReady) {
        const saved = await db.updateDreamDeposit(dreamId, newCurrent)
        dispatch({ type: 'UPDATE_DREAM', payload: saved })
      } else {
        dispatch({ type: 'UPDATE_DREAM', payload: { id: dreamId, current: newCurrent } })
      }
    } catch { dispatch({ type: 'UPDATE_DREAM', payload: { id: dreamId, current: newCurrent } }) }
  }

  const logout = async () => {
    await db.signOut()
    dispatch({ type: 'LOGOUT' })
  }

  const calcStats = () => {
    const inc = state.transactions.filter(t=>t.type==='income').reduce((a,t)=>a+Number(t.val||t.value||0),0)
    const exp = state.transactions.filter(t=>t.type!=='income').reduce((a,t)=>a+Number(t.val||t.value||0),0)
    const bal = inc - exp
    const sav = inc > 0 ? Math.round((Math.max(0,bal)/inc)*100) : 0
    return { inc, exp, bal, sav }
  }

  return (
    <AppContext.Provider value={{
      state, dispatch, calcStats,
      addTransaction, addInvestment, addDream, depositDream, logout, dbReady
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
