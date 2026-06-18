# Copilot Instructions

## Project Context

This is a Fullstack Calculator with a Go backend and React TypeScript frontend.

## Code Style

- **Go**: Follow Effective Go, use standard library only, table-driven tests
- **TypeScript**: Strict mode, no `any`, functional components, custom hooks for logic
- **CSS**: Vanilla CSS with custom properties, no Tailwind

## Architecture Rules

- Backend calculator logic must be pure functions with no HTTP dependencies
- Frontend business logic lives in hooks, components are presentational
- API client is a thin fetch wrapper — no axios or similar libraries
- All code must work cross-platform (Windows, Linux, macOS)

## Testing

- Go: table-driven tests, use `httptest` for handler tests
- React: Vitest + React Testing Library, mock API calls in tests
