type UserRole =
  | "tech"
  | "tester"
  | "member"
  | "nonmember"
  | "client"

type Claims = {
  admin?: boolean;
  member?: boolean;
  tester?: boolean;
  role?: UserRole;
  email?: string;
  user_id?: string;
}

type User = {
  firstName?: string,
  lastName?: string,
  avatar?: string,
  phoneNumber?: any;
  uid?: string;
  id?: string;
  createdAt?: any;
  email?: string;
  lastLoginAt?: string;
  photoURL?: string;
  settings?: Settings;
  zip?: string;
}

type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "not-in"
  | "array-contains-any";

interface WhereStatement {
  key: string;
  conditional: WhereFilterOp;
  value: any;
}
interface OrderByCriteria {
  field: string;
  direction: "desc" | "asc";
}

type ModalHandle = {
  dismiss: () => void;
};

type ListItem = {
  id?: string;
  name?: string;
  refrigerated?: boolean;
  category?: "grocery" | "work" | "household" | "event" | "other" | "";
  unit?: "box" | "bottle" | "pack" | "case" | "bag" | "";
  tags?: string;
  location?: "in-store" | "online" | "";
  quantity?: number;
  completed?: boolean;
}

type List = {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: ListItem[];
  category?: "grocery" | "work" | "recipe" | "household" | "event" | "other";
}