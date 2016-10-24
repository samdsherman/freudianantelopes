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
  userId int,
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