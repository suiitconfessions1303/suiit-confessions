import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import api from "../../api";
import theme, { colors, pageBackground } from "./theme";
import { computeStats } from "./utils";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StatsStrip from "./components/StatsStrip";
import Toolbar from "./components/Toolbar";
import ConfessionList from "./components/ConfessionList";
import ConfessionDetail from "./components/ConfessionDetail";
import DeleteDialog from "./components/DeleteDialog";
import EmptyState from "./components/EmptyState";

function Dashboard() {
  const navigate = useNavigate();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [queuedDeleteId, setQueuedDeleteId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [sort, setSort] = useState("newest");

  const load = useCallback(async () => {
    const res = await api.get("/admin/confessions");
    setConfessions(res.data.confessions || []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
      .catch((err) => setError(err.response?.data?.message || "Unable to load confessions."))
      .finally(() => setLoading(false));
  }, [load]);

  function handleRefresh() {
    setLoading(true);
    setError("");
    load()
      .catch((err) => setError(err.response?.data?.message || "Unable to refresh confessions."))
      .finally(() => setLoading(false));
  }

  async function confirmDelete() {
    const id = pendingDeleteId;
    if (!id) return;
    setPendingDeleteId("");
    setBusyId(id);
    setError("");
    try {
      await api.delete(`/admin/confessions/${id}`);
      setConfessions((cur) => cur.filter((c) => c._id !== id));
      setSelectedId((cur) => (cur === id ? "" : cur));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete confession.");
    } finally {
      setBusyId("");
    }
  }

  async function handleLogout() {
    try {
      await api.post("/admin/logout");
    } finally {
      setConfessions([]);
      navigate("/admin", { replace: true });
    }
  }

  const stats = useMemo(() => computeStats(confessions), [confessions]);

  const visible = useMemo(() => {
    return [...confessions].sort((a, b) => {
      const diff = new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0);
      return sort === "newest" ? -diff : diff;
    });
  }, [confessions, sort]);

  const selected = visible.find((c) => c._id === selectedId);

  function handleSelect(id) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedId(id);
  }

  function handleDeleteRequest(id) {
    setQueuedDeleteId(id);
    setSelectedId("");
  }

  function handleDetailsExited() {
    if (!queuedDeleteId) return;
    setPendingDeleteId(queuedDeleteId);
    setQueuedDeleteId("");
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: pageBackground }}>
      <Sidebar onLogout={handleLogout} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <TopBar onLogout={handleLogout} />

        <Box component="main" sx={{ p: { xs: 2, sm: 3, lg: 5 }, maxWidth: 1280, mx: "auto" }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
            >
              <Box>
                <Typography variant="h1" component="h1">
                  Confession inbox
                </Typography>
                <Typography sx={{ mt: 0.75, color: "#b5adbf", fontSize: "14px" }}>
                  Read and manage student submissions privately.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleRefresh}
                disabled={loading}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Refresh
              </Button>
            </Stack>

            <StatsStrip stats={stats} />

            <Toolbar sort={sort} onSort={setSort} />

            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{
                  border: `1px solid ${colors.dangerLine}`,
                  backgroundColor: colors.dangerBg,
                  color: colors.danger,
                  borderRadius: "12px",
                  "& .MuiAlert-icon": { color: colors.danger },
                }}
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <EmptyState
                loading
                title="Loading confessions..."
                text="Checking for new student submissions."
              />
            ) : confessions.length === 0 ? (
              <EmptyState title="No confessions yet" text="New submissions will appear here." />
            ) : (
              <ConfessionList
                items={visible}
                onSelect={handleSelect}
              />
            )}
          </Stack>
        </Box>
      </Box>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelectedId("")}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          transition: {
            onExited: handleDetailsExited,
          },
          paper: {
            sx: {
              maxHeight: "calc(100vh - 32px)",
              overflow: "hidden",
            },
          },
        }}
      >
        {selected && (
          <DialogContent
            sx={{
              p: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ConfessionDetail
              item={selected}
              busy={busyId === selected._id}
              onDelete={handleDeleteRequest}
              onClose={() => setSelectedId("")}
            />
          </DialogContent>
        )}
      </Dialog>

      <DeleteDialog
        open={Boolean(pendingDeleteId)}
        onCancel={() => setPendingDeleteId("")}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}

export default function AdminDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
}
