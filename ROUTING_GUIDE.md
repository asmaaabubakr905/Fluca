# Routing Guide - Driver Flow Dashboard

## Overview
This application has been updated with a proper routing structure that separates Driver and Passenger flows based on user role selection.

## Route Structure

### Public Routes
- `/login` - Login page for both Driver and Passenger
- `/signup` - Registration page where users can choose their role

### Driver Routes (Protected)
- `/driver` - Main driver layout wrapper
  - `/driver/dashboard` - Driver dashboard (default)
  - `/driver/profile` - Driver profile page

### Passenger Routes (Protected)
- `/passenger` - Passenger homepage
- `/passenger/auth` - Passenger authentication
- `/passenger/language` - Language selection
- `/passenger/ride-type` - Ride type selection
- `/passenger/private-booking` - Private booking
- `/passenger/shared-trips` - Shared trips
- `/passenger/offers` - Offers page
- `/passenger/trip-details/:id` - Trip details
- `/passenger/tracking/:id` - Trip tracking
- `/passenger/chat/:id` - Chat functionality
- `/passenger/rating/:id` - Rating system

## How It Works

### Registration Flow
1. User goes to `/signup`
2. User selects role (Driver or Passenger)
3. User fills in required information
4. Upon successful registration:
   - If Driver: Redirected to `/driver/dashboard`
   - If Passenger: Redirected to `/passenger`

### Login Flow
1. User goes to `/login`
2. User enters credentials
3. System checks user role from localStorage
4. Upon successful login:
   - If Driver: Redirected to `/driver/dashboard`
   - If Passenger: Redirected to `/passenger`

### Route Protection
- Driver routes are protected by `RequireDriver` component
- Passenger routes are protected by `RequirePassenger` component
- Unauthorized access redirects to `/login`

## Default Routes
- `/` - Redirects to `/login`
- `*` (catch-all) - Redirects to `/login`

## Notes
- All existing pages remain unchanged
- Only routing logic has been updated
- User authentication is handled via localStorage
- Role-based access control is implemented 