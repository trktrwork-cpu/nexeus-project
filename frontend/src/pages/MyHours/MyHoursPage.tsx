import { useEffect, useMemo, useState } from "react";

import {
  formatDate,
  getWeekStart,
} from "../../utils/date";
import { getWeeklyWorklogs } from "../../services/worklogService";
import type { Worklog } from "../../services/worklogService";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MyHoursPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(
    getWeekStart(new Date()),
  );

  const [worklogs, setWorklogs] = useState<Worklog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorklogs = async () => {
      setLoading(true);

      try {
        const data = await getWeeklyWorklogs(
          formatDate(selectedWeek),
        );

        setWorklogs(data);
      } catch (error) {
        console.error("Failed to load worklogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorklogs();
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

  const dailyTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    weekDays.forEach((day) => {
      totals[day] = 0;
    });

    worklogs.forEach((worklog) => {
      const date = new Date(worklog.work_date);

      const index = date.getDay();

      const dayName =
        index === 0
          ? "Sunday"
          : weekDays[index - 1];

      totals[dayName] += Number(worklog.hours);
    });

    return totals;
  }, [worklogs]);

  const weeklyTotal = useMemo(() => {
    return worklogs.reduce(
      (total, worklog) =>
        total + Number(worklog.hours),
      0,
    );
  }, [worklogs]);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "2rem",
      }}
    >
      <h1>My Hours</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <button onClick={previousWeek}>
          ← Previous Week
        </button>

        <h2>{formatDate(selectedWeek)}</h2>

        <button onClick={nextWeek}>
          Next Week →
        </button>
      </div>

      <div
        style={{
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h3>Daily Totals</h3>

        <table
          style={{
            width: "100%",
          }}
        >
          <tbody>
            {weekDays.map((day) => (
              <tr key={day}>
                <td>{day}</td>

                <td
                  style={{
                    textAlign: "right",
                  }}
                >
                  {dailyTotals[day].toFixed(2)} h
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        <h3>
          Weekly Total: {weeklyTotal.toFixed(2)} h
        </h3>
      </div>

      {loading ? (
        <h2>Loading worklogs...</h2>
      ) : worklogs.length === 0 ? (
        <div
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h2>No worklogs for this week</h2>

          <p>
            Log time on your cards to see it
            here.
          </p>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Card ID</th>
              <th>Hours</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {worklogs.map((worklog) => (
              <tr key={worklog.id}>
                <td>{worklog.work_date}</td>

                <td>{worklog.card_id}</td>

                <td>{worklog.hours}</td>

                <td>
                  {worklog.notes ??
                    "No notes"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default MyHoursPage;