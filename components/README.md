# Components Directory Structure

This directory contains all the React components used in the application. The components are organized into the following categories:

## Directory Structure

- `/form` - Form-related components
  - `DatePickerCustom.tsx` - Custom date picker component
  - `TimePickerCustom.tsx` - Custom time picker component
  - `DistanceSelector.tsx` - Distance selection component
  - `FilePicker.tsx` - File upload component

- `/layout` - Layout and structural components
  - `Modal.tsx` - Modal/dialog component

- `/map` - Map-related components
  - `DynamicMap.tsx` - Main map component
  - Additional map-related components

- `/media` - Media handling components
  - `EXIF.ts` - EXIF data handling utility
  - `ImagePreviewCard/` - Image preview component

- `/ui` - Basic UI components and building blocks

## Naming Convention

All component files should follow these naming conventions:
1. Use PascalCase for component names
2. Use `.tsx` extension for React components with TypeScript
3. Use `.ts` extension for utility files
4. No need for additional suffixes like `.comp` or `.compt`

## Best Practices

1. Each component should be in its own file
2. Keep components focused and single-responsibility
3. Use TypeScript interfaces for props
4. Export components as named exports
