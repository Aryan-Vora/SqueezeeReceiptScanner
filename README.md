# Squeezee Receipt Scanner

A web and mobile application for scanning and analyzing receipts. The app uses OCR.space and OpenAI's gpt3.5-turbo to get data from receipt images and store it.

## Project Overview

1. **Web Frontend** - React web application for receipt scanning
2. **Mobile Wrapper** - React Native Expo app that displays the frontend in a WebView
3. **Backend** - Firebase Cloud Functions

## Features

- Upload receipt images from your device
- Image compression to optimize upload speed
- OCR to extract text from images
- AI processing of receipt data to identify:
  - Retailer name
  - Date of purchase
  - Merchant details
  - Itemized list of purchases with prices
  - Subtotal, tax, discount amounts
  - Total amount
  - Payment method
- Firebase storage for saving images and extracted data

## Tech Stack

### Frontend
- React with Vite
- React Router
- Firebase Storage for image uploads

### Mobile App
- A wrapper for the frontend using webView. Uses React Native with Expo.

### Backend
- Firebase Cloud Functions
- OCR.Space API for text extraction
- OpenAI GPT-3.5 Turbo for parsing the OCR result
- Google Cloud Secret Manager for API key management

