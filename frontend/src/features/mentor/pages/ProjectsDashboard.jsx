import { useNavigate } from "react-router-dom";
import StatisticsCard from "../components/StatisticsCard";
import ProjectProgressOverview from "../components/ProjectProgressOverview";
import RecentActivityFeed from "../components/RecentActivityFeed";
import FilterBar from "../components/FilterBar";
import ProjectCard from "../components/ProjectCard";
import UpcomingDeadlinesTimeline from "../components/UpcomingDeadlinesTimeline";
import MentorResourcesSection from "../components/MentorResourcesSection";

export default function ProjectsDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f9f9ff] p-6 space-y-8">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-[#141b2b]">
            Projects
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and track all mentorship project initiatives.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            className="
              px-5
              py-2.5
              rounded-xl
              border
              bg-white
              hover:bg-gray-50
              transition
            "
          >
            Export Data
          </button>

          <button
  onClick={() => navigate("/mentor/projects/create")}
  className="
    px-5
    py-2.5
    rounded-xl
    bg-[#004ac6]
    text-white
    hover:bg-blue-700
    transition
  "
>
  + New Project
</button>

        </div>

      </div>

      {/* ================= STATISTICS ================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

        <StatisticsCard
          type="total"
          title="TOTAL PROJECTS"
          value="24"
          trend="+4"
          trendColor="text-green-600"
        />

        <StatisticsCard
          type="active"
          title="ACTIVE"
          value="14"
          trend="58%"
          trendColor="text-gray-600"
        />

        <StatisticsCard
          type="completed"
          title="COMPLETED"
          value="8"
          trend="+18%"
          trendColor="text-green-600"
        />

        <StatisticsCard
          type="risk"
          title="AT RISK"
          value="2"
          trend="-30%"
          trendColor="text-red-600"
        />

        <StatisticsCard
          type="progress"
          title="AVG PROGRESS"
          value="78%"
          trend="+6%"
          trendColor="text-green-600"
        />

      </section>

      {/* ================= OVERVIEW + ACTIVITY ================= */}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">
          <ProjectProgressOverview />
        </div>

        <RecentActivityFeed />

      </section>

      {/* ================= FILTER ================= */}

      <FilterBar />

      {/* ================= PROJECTS + SIDEBAR ================= */}

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT SIDE */}

        <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">

          <ProjectCard
  title="Course LMS"
  status="active"
  progress={82}
  students={18}
  tasks={26}
  deadline="12 Aug"
  avatars={[
    "https://i.pravatar.cc/100?img=1",
    "https://i.pravatar.cc/100?img=2",
  ]}
/>

<ProjectCard
  title="HR Management System"
  status="risk"
  progress={45}
  students={12}
  tasks={20}
  deadline="Tomorrow"
  avatars={[
    "https://i.pravatar.cc/100?img=15",
    "https://i.pravatar.cc/100?img=18",
  ]}
  showIssuesButton
  
/>

        </div>

        {/* RIGHT SIDE */}

        <div className="xl:col-span-3 space-y-6">

          <UpcomingDeadlinesTimeline />

          
          <MentorResourcesSection />
          

        </div>

      </section>

    </div>
  );
}