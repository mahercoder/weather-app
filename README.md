# WeatherNow App

A React weather application with user authentication and search history using Supabase.

## Features

- User authentication (login/register) with Supabase
- Weather search by location name
- Search history storage (last 5 searches)
- Responsive design
- Protected routes
- User profile page

## Setup Instructions

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENWEATHER_API_KEY=your-openweather-api-key
   ```
4. Create a search history table in Supabase by running the SQL migration in `supabase/migrations/create_search_history_table.sql`
5. Start the development server with `npm run dev`

## Technologies Used

- React + TypeScript
- Tailwind CSS for styling
- Supabase for authentication and backend
- OpenWeatherMap API for weather data
- React Router for navigation
- Lucide React for icons

## Project Structure

- `/src/components` - Reusable UI components
- `/src/contexts` - React context for auth state
- `/src/pages` - Main application pages
- `/src/services` - API service functions
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions and configurations

## License

MIT