import { createContext, useContext, useReducer, useEffect } from 'react'
import * as db from '../lib/db'

const AppContext = createContext(null)

// Empty state — each user starts with zero data
const emptyState = (userId) => ({
  transactions: [], investments: [], dreams: [],
  xp: 0, user: null, session: null,
  notifications: [
    {id:1,t:'tip',e:'🌳',tx:'Bem-vindo ao Munguba Finance! Comece adicionando sua primeira transação.',tm:'Agora',r:false},
    {id:2,t:'tip',e:'💡',tx:'Dica: registre todas as receitas e despesas para ter controle total.',tm:'Agora',r:false},
    {id:3,t:'inv',e:'📈',tx:'Configure seu primeiro objetivo financeiro na aba Sonhos.',tm:'Agora',r:false},
  ],
  loading: true
})

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION': return { ...state, session: action.payload, loading: false }
    case 'SET_USER': return { ...state, user: action.payload }
    case 'SET_DATA': return { ...state, ...action.payload, loading: false }
    case 'ADD_TRANSACTION': return { ...state, transactions: [action.payload, ...state.transactions], xp: state.xp + 20 }
    case 'ADD_INVESTMENT': return { ...state, investments: [action.payload, ...state.investments], xp: state.xp + 30 }
    case 'ADD_DREAM': return { ...state, dreams: [action.payload, ...state.dreams], xp: state.xp + 50 }
    case 'UPDATE_DREAM': return { ...state, dreams: state.dreams.map(d => d.id === action.payload.id ? action.payload : d) }
    case 'READ_NOTIF': return { ...state, notifications: state.notifications.map((n,i) => i===action.idx ? {...n,r:true} : n) }
    case 'READ_ALL_NOTIFS': return { ...state, notifications: state.notifications.map(n => ({...n,r:true})) }
    case 'LOGOUT': return { ...emptyState(), loading: false }
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, emptyState())

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
      const [txns, invs, drms, profile] = await Promise.all([
        db.fetchTransactions(user.id).catch(() => []),
        db.fetchInvestments(user.id).catch(() => []),
        db.fetchDreams(user.id).catch(() => []),
        db.fetchProfile(user.id).catch(() => null),
      ])
      dispatch({
        type: 'SET_DATA',
        payload: {
          transactions: txns || [],
          investments: invs || [],
          dreams: drms || [],
          xp: profile?.xp || 0,
          user: {
            ...user,
            name: profile?.name || user.user_metadata?.name || user.email.split('@')[0]
          }
        }
      })
    } catch (e) {
      console.warn('Erro ao carregar dados:', e.message)
      dispatch({ type: 'SET_DATA', payload: { transactions:[], investments:[], dreams:[], xp:0, user } })
    }
  }

  const addTransaction = async (tx) => {
    try {
      if (state.session?.user) {
        const saved = await db.insertTransaction(state.session.user.id, tx)
        dispatch({ type: 'ADD_TRANSACTION', payload: saved })
      }
    } catch (e) {
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...tx, id: Date.now() } })
    }
  }

  const addInvestment = async (inv) => {
    try {
      if (state.session?.user) {
        const saved = await db.insertInvestment(state.session.user.id, inv)
        dispatch({ type: 'ADD_INVESTMENT', payload: saved })
      }
    } catch (e) {
      dispatch({ type: 'ADD_INVESTMENT', payload: { ...inv, id: Date.now() } })
    }
  }

  const addDream = async (dream) => {
    try {
      if (state.session?.user) {
        const saved = await db.insertDream(state.session.user.id, dream)
        dispatch({ type: 'ADD_DREAM', payload: saved })
      }
    } catch (e) {
      dispatch({ type: 'ADD_DREAM', payload: { ...dream, id: Date.now() } })
    }
  }

  const depositDream = async (dreamId, newCurrent) => {
    try {
      if (state.session?.user) {
        const saved = await db.updateDreamDeposit(dreamId, newCurrent)
        dispatch({ type: 'UPDATE_DREAM', payload: saved })
      }
    } catch (e) {
      dispatch({ type: 'UPDATE_DREAM', payload: { id: dreamId, current: newCurrent } })
    }
  }

  const logout = async () => {
    await db.signOut()
    dispatch({ type: 'LOGOUT' })
  }

  const calcStats = () => {
    const inc = state.transactions.filter(t=>t.type==='income').reduce((a,t)=>a+Number(t.val||0),0)
    const exp = state.transactions.filter(t=>t.type!=='income').reduce((a,t)=>a+Number(t.val||0),0)
    const bal = inc - exp
    const sav = inc > 0 ? Math.round((Math.max(0,bal)/inc)*100) : 0
    return { inc, exp, bal, sav }
  }

  return (
    <AppContext.Provider value={{ state, dispatch, calcStats, addTransaction, addInvestment, addDream, depositDream, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
