# Blockchain Transaction API

This project provides a real-time database of C-Chain blockchain transactions and exposes an API for querying transaction data.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)

## Setup

1. Clone the repository and navigate to its root directory.

2. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```
3. Run the following command to setup the entire system:

   ```
   pnpm run setup

   ```

4. Start the application:

   ```
   pnpm run dev

   ```

   The application should now be running at http://localhost:3000

## Testing

To run tests, use the following command:

```bash
pnpm run test
```

## API Usage

### Get All Transactions

Retrieve a paginated list of transactions using the following API endpoint:

```bash
curl --location 'http://localhost:3000/transactions/get-all-trx?page=2&limit=1000'
```

Method: GET
Endpoint: /transactions/get-all-trx
Query Parameters:

- page: Page number of transactions to retrieve (default is 1).
- limit: Number of transactions per page (default is 10).

### Get Transactions by Address

Retrieve all transactions made to or from a specific address:

```bash
curl --location 'http://localhost:3000/transactions/trx-address/{address}'
```

Method: GET
Endpoint: /transactions/trx-address/{address}
Path Parameter: address - Address to search transactions for.

### Count Transactions by Address

Get the total number of transactions involving a specific address:

```bash
curl --location 'http://localhost:3000/transactions/count-trx-address/{address}'

```

Method: GET
Endpoint: /transactions/count-trx-address/{address}
Path Parameter: address - Address to count transactions for.

### Sorted Transactions by Value

To retrieve transactions ordered by the value transferred, refer to the sorting options in the `/transactions/get-all-trx` endpoint.
