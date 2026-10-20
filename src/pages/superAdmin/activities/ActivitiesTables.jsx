import { Link } from "@mui/material";
import { lazy, Suspense } from "react";
const ResponseModal = lazy(() => import("./modals/ResponseModal"))

export const callColumns = [
  {
    name: "Call ID",
    key: "activity_id",
  },

  {
    name: "Subject",
    key: "subject",
  },

  {
    name: "Scheduled Time",
    key: "scheduled_time",
  },

  {
    name: "About Call",
    key: "summary",
  },
  {
    name: "Created by",
    key: "created_by",
  },
  {
    name: "Assigned to",
    key: "assigned_to",
    renderFunction: (row) => Array.isArray(row.assigned_to) && row.assigned_to.length > 0
      ? row.assigned_to.map((name) => name.name).join(",") : "-",
  },

  {
    name: " Status",
    key: "is_closed",
    renderFunction: (row) => row?.is_closed ? "Closed" : "Active"
  },

  {
    name: "Response",
    key: "response",
    renderFunction: (row) => (
      row?.is_closed ? (
        <Suspense fallback={null}>
          <ResponseModal row={row} />
        </Suspense>
      ) : (
        "-"
      )
    )
  }

];

export const meetingColumns = [
  {
    name: "Meet ID",
    key: "activity_id",
  },

  {
    name: "Subject",
    key: "subject",
  },

  {
    name: "Scheduled Time",
    key: "scheduled_time",
    // renderFunction:()
  },

  {
    name: "About Meeting",
    key: "summary",
  },
  {
    name: "Created by",
    key: "created_by",
  },
  {
    name: "Assigned to",
    key: "assigned_to",
    renderFunction: (row) => Array.isArray(row.assigned_to) && row.assigned_to.length > 0
      ? row.assigned_to.map((name) => name.name).join(",") : "-",
  },
  {
    name: "Activity Link",
    key: "activity_link",
    renderFunction: (row) => row?.activity_link ? (
      <Link href={row.activity_link} target="_blank" rel="noopener noreferrer" sx={{ fontSize: "14px" }}>
        {row.activity_link}
      </Link>
    ) : ("-")
  },
  {
    name: " Status",
    key: "is_closed",
    renderFunction: (row) => row?.is_closed ? "Closed" : "Active"
  },

  {
    name: "Response",
    key: "response",
    renderFunction: (row) => (
      row?.is_closed ? (
        <Suspense fallback={null}>
          <ResponseModal row={row} />
        </Suspense>
      ) : (
        "-"
      )
    )
  }
];

export const emailColumns = [
  {
    name: "Email ID",
    key: "activity_id",
  },

  {
    name: "Email",
    key: "to_email",
    renderFunction: (row) => {
      let emails = [];
      try {
        emails = JSON.parse(row.to_email.replace(/'/g, '"'));
      } catch (e) {
        emails = [];
      }
      return emails.length > 0 ? (
        <span style={{ textTransform: "none" }}>
          {emails.map(e => e.toLowerCase()).join(", ")}
        </span>
      ) : (
        "-"
      );
    }
  },


  {
    name: "Subject",
    key: "subject",
  },

  {
    name: "Scheduled Time",
    key: "scheduled_time",
  },

  {
    name: "About Email",
    key: "summary",
  },
  {
    name: "Created by",
    key: "created_by",
  },
  {
    name: "Assigned to",
    key: "assigned_to",
    renderFunction: (row) => Array.isArray(row.assigned_to) && row.assigned_to.length > 0
      ? row.assigned_to.map((name) => name.name).join(",") : "-",
  },

  {
    name: " Status",
    key: "is_closed",
    renderFunction: (row) => row?.is_closed ? "Closed" : "Active"
  },

  {
    name: "Response",
    key: "response",
    renderFunction: (row) => (
      row?.is_closed ? (
        <Suspense fallback={null}>
          <ResponseModal row={row} />
        </Suspense>
      ) : (
        "-"
      )
    )
  }
];

export const remainderColumns = [
  {
    name: "Reminder ID",
    key: "activity_id",
  },

  {
    name: "Subject",
    key: "subject",
  },

  {
    name: "Scheduled Time",
    key: "scheduled_time",
  },

  {
    name: "About Reminder",
    key: "summary",
  },
  {
    name: "Created by",
    key: "created_by",
  },
  {
    name: "Assigned to",
    key: "assigned_to",
    renderFunction: (row) => Array.isArray(row.assigned_to) && row.assigned_to.length > 0
      ? row.assigned_to.map((name) => name.name).join(",") : "-",
  },

  {
    name: " Status",
    key: "is_closed",
    renderFunction: (row) => row?.is_closed ? "Closed" : "Active"
  },


  {
    name: "Response",
    key: "response",
    renderFunction: (row) => (
      row?.is_closed ? (
        <Suspense fallback={null}>
          <ResponseModal row={row} />
        </Suspense>
      ) : (
        "-"
      )
    )
  }


];
