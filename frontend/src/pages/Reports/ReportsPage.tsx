import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";

import api from "../../services/api";
import {
  getWeeklyReport,
  type WeeklyReport,
} from "../../services/reportService";
import {
  formatDate,
  getWeekStart,
} from "../../utils/date";

const ReportsPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(
    getWeekStart(new Date()),
  );

  const [report, setReport] =
    useState<WeeklyReport | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);

      try {
        const data = await getWeeklyReport(
          formatDate(selectedWeek),
        );

        setReport(data);
      } catch (error) {
        console.error(
          "Failed to load report:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedWeek]);

  const previousWeek = () => {
    const previous = new Date(selectedWeek);
    previous.setDate(previous.getDate() - 7);
    setSelectedWeek(previous);
  };

  const nextWeek = () => {
    const next = new Date(selectedWeek);
    next.setDate(next.getDate() + 7);
    setSelectedWeek(next);
  };

  const exportCsv = async () => {
    try {
      const response = await api.get(
        "/reports/weekly/export",
        {
          params: {
            week_start: formatDate(
              selectedWeek,
            ),
          },
          responseType: "blob",
        },
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data]),
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `weekly-report-${formatDate(
        selectedWeek,
      )}.csv`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Failed to export report:",
        error,
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            maxWidth: "1000px",
            margin: "40px auto",
            padding: "2rem",
          }}
        >
          <h2>Loading report...</h2>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Navbar />
        <div
          style={{
            maxWidth: "1000px",
            margin: "40px auto",
            padding: "2rem",
          }}
        >
          <h2>Unable to load report.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "2rem",
        }}
      >
        <h1>Weekly Report</h1>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <button onClick={previousWeek}>
            ← Previous Week
          </button>

          <h2>{formatDate(selectedWeek)}</h2>

          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <button onClick={exportCsv}>
              Export CSV
            </button>

            <button onClick={nextWeek}>
              Next Week →
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3>Total Hours</h3>

            <h2>
              {report.summary.total_hours.toFixed(
                2,
              )}{" "}
              h
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3>New Tasks</h3>

            <h2>
              {report.summary.newly_created_tasks}
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3>Completed Tasks</h3>

            <h2>
              {report.summary.completed_tasks}
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3>Overdue Tasks</h3>

            <h2>
              {report.summary.overdue_tasks}
            </h2>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h2>Hours by User</h2>

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th>User</th>
                <th>Hours</th>
              </tr>
            </thead>

            <tbody>
              {report.hours_by_user.map(
                (user) => (
                  <tr
                    key={user.user_id}
                  >
                    <td>
                      {user.username}
                    </td>

                    <td>
                      {user.total_hours.toFixed(
                        2,
                      )}{" "}
                      h
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <h2>Hours by Card</h2>

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Card</th>
                <th>Hours</th>
              </tr>
            </thead>

            <tbody>
              {report.hours_by_card.map(
                (card) => (
                  <tr
                    key={card.card_id}
                  >
                    <td>
                      {
                        card.card_title
                      }
                    </td>

                    <td>
                      {card.total_hours.toFixed(
                        2,
                      )}{" "}
                      h
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;