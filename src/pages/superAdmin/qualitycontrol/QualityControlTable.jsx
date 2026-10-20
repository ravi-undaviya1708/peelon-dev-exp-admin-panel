export const qualityColumns = [
  { key: "quality_id", name: "Quality ID" },
  {
    key: "bar_code",
    name: "Bar code",
    renderFunction: (row) => {
      return (
        <img
          src={row.bar_code}
          alt="Bar code"
          width={100}
          height="50px"
          style={{
            mixBlendMode: "multiply",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      );
    },
  },
  {
    key: "id_assigned",
    name: "ID Assigned",
  },
  {
    key: "box_weight",
    name: "Box Weight",
  },
  {
    key: "liner_thickness",
    name: "Liner Thickness",
  },
  {
    key: "dimensions",
    name: "Dimension",
  },
  {
    key: "seal_quality",
    name: "Seal  Quality",
    renderFunction: (row) => row?.seal_quality?.value,
  },
  {
    key: "print_quality",
    name: "Print Quality",
    renderFunction: (row) => row?.print_quality?.value,
  },
];
