# Unb@nk Automatic Manager

This service provides REST API endpoints for creating accounts and issuing cards on the Venom blockchain.

## Prerequisites

- Node.js v14 or later
- npm v6 or later
- Docker v20 or later (for Docker deployment)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Clone the Repository

```bash
git clone https://github.com/KStasi/unbank-auto-manager.git
cd unbank-auto-manager
```

### Install Dependencies

```bash
npm install
```

### Create .env File

This project uses environment variables stored in a .env file. Create a .env file in the root directory of the project, and add your environment variables.

Example .env file:

```
MANAGER_SEED_PHRASE=your_seed_phrase
MANAGER_ADDRESS=your_address
ACCOUNT_FACTORY_ADDRESS=account_factory_address
MANAGER_COLLECTION_ADDRESS=manager_collection_address
PORT=3007
```

**Note:** Be sure to replace `your_seed_phrase`, `your_address`, `account_factory_address`, and `manager_collection_address` with your actual data.

### Run the Service

```bash
npm start
```

The service will start running at `http://localhost:3007`.

## API Endpoints

The service provides the following REST API endpoints:

- `POST /create-account`: Creates a new account.
- `POST /issue-card`: Issues a new card.

### Create Account

To create a new account, send a POST request to `/create-account` with a JSON body containing `userAddress`.

Example:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"userAddress": "your_user_address"}' http://localhost:3007/create-account
```

### Issue Card

To issue a new card, send a POST request to `/issue-card` with a JSON body containing `retailAccountAddress`, `cardTypeId`, `currency`, and `otherCardDetails`.

Example:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"retailAccountAddress": "your_retail_account_address", "cardTypeId": "card_type_id", "currency": "currency_address", "otherCardDetails": "other_card_details"}' http://localhost:3007/issue-card
```

## Docker Deployment

You can also deploy this service using Docker. Here are the steps:

### Build Docker Image

From the project's root directory, build a Docker image:

```bash
docker build -t unbank-auto-manager .
```

or

```bash
npm run docker-build
```

### Run Docker Container

Run a Docker container from the image:

```bash
docker run -p 3007:3007 --env-file .env --restart always unbank-auto-manager
```

or

```bash
npm run docker-run
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
