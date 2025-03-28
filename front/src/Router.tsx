import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./views/DashboardView"
import StatsView from "./views/StatsView"
import DeletedView from "./views/LocationsView"
import LoginView from "./views/LoginView"
import AuthLayout from "./layout/AuthLayout"
import HistorialView from "./views/HistoricalView"
import ParcelasEliminadas from "./views/ParcelasEliminadas"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stats" element={<StatsView />} />
          <Route path="/locations" element={<DeletedView />} />
          <Route path="/historial" element={<HistorialView />} />
          <Route path="/deleted" element={<ParcelasEliminadas />} />
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
