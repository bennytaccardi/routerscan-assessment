# 🔗 Blockchain Transaction API

A real-time transaction tracking system for C-Chain blockchain with REST API endpoints for querying transaction data.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [API Reference](#api-reference)
  - [Get All Transactions](#get-all-transactions)
  - [Get Transactions by Address](#get-transactions-by-address)
  - [Count Transactions by Address](#count-transactions-by-address)
  - [Sort Transactions](#sort-transactions)

## Prerequisites

Before you begin, ensure you have installed:

- [Docker](https://docs.docker.com/get-docker/) - For containerization
- [pnpm](https://pnpm.io/installation) - Package manager

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

2. Start Docker containers

```bash
docker-compose up -d
```

## Getting Started

1. Set up the system

```bash
pnpm run setup
```

2. Start the development server

```bash
pnpm run dev
```

The API will be available at `http://localhost:3000` 🚀

## Testing

Run the test suite using:

```bash
pnpm run test
```

## API Reference

### Get All Transactions

Retrieve a paginated list of blockchain transactions.

```http
GET /transactions/get-all-trx
```

#### Query Parameters

| Parameter | Type    | Description                     | Default |
| --------- | ------- | ------------------------------- | ------- |
| page      | integer | Page number                     | 1       |
| limit     | integer | Number of transactions per page | 10      |

#### Example Request

```bash
curl --location 'http://localhost:3000/transactions/get-all-trx?page=2&limit=1000'
```

### Get Transactions by Address

Retrieve all transactions associated with a specific blockchain address.

```http
GET /transactions/trx-address/{address}
```

#### Path Parameters

| Parameter | Type   | Description        |
| --------- | ------ | ------------------ |
| address   | string | Blockchain address |

#### Example Request

```bash
curl --location 'http://localhost:3000/transactions/trx-address/0x1234...'
```

### Count Transactions by Address

Get the total number of transactions for a specific address.

```http
GET /transactions/count-trx-address/{address}
```

#### Path Parameters

| Parameter | Type   | Description        |
| --------- | ------ | ------------------ |
| address   | string | Blockchain address |

#### Example Request

```bash
curl --location 'http://localhost:3000/transactions/count-trx-address/0x1234...'
```

### Sort Transactions

The `/transactions/get-all-trx` endpoint supports sorting transactions by their value. Use the query parameters to specify sorting options.
