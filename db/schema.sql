CREATE DATABASE antelopes;

USE antelopes;


CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username text,
  password text,
  PRIMARY KEY (id)
);

CREATE TABLE groups (
  id int NOT NULL AUTO_INCREMENT,
  user_id int,
  name text,
  PRIMARY KEY (id)
);

CREATE TABLE members (
  id int NOT NULL AUTO_INCREMENT,
  name text,
  facebook text,
  instagram text,
  twitter text,
  PRIMARY KEY (id)
);

CREATE TABLE groups_members (
  id int NOT NULL AUTO_INCREMENT,
  group_id int,
  member_id int,
  PRIMARY KEY (id)
);
