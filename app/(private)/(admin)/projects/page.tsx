import Page from "@/components/base/Page"
import ProjectsTable from "./ProjectsTable"



function ProjectsPage() {
  return (
    <Page
      navURL="Dashboard"
      title="Projects"
      description="Overview of project progress, client assets, and setup status."
    >
      <ProjectsTable />
    </Page>
  )
}

export default ProjectsPage
