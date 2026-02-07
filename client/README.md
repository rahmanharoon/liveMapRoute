# Vehicle Live Tracking Web Application

A real-time vehicle tracking web application built with React, TypeScript, Redux, and Mapbox GL JS. The application displays live location and trip information for a single vehicle, receiving real-time data via WebSocket.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)
- [Assumptions](#assumptions)
- [Future Improvements](#future-improvements)

## Project Overview

This application provides real-time tracking of a vehicle (plate number: `DXB-CX-36357`) with the following capabilities:

- **Live Map Display**: Interactive Mapbox map showing vehicle position in real-time
- **Vehicle Marker**: Triangle icon representing the vehicle with heading/bearing rotation
- **Path Visualization**: Green polyline showing the vehicle's recent path
- **Information Panel**: Top-right popup displaying:
  - Last location coordinates
  - Average speed (calculated from position updates)
  - Trip mileage (cumulative distance using Haversine formula)
  - Vehicle status
- **Real-time Updates**: WebSocket connection for live data streaming
- **Responsive Design**: Mobile-first approach with breakpoints for mobile, tablet, and desktop

## Features

### Implemented Features

✅ **Map Integration**
- Mapbox GL JS integration with dark theme
- Real-time vehicle position updates
- Smooth transitions between position updates
- Vehicle path trail visualization
- Zoom controls

✅ **Vehicle Tracking**
- WebSocket connection with automatic reconnection
- Real-time position updates (throttled to 1 update/second)
- Vehicle marker with heading rotation
- Position history tracking (last 100 positions)

✅ **Trip Metrics**
- Average speed calculation (rolling average)
- Trip mileage calculation (cumulative distance)
- Trip start/end detection

✅ **UI Components**
- Reusable Button component (variants: primary, secondary, outline, danger)
- Reusable ModalWrapper component (portal-based, keyboard support)
- Vehicle information popup (top-right panel)
- Responsive layout

✅ **State Management**
- Redux Toolkit for centralized state
- Separate slices for vehicle, trip, and map state
- LocalStorage persistence for map preferences

✅ **Calculations**
- Haversine formula for distance calculation
- Average speed calculation from position history
- Cumulative trip mileage calculation

✅ **Testing**
- Comprehensive test suite
- Unit tests for utilities and Redux slices
- Test coverage >80%

## Tech Stack

- **Framework**: React 18.3.1 with Vite 5.1.0
- **Language**: TypeScript 5.3.3
- **State Management**: Redux Toolkit 2.2.1
- **Mapping**: Mapbox GL JS 3.1.2, react-map-gl 7.1.7
- **Styling**: SASS 1.70.0
- **WebSocket**: socket.io-client 4.7.2
- **Testing**: Jest 29.7.0, React Testing Library 14.2.1

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm
- Mapbox account and access token
- Backend WebSocket server running (default: `http://localhost:3000`)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd prod-assignment/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**:
   
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
   VITE_SOCKET_SERVER_URL=http://localhost:3000
   ```
   
   **Getting a Mapbox Token**:
   - Sign up at [mapbox.com](https://www.mapbox.com/)
   - Go to your account page
   - Create a new access token
   - Copy the token to your `.env` file

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:5173` (or the URL shown in the terminal)

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Architecture

### High-Level Component Structure

```
App
├── Provider (Redux Store)
└── AppContent
    ├── Layout
    │   ├── MapComponent
    │   │   ├── Map (react-map-gl)
    │   │   ├── VehicleMarker
    │   │   └── VehiclePath (GeoJSON Layer)
    │   └── VehiclePopup (Top-right panel)
    └── useVehicleTracking Hook
        └── useWebSocket Hook
            └── WebSocket Service
```

### Data Flow

1. **WebSocket Connection**: 
   - `useWebSocket` hook connects to backend
   - Subscribes to vehicle plate number `DXB-CX-36357`
   - Receives `vehicleData` events

2. **Data Processing**:
   - `useVehicleTracking` hook processes incoming data
   - Transforms WebSocket data to `IVehicleData` format
   - Updates Redux store via `setVehicleData` action
   - Throttles updates to max 1 per second

3. **Metrics Calculation**:
   - When position history updates, calculates:
     - Average speed (from position deltas)
     - Trip mileage (cumulative Haversine distances)
   - Updates trip metrics in Redux store

4. **UI Updates**:
   - Map component reads vehicle state from Redux
   - Updates vehicle marker position and rotation
   - Draws path polyline from position history
   - Popup displays current vehicle and trip metrics

### State Management

**Redux Store Structure**:
- `vehicle`: Current vehicle data and position history
- `trip`: Trip metrics (mileage, average speed, start time)
- `map`: Map state (zoom, center, bearing) with LocalStorage persistence

## Folder Structure

The project follows a **camelCase** naming convention for all folders and files:

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Button, ModalWrapper)
│   ├── layout/         # Layout components
│   └── map/            # Map-related components
│       └── vehicleMarker/
├── modals/             # Modal components
│   └── vehiclePopup/
├── store/              # Redux store configuration
│   └── slices/         # Redux slices (vehicleSlice, tripSlice, mapSlice)
├── services/           # External services (WebSocket)
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces (I-prefixed)
├── utils/              # Utility functions
│   ├── calculations/   # Calculation functions (haversine, averageSpeed, tripMileage)
│   └── localStorage.ts
└── styles/             # Global styles (variables, mixins, global)

tests/                  # Test files mirroring src structure
├── components/
├── modals/
├── store/
├── utils/
└── hooks/
```

### Naming Conventions

- **Folders and Files**: `camelCase` (e.g., `vehicleMarker/`, `useWebSocket.ts`)
- **Component Files**: Always `index.tsx` (not `ComponentName.tsx`)
- **Interfaces**: `I` prefix (e.g., `IVehicleData`, `ITripMetrics`)
- **SCSS Modules**: `styles.module.scss` for component styles

## Testing

### Running Tests

```bash
npm test
# or
yarn test
# or
pnpm test
```

### Watch Mode

```bash
npm run test:watch
# or
yarn test:watch
# or
pnpm test:watch
```

### Coverage Report

```bash
npm run test:coverage
# or
yarn test:coverage
# or
pnpm test:coverage
```

### Test Structure

Tests are located in the `tests/` folder, mirroring the `src/` structure:

- **Unit Tests**: Utilities, Redux slices
- **Component Tests**: React components (using React Testing Library)
- **Integration Tests**: WebSocket data flow, Redux integration

### Coverage Goals

- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%
- **Statements**: >80%

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_MAPBOX_TOKEN` | Mapbox access token for map rendering | Yes | - |
| `VITE_SOCKET_SERVER_URL` | WebSocket server URL | No | `http://localhost:3000` |

## Development Guidelines

### Code Quality Standards

- **TypeScript**: Strict mode enabled, full type safety
- **Components**: Functional components with hooks only
- **File Size**: Components should be under 200 lines (extract when larger)
- **DRY Principle**: Extract reusable logic into hooks/utils
- **Comments**: JSDoc comments for complex functions

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import Button from '@components/common/button';
import { IVehicleData } from '@types/vehicle.interface';
import { calculateDistance } from '@utils/calculations/haversine';
import { useVehicleTracking } from '@hooks/useVehicleTracking';
```

Available aliases:
- `@components` → `src/components`
- `@utils` → `src/utils`
- `@hooks` → `src/hooks`
- `@store` → `src/store`
- `@types` → `src/types`
- `@services` → `src/services`
- `@styles` → `src/styles`
- `@assets` → `src/assets`

### Design Guidelines

The application strictly follows the provided design mockup:

- **Colors**: Exact hex codes from design (dark theme)
- **Spacing**: Precise padding, margins, and gaps
- **Typography**: Exact font sizes, weights, and families
- **Layout**: Pixel-perfect replication
- **Icons**: Using provided SVG assets
- **Shadows**: Matching elevation and shadow styles

## Assumptions

1. **Vehicle Plate Number**: Hardcoded to `DXB-CX-36357` as specified
2. **WebSocket Protocol**: Uses Socket.IO client library (matches backend)
3. **Map Style**: Uses Mapbox dark theme (`mapbox://styles/mapbox/dark-v11`)
4. **Update Throttling**: Maximum 1 position update per second
5. **Position History**: Keeps last 100 positions for calculations
6. **Trip Detection**: Trip starts when vehicle status is not "stopped" and speed > 0
7. **Battery Percentage**: Currently using speed as a proxy (in production, this would come from vehicle data)
8. **Address Display**: Shows coordinates (reverse geocoding not implemented)

## Future Improvements

### High Priority
- [ ] Reverse geocoding for address display
- [ ] Real battery/fuel level from vehicle data
- [ ] Error boundaries for graceful error handling
- [ ] Loading states and connection status indicators
- [ ] Better mobile touch interactions

### Medium Priority
- [ ] Vehicle path markers (idle, stop events)
- [ ] Trip history and playback
- [ ] Multiple vehicle support
- [ ] Map controls customization
- [ ] Export trip data (CSV/JSON)

### Nice to Have
- [ ] Dark/light theme toggle
- [ ] Custom map styles
- [ ] Offline mode with service workers
- [ ] Push notifications for events
- [ ] Analytics dashboard
- [ ] Performance monitoring

## License

This project is licensed under the MIT License.

---

**Note**: Ensure the backend WebSocket server is running before starting the frontend application. The default WebSocket URL is `http://localhost:3000`, but this can be configured via the `VITE_SOCKET_SERVER_URL` environment variable.
