import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import CounsellorDashboard from "./pages/CounsellorDashboard";  
import ExploreColleges from "./pages/ExploreColleges";
import CareerRoadmapPage from "./pages/CareerRoadmapPage"; 
import BookAppointment from "./pages/BookApointment";
import ConsultCounsellor from "./pages/ConsultCounsellor";

function App() {
  const [user, setUser] = useState(null); // shared user state

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing setUser={setUser} />} />
        <Route path="/student-dashboard" element={<StudentDashboard user={user} />} />
        <Route path="/explore-colleges" element={<ExploreColleges />} />
        <Route path="/counselor-dashboard" element={<CounsellorDashboard user={user} />} />
          <Route path="/career-roadmap" element={<CareerRoadmapPage user={user} />} />
<Route path="/consult-counsellor" element={<ConsultCounsellor user={user} />} />
<Route path="/book-appointment/:counsellorId" element={<BookAppointment user={user} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
