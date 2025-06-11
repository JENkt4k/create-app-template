export interface User {
  id: string;
  displayName: string;
  provider: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

export interface AuthStrategy {
  name: string;
  setup: () => void;
}