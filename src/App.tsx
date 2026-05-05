/**
 * App.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Root component. Owns shared state (selected repo + agent execution)
 * and wires the three panels together. Kept small on purpose —
 * each panel manages its own local concerns.
 */

import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appTheme, overlay } from "./theme/theme";
import { AppLayout } from "./components/Layout/AppLayout";
import { RepositoryList } from "./components/RepositoryList/RepositoryList";
import { RepositoryOverview } from "./components/RepositoryOverview/RepositoryOverview";
import { AgentExecutionPanel } from "./components/AgentExecution/AgentExecutionPanel";
import type { Repository, AgentTaskType } from "./types";
import { useAgentExecution } from "./hooks/useAgentExecution";
import { Typography, Box } from "@mui/material";
import { SmartToyOutlined as SmartToyOutlinedIcon } from "@mui/icons-material";

function App() {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const { execution, runTask, retry } = useAgentExecution();

  const handleRunTask = (taskType: AgentTaskType) => {
    if (selectedRepo) runTask(taskType, selectedRepo);
  };

  // Placeholder shown in the center/right before a repo is picked
  const EmptyState = (
    <Box className="flex flex-col items-center justify-center h-full gap-3">
      <SmartToyOutlinedIcon sx={{ fontSize: 56, color: overlay.ghost }} />
      <Typography variant="body1" color="text.secondary" align="center">
        Select a repository from the left panel
        <br />
        to view insights and run agent tasks.
      </Typography>
    </Box>
  );

  return (
    <ThemeProvider theme={appTheme}>
     <CssBaseline />
      <AppLayout
        isRepoSelected={!!selectedRepo}
        left={
          <RepositoryList
            selectedRepo={selectedRepo}
            onRepoSelect={setSelectedRepo}
          />
        }
        center={
          selectedRepo ? (
            <RepositoryOverview repo={selectedRepo} onRunTask={handleRunTask} />
          ) : (
            EmptyState
          )
        }
        right={
          <AgentExecutionPanel execution={execution} onRetry={retry} />
        }
      />
    </ThemeProvider>
  );
}

export default App;
