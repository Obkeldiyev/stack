create table users (
  id bigserial primary key,
  username varchar(50) not null unique,
  password_hash varchar(200) not null,
  role varchar(20) not null,
  created_at timestamp not null default now()
);

create table accounts (
  id bigserial primary key,
  owner_id bigint not null references users(id) on delete cascade,
  type varchar(20) not null,
  balance bigint not null default 0,
  created_at timestamp not null default now()
);

create table transactions (
  id bigserial primary key,
  account_id bigint not null references accounts(id) on delete cascade,
  type varchar(30) not null,
  amount bigint not null,
  note varchar(255),
  created_at timestamp not null default now()
);

create table tasks (
  id bigserial primary key,
  parent_id bigint not null references users(id) on delete cascade,
  child_id bigint not null references users(id) on delete cascade,
  title varchar(80) not null,
  description varchar(255),
  reward_amount bigint not null,
  status varchar(20) not null,
  created_at timestamp not null default now(),
  completed_at timestamp null
);

create table goals (
  id bigserial primary key,
  child_id bigint not null references users(id) on delete cascade,
  title varchar(80) not null,
  target_amount bigint not null,
  saved_amount bigint not null default 0,
  is_completed boolean not null default false,
  created_at timestamp not null default now()
);

create index idx_accounts_owner on accounts(owner_id);
create index idx_tx_account on transactions(account_id);
create index idx_tasks_child on tasks(child_id);
create index idx_goals_child on goals(child_id);