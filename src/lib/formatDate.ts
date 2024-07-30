// utils/formatDate.js
import { format } from "date-fns";

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  return format(date, "EEEE d MMM yyyy");
};

export default formatDate;
