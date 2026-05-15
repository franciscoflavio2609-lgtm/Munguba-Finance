import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'

import SplashScreen from './components/screens/SplashScreen'
import AuthScreen from './components/screens/AuthScreen'
import Dashboard from './components/screens/Dashboard'
import TransactionsScreen from './components/screens/TransactionsScreen'
import BudgetScreen from './components/screens/BudgetScreen'
import InvestmentScreen from './components/screens/InvestmentScreen'
import DreamsScreen from './components/screens/DreamsScreen'
import EducationScreen from './components/screens/EducationScreen'
import BehaviorScreen from './components/screens/BehaviorScreen'
import ChatScreen from './components/screens/ChatScreen'
import FaqScreen from './components/screens/FaqScreen'
import ReportPanel from './components/screens/ReportPanel'
import MobileMoreScreen from './components/screens/MobileMoreScreen'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import BottomNav from './components/layout/BottomNav'
import AddTransactionModal from './components/ui/AddTransactionModal'
import Toast from './components/ui/Toast'

const isMobile = () => window.innerWidth < 768

const VIEW_LABELS = {
  dash:'Visão Geral', txn:'Extrato', bud:'Orçamentos',
  inv:'Investimentos', drm:'Sonhos', edu:'Educação',
  ecomp:'Psicologia Financeira', chat:'Assistente IA',
  faq:'Tira-Dúvidas', more:'Menu'
}

function AppShell() {
  const { state, logout } = useApp()
  const [screen, setScreen] = useState('splash')
  const [view, setView] = useState('dash')
  const [showAdd, setShowAdd] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [toast, setToast] = useState('')
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handler = () => setMobile(isMobile())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Listen for openAdd event from Dashboard
  useEffect(() => {
    const handler = () => setShowAdd(true)
    window.addEventListener('openAdd', handler)
    return () => window.removeEventListener('openAdd', handler)
  }, [])

  useEffect(() => {
    if (!state.loading) {
      if (state.session) setScreen('app')
      else if (screen === 'app') setScreen('splash')
    }
  }, [state.session, state.loading])

  if (state.loading) return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(150deg,#022818,#044D2C,#076B3E)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ width:20, height:20, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
      <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', fontFamily:'Outfit,sans-serif' }}>Carregando...</div>
    </div>
  )

  if (screen === 'splash') return <SplashScreen onStart={() => setScreen('auth')} />
  if (screen === 'auth')   return <AuthScreen onAuth={() => setScreen('app')} />

  const VIEWS = {
    dash: Dashboard, txn: TransactionsScreen, bud: BudgetScreen,
    inv: InvestmentScreen, drm: DreamsScreen, edu: EducationScreen,
    ecomp: BehaviorScreen, chat: ChatScreen, faq: FaqScreen,
    more: MobileMoreScreen
  }
  const ViewComponent = VIEWS[view] || Dashboard

  // ── MOBILE LAYOUT ──
  if (mobile) {
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#E6F2EC', overflow:'hidden' }}>
        {/* Mobile topbar */}
        <div style={{
          background:'linear-gradient(135deg,#022818,#076B3E)',
          paddingTop:'max(env(safe-area-inset-top, 0px), 44px)',
          paddingBottom:14, paddingLeft:16, paddingRight:16,
          flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between'
        }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:16, fontWeight:800, color:'#fff' }}>
            {VIEW_LABELS[view] || 'Munguba Finance'}
          </div>
          <button onClick={() => setShowReport(true)} style={{
            background:'rgba(255,255,255,.15)', border:'none', borderRadius:10,
            padding:'7px 12px', color:'#fff', fontSize:11, fontWeight:600,
            cursor:'pointer', fontFamily:'Outfit,sans-serif'
          }}>
            📊 Relatório
          </button>
        </div>

        {/* Mobile content */}
        <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 90px', WebkitOverflowScrolling:'touch' }}>
          {view === 'more'
            ? <MobileMoreScreen onNav={setView} onReport={() => setShowReport(true)} onLogout={logout}/>
            : <ViewComponent onNav={setView}/>
          }
        </div>

        {/* Bottom nav */}
        <BottomNav activeView={view} onNav={setView} onAdd={() => setShowAdd(true)}/>

        {showReport && <ReportPanel onClose={() => setShowReport(false)}/>}
        {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} onSaved={msg => setToast(msg)}/>}
        <Toast message={toast} onDone={() => setToast('')}/>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ──
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <Sidebar activeView={view} onNav={setView} onAdd={() => setShowAdd(true)} onReport={() => setShowReport(true)} onLogout={logout}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Topbar activeView={view} onAdd={() => setShowAdd(true)} onReport={() => setShowReport(true)}/>
        <main style={{ flex:1, overflowY:'auto', padding:24, background:'#E6F2EC' }}>
          <ViewComponent onNav={setView}/>
        </main>
      </div>
      {showReport && <ReportPanel onClose={() => setShowReport(false)}/>}
      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} onSaved={msg => setToast(msg)}/>}
      <Toast message={toast} onDone={() => setToast('')}/>
    </div>
  )
}

export default function App() {
  return <AppProvider><AppShell/></AppProvider>
}
