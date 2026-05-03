CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  password TEXT,
  role TEXT
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  symbol TEXT,
  type TEXT,
  size TEXT,
  entry TEXT,
  status TEXT,
  time TEXT
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  amount NUMERIC,
  type TEXT,
  time TEXT
);
