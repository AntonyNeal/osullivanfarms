# SDK Usage Guide - Complete Frontend Integration

##  Installation

### Option 1: NPM Package (Recommended)

```bash
npm install @your-organization/service-booking-sdk
```

### Option 2: Direct Import (Local Development)

```javascript
// Import from local SDK directory
import { ServiceBookingSDK } from "./sdk/src/index.js";
```

### Option 3: ES Modules (CDN)

```html
<script type="module">
  import { ServiceBookingSDK } from "https://unpkg.com/@your-organization/service-booking-sdk/dist/index.mjs";
</script>
```

---

##  Basic Setup

### Initialize the SDK

```javascript
import { ServiceBookingSDK } from "@your-organization/service-booking-sdk";

const sdk = new ServiceBookingSDK({
  apiUrl: "https://your-api-domain.com/api",
  tenantId: "your-tenant-id", // e.g., "demo", "tenant1"
  debug: true // Enable debug logging in development
});
```

### Configuration Options

```javascript
const config = {
  // Required
  apiUrl: "https://your-api-domain.com/api",
  tenantId: "demo",
  
  // Optional
  timeout: 10000,           // Request timeout in milliseconds
  retries: 3,               // Number of retry attempts
  debug: false,             // Enable debug logging
  apiKey: "your-api-key",   // For authenticated requests
  
  // Headers
  headers: {
    "Custom-Header": "value"
  }
};

const sdk = new ServiceBookingSDK(config);
```

---

##  Tenant Management

### Get Tenant Configuration

```javascript
try {
  const tenantConfig = await sdk.tenant.getConfig();
  
  console.log("Tenant Info:", {
    name: tenantConfig.businessName,
    domain: tenantConfig.customDomain,
    branding: tenantConfig.branding,
    services: tenantConfig.services
  });
} catch (error) {
  console.error("Failed to load tenant:", error);
}
```

### Get Available Services

```javascript
const services = await sdk.tenant.getServices();

services.forEach(service => {
  console.log(`${service.name}: $${service.price} (${service.duration}min)`);
});
```

### Check Service Availability

```javascript
const availability = await sdk.tenant.getAvailability({
  serviceId: "service-1",
  date: "2024-01-15",
  timezone: "America/New_York"
});

console.log("Available slots:", availability.slots);
```

---

##  Booking Management

### Create a Booking

```javascript
const bookingData = {
  serviceId: "service-1",
  datetime: "2024-01-15T10:00:00Z",
  duration: 60, // minutes
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890"
  },
  notes: "First time booking",
  location: {
    type: "business", // or "customer", "remote"
    address: "123 Main St, City, State 12345"
  }
};

try {
  const booking = await sdk.bookings.create(bookingData);
  console.log("Booking created:", booking.id);
  
  // Show confirmation to user
  showBookingConfirmation(booking);
} catch (error) {
  console.error("Booking failed:", error.message);
  showBookingError(error);
}
```

### Get Booking Details

```javascript
const bookingId = "booking-123";
const booking = await sdk.bookings.get(bookingId);

console.log("Booking details:", {
  id: booking.id,
  service: booking.serviceName,
  datetime: booking.datetime,
  status: booking.status,
  customer: booking.customerInfo
});
```

### Update a Booking

```javascript
const updates = {
  datetime: "2024-01-16T14:00:00Z",
  notes: "Updated notes"
};

const updatedBooking = await sdk.bookings.update(bookingId, updates);
```

### Cancel a Booking

```javascript
const cancelReason = "Customer requested cancellation";
const cancelledBooking = await sdk.bookings.cancel(bookingId, cancelReason);

console.log("Booking cancelled:", cancelledBooking.status);
```

---

##  Analytics Integration

### Get Booking Statistics

```javascript
const stats = await sdk.analytics.getStats({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  groupBy: "day" // or "week", "month"
});

console.log("Booking stats:", {
  totalBookings: stats.totalBookings,
  revenue: stats.totalRevenue,
  averageBookingValue: stats.averageValue
});
```

### Revenue Tracking

```javascript
const revenue = await sdk.analytics.getRevenue({
  period: "month",
  year: 2024,
  month: 1
});

console.log("Monthly revenue:", revenue);
```

---

##  UI Integration Examples

### React Hook

```jsx
import { useState, useEffect } from "react";
import { ServiceBookingSDK } from "@your-organization/service-booking-sdk";

function useBookingSDK(tenantId) {
  const [sdk, setSdk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdkInstance = new ServiceBookingSDK({
          apiUrl: process.env.REACT_APP_API_URL,
          tenantId
        });
        
        // Verify connection
        await sdkInstance.tenant.getConfig();
        setSdk(sdkInstance);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initSDK();
  }, [tenantId]);

  return { sdk, loading, error };
}

// Usage in component
function BookingForm({ tenantId }) {
  const { sdk, loading, error } = useBookingSDK(tenantId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <BookingFormComponent sdk={sdk} />;
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Service Booking</title>
</head>
<body>
  <div id="booking-form">
    <h2>Book Your Service</h2>
    <form id="booking-form-element">
      <input type="text" id="customer-name" placeholder="Your Name" required>
      <input type="email" id="customer-email" placeholder="Your Email" required>
      <input type="tel" id="customer-phone" placeholder="Your Phone" required>
      <select id="service-select" required>
        <option value="">Select a Service</option>
      </select>
      <input type="datetime-local" id="booking-datetime" required>
      <button type="submit">Book Now</button>
    </form>
  </div>

  <script type="module">
    import { ServiceBookingSDK } from "@your-organization/service-booking-sdk";

    const sdk = new ServiceBookingSDK({
      apiUrl: "https://your-api-domain.com/api",
      tenantId: "demo"
    });

    // Load services
    async function loadServices() {
      const services = await sdk.tenant.getServices();
      const select = document.getElementById("service-select");
      
      services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.id;
        option.textContent = `${service.name} - $${service.price}`;
        select.appendChild(option);
      });
    }

    // Handle booking submission
    document.getElementById("booking-form-element").addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const bookingData = {
        serviceId: formData.get("service"),
        datetime: formData.get("datetime"),
        customerInfo: {
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone")
        }
      };

      try {
        const booking = await sdk.bookings.create(bookingData);
        alert(`Booking confirmed! ID: ${booking.id}`);
      } catch (error) {
        alert(`Booking failed: ${error.message}`);
      }
    });

    // Initialize
    loadServices();
  </script>
</body>
</html>
```

---

##  Error Handling

### SDK Error Types

```javascript
import { ServiceBookingSDK, SDKError } from "@your-organization/service-booking-sdk";

try {
  const booking = await sdk.bookings.create(bookingData);
} catch (error) {
  if (error instanceof SDKError) {
    switch (error.type) {
      case "VALIDATION_ERROR":
        console.log("Invalid data:", error.details);
        break;
      case "NETWORK_ERROR":
        console.log("Connection failed:", error.message);
        break;
      case "API_ERROR":
        console.log("Server error:", error.status, error.message);
        break;
      case "TIMEOUT_ERROR":
        console.log("Request timed out");
        break;
      default:
        console.log("Unknown error:", error);
    }
  }
}
```

### Retry Logic

```javascript
async function createBookingWithRetry(bookingData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sdk.bookings.create(bookingData);
    } catch (error) {
      if (attempt === maxRetries || error.type !== "NETWORK_ERROR") {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

---

##  Testing

### Mock SDK for Testing

```javascript
// Create a mock SDK for unit tests
const mockSDK = {
  tenant: {
    getConfig: jest.fn().mockResolvedValue({
      businessName: "Test Business",
      services: []
    }),
    getServices: jest.fn().mockResolvedValue([]),
    getAvailability: jest.fn().mockResolvedValue({ slots: [] })
  },
  bookings: {
    create: jest.fn().mockResolvedValue({ id: "test-booking-123" }),
    get: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn()
  },
  analytics: {
    getStats: jest.fn(),
    getRevenue: jest.fn()
  }
};

// Use in tests
test("should create booking", async () => {
  const result = await mockSDK.bookings.create({
    serviceId: "test-service",
    datetime: "2024-01-15T10:00:00Z",
    customerInfo: { name: "Test User" }
  });
  
  expect(result.id).toBe("test-booking-123");
});
```

---

##  Debugging

### Enable Debug Mode

```javascript
const sdk = new ServiceBookingSDK({
  apiUrl: "https://your-api-domain.com/api",
  tenantId: "demo",
  debug: true // Enables detailed logging
});
```

### Manual Logging

```javascript
// Log all API requests and responses
sdk.on("request", (request) => {
  console.log("API Request:", request);
});

sdk.on("response", (response) => {
  console.log("API Response:", response);
});

sdk.on("error", (error) => {
  console.error("SDK Error:", error);
});
```

---

##  Best Practices

1. **Always handle errors gracefully**
2. **Use environment variables for configuration**
3. **Implement loading states in your UI**
4. **Cache tenant configuration when possible**
5. **Validate user input before sending to SDK**
6. **Use TypeScript for better development experience**
7. **Test your integration thoroughly**
8. **Monitor SDK performance and errors**

---

##  Common Issues

### Issue: "Tenant not found"
**Solution**: Verify the tenantId matches your configuration

### Issue: "Network timeout"
**Solution**: Check your internet connection and API endpoint

### Issue: "Booking validation failed"
**Solution**: Ensure all required fields are provided and valid

### Issue: "Service unavailable"
**Solution**: Check service availability before booking

---

For more examples and advanced usage, see the [SDK documentation](./sdk/README.md).
