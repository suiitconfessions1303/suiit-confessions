import { Box } from "@mui/material";
import ConfessionListItem from "./ConfessionListItem";

export default function ConfessionList({ items, onSelect }) {
  return (
    <Box
      component="ul"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
        gridAutoRows: "1fr",
        gap: 2,
        listStyle: "none",
        m: 0,
        p: 0,
      }}
    >
      {items.map((item, index) => (
        <Box component="li" key={item._id} sx={{ display: "flex", minWidth: 0 }}>
          <ConfessionListItem
            item={item}
            number={items.length - index}
            onSelect={onSelect}
          />
        </Box>
      ))}
    </Box>
  );
}