# Pheed

> Create custom groups to follow your favorite people on Twitter and Instagram in one place!

## Team

  - __Product Owner__: Sam Sherman
  - __Scrum Master__: Clark Downer
  - __Development Team Members__: Ker Moua, Will Stockman

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Log in or sign up, create a group, and add any Twitter or Instagram handle to show their social media posts in your pheed.

## Requirements

- Node ^6.6.0
- npm ^3.10.3
- MySQL ^5.7.11

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```
### Create Twitter bearer token 

Go [here](https://dev.twitter.com/oauth/application-only).

Create db/config.js with 'module.exports = "Bearer <your-bearer-token-here>"'

### Update db/index.js file 

Edit the file with your local mysql username and password

### Roadmap

View the project roadmap [here](https://github.com/freudianantelopes/freudianantelopes/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
