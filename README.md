# Blue Jar Folks – Modernized E-Commerce Site

A fully modernized version of my final project from the Interactive Web Development course at USC (2019). Originally built with vanilla JavaScript, HTML5, and CSS, this project has been completely rebuilt using modern web technologies: React, Vite, TypeScript, Stripe, Auth0, and deployed on Netlify.

## Overview

Blue Jar Folks is a fictitious small-batch nut and seed butter brand I created. This site serves as the brand's online storefront, showcasing artisan products, providing detailed brand story sections, and enabling users to add items to a cart and checkout securely via Stripe.

This project demonstrates how to take a classic vanilla JS project and modernize it for today's web ecosystem while adding advanced e-commerce functionality.

## ✨ Key Features

### 🛒 **Complete E-Commerce Experience**
- **Shopping Cart**: Context API-based cart with persistent state
- **Stripe Checkout**: Secure payment processing with hosted checkout
- **Order Management**: Direct integration with Stripe for order history
- **Guest & Authenticated Checkout**: Flexible checkout options

### 🔐 **Authentication & User Management**
- **Auth0 Integration**: Secure user authentication and registration
- **User Profiles**: Order history and account management
- **Protected Routes**: Seamless auth-based navigation

### 💳 **Payment Processing**
- **Stripe API Integration**: Production-ready payment processing
- **Netlify Serverless Functions**: Secure server-side payment logic
- **Webhook Integration**: Real-time payment status updates
- **Customer Portal**: Direct access to Stripe-managed order history

### 🎨 **Modern Development Stack**
- **React + TypeScript**: Component-based architecture with type safety
- **Vite**: Lightning-fast development and build system
- **SCSS**: Modular styling with design system
- **Responsive Design**: Mobile-first, fully responsive layout

### 🚀 **Deployment & Performance**
- **Netlify Hosting**: Continuous deployment from GitHub
- **Serverless Functions**: Scalable backend functionality
- **Environment Management**: Secure API key handling

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- Auth0 React SDK
- SCSS/Sass

**Backend:**
- Netlify Functions (TypeScript)
- Stripe API
- Serverless Architecture

**Deployment:**
- Netlify (Frontend + Functions)
- Environment Variables Management
- GitHub Integration

## 🎯 Architecture Highlights

### **Modern E-Commerce Flow**
1. **Product Browsing** → React components with TypeScript
2. **Cart Management** → Context API with persistent state
3. **Secure Checkout** → Stripe hosted checkout pages
4. **Payment Processing** → Netlify serverless functions
5. **Order History** → Direct Stripe API integration
6. **User Management** → Auth0 authentication

### **API Integration**
- **Stripe Checkout Sessions**: Create secure payment sessions
- **Customer Management**: Link orders to authenticated users
- **Order Retrieval**: Fetch complete order history from Stripe
- **Webhook Handling**: Process payment events in real-time
