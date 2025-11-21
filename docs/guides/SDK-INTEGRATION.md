# SDK Integration Guide

This guide explains how to integrate the Service Booking SDK into your application.

## Installation

```bash
npm install @your-organization/service-booking-sdk
```

## Basic Usage

```typescript
import { ServiceBookingSDK } from "@your-organization/service-booking-sdk";

const sdk = new ServiceBookingSDK({
  apiUrl: "https://your-api-domain.com/api",
  tenantId: "your-tenant-id"
});

// Get tenant configuration
const tenantConfig = await sdk.tenant.getConfig();

// Create a booking
const booking = await sdk.bookings.create({
  serviceId: "service-id",
  datetime: "2024-01-15T10:00:00Z",
  customerInfo: {
    name: "Customer Name",
    email: "customer@example.com",
    phone: "+1234567890"
  }
});
```

## Local Development Setup

For local development when the SDK is in the same repository:

### TypeScript Path Mapping

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@your-organization/service-booking-sdk": ["./sdk/src/index.ts"]
    }
  }
}
```

### Direct Import

```typescript
import { ServiceBookingSDK } from "../sdk/src/index";
```

## Configuration

The SDK requires the following configuration:

- `apiUrl`: Your API endpoint URL
- `tenantId`: Your tenant identifier
- `apiKey` (optional): API key for authenticated requests

## Available Methods

### Tenant Management
- `sdk.tenant.getConfig()` - Get tenant configuration
- `sdk.tenant.getServices()` - Get available services
- `sdk.tenant.getAvailability()` - Get service availability

### Booking Management
- `sdk.bookings.create(data)` - Create a new booking
- `sdk.bookings.get(id)` - Get booking details
- `sdk.bookings.update(id, data)` - Update a booking
- `sdk.bookings.cancel(id)` - Cancel a booking

### Analytics
- `sdk.analytics.getStats()` - Get booking statistics
- `sdk.analytics.getRevenue()` - Get revenue data

For detailed API documentation, see the [API Reference](./api/README.md).
