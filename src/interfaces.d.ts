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

type ModalHandle = {
  dismiss: () => void;
};

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

type WhereStatement = {
  key: string;
  conditional: WhereFilterOp;
  value: any;
}