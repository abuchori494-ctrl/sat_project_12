const pastExamsData = [
  {
    id: "march-2026",
    month: "March",
    year: 2026,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }]
      }
    ]
  },
  {
    id: "december-2025",
    month: "December",
    year: 2025,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }, { name: "Int-D", id: "int-d" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }, { name: "US-C", id: "us-c" }]
      }
    ]
  },
  {
    id: "november-2025",
    month: "November",
    year: 2025,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }]
      }
    ]
  },
  {
    id: "october-2025",
    month: "October",
    year: 2025,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }]
      }
    ]
  },
  {
    id: "september-2025",
    month: "September",
    year: 2025,
    regions: [
      {
        name: "Global",
        versions: [{ name: "Exam A", id: "exam-a" }, { name: "Exam B", id: "exam-b" }]
      }
    ]
  },
  {
    id: "august-2025",
    month: "August",
    year: 2025,
    regions: [
      {
        name: "Global",
        versions: [{ name: "Exam A", id: "exam-a" }, { name: "Exam B", id: "exam-b" }, { name: "Exam C", id: "exam-c" }, { name: "Exam D", id: "exam-d" }, { name: "Exam E", id: "exam-e" }]
      }
    ]
  },
  {
    id: "june-2025",
    month: "June",
    year: 2025,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }, { name: "US-C", id: "us-c" }]
      }
    ]
  },
  {
    id: "may-2025",
    month: "May",
    year: 2025,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }]
      }
    ]
  },
  {
    id: "march-2025",
    month: "March",
    year: 2025,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }, { name: "Int-D", id: "int-d" }, { name: "Int-E", id: "int-e" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }, { name: "US-C", id: "us-c" }]
      }
    ]
  },
  {
    id: "december-2024",
    month: "December",
    year: 2024,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }, { name: "Int-D", id: "int-d" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }, { name: "US-C", id: "us-c" }]
      }
    ]
  },
  {
    id: "november-2024",
    month: "November",
    year: 2024,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }, { name: "Int-D", id: "int-d" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }]
      }
    ]
  },
  {
    id: "october-2024",
    month: "October",
    year: 2024,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }, { name: "Int-C", id: "int-c" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }, { name: "US-C", id: "us-c" }]
      }
    ]
  },
  {
    id: "august-2024",
    month: "August",
    year: 2024,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }, { name: "US-C", id: "us-c" }, { name: "US-D", id: "us-d" }, { name: "US-E", id: "us-e" }]
      }
    ]
  },
  {
    id: "june-2024",
    month: "June",
    year: 2024,
    regions: [
      {
        name: "Global",
        versions: [{ name: "Exam A", id: "exam-a" }, { name: "Exam B", id: "exam-b" }, { name: "Exam C", id: "exam-c" }, { name: "Exam D", id: "exam-d" }, { name: "Exam E", id: "exam-e" }]
      }
    ]
  },
  {
    id: "may-2024",
    month: "May",
    year: 2024,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }]
      }
    ]
  },
  {
    id: "march-2024",
    month: "March",
    year: 2024,
    regions: [
      {
        name: "International",
        versions: [{ name: "Int-A", id: "int-a" }, { name: "Int-B", id: "int-b" }]
      },
      {
        name: "US",
        versions: [{ name: "US-A", id: "us-a" }, { name: "US-B", id: "us-b" }]
      }
    ]
  }
];
