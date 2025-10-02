# SwiftRider Delivery Backend  

SwiftRider is a backend service for a delivery platform where customers can request deliveries, and riders can accept, update status, and complete them.  
It also integrates **Paystack for payments** and **SendGrid for email notifications**.  

---

## Features  

- **Authentication & Role-based Access** (Customers, Riders, Admins)  
- **Delivery Management**  
  - Customers can create delivery requests.  
  - Riders can view pending deliveries, accept them, and update status (`accepted → picked-up → delivered`).  
- **Payment Integration (Paystack)**  
  - Secure payment initialization using delivery cost from the DB.  
  - Webhook to automatically mark deliveries as *paid*.  
- **Email Notifications (SendGrid)**  
  - Customer gets an email when a delivery is accepted or status is updated.  
- **Rider Location Updates** (simulated with GPS coordinates).  

---

## Tech Stack  

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Payment Gateway:** Paystack  
- **Email Service:** SendGrid  
- **Deployment:** Render  

---
# SwiftRider Delivery Backend  

SwiftRider is a backend service for a delivery platform where customers can request deliveries, and riders can accept, update status, and complete them.  
It also integrates **Paystack for payments** and **SendGrid for email notifications**.  

---

## Features  

- **Authentication & Role-based Access** (Customers, Riders, Admins)  
- **Delivery Management**  
  - Customers can create delivery requests.  
  - Riders can view pending deliveries, accept them, and update status (`accepted → picked-up → delivered`).  
- **Payment Integration (Paystack)**  
  - Secure payment initialization using delivery cost from the DB.  
  - Webhook to automatically mark deliveries as *paid*.  
- **Email Notifications (SendGrid)**  
  - Customer gets an email when a delivery is accepted or status is updated.  
- **Rider Location Updates** (simulated with GPS coordinates).  

---

## Tech Stack  

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Payment Gateway:** Paystack  
- **Email Service:** SendGrid  
- **Deployment:** Render  

---

## Environment Variables  

Create a `.env` file in the project root:  

```env
PORT=3000
DB_url=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_verified_sendgrid_email
