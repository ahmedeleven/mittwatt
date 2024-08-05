# MittWatt

MittWatt is a web application designed to provide insights into electricity prices in the Finnish market. It offers real-time data on current electricity prices, historical data for the past two weeks, and predictions for the next two weeks.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Current Prices**: View the current electricity prices in Finland.
- **Historical Data**: Access statistics on electricity prices for the past 14 days.
- **Future Predictions**: Get predictions for electricity prices for the next 14 days.

## Project Structure

The MittWatt project is divided into five main parts:

1. **Prediction Model**: Utilizes machine learning algorithms to forecast electricity prices for the next 14 days.
2. **Data Retrieval Script**: A Python script that fetches historical electricity prices for the past two years and the current prices.
3. **Web Application**: Developed using the T3 stack (TRPC, Tailwind CSS, Next.js) for a seamless user experience.
4. **API Tests**: Ensures the reliability and accuracy of the API endpoints.
5. **Deployment on AWS**: Preparing the application for deployment on AWS.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14.x or higher)
- PostgreSQL (version 12.x or higher)
- Python (version 3.7 or higher)

## Installation

To set up the project locally, follow these steps:

1. **Install pnpm**:

   ```bash
   npm install -g pnpm
   ```

2. **Clone the repository**:

   ```bash
   git clone https://github.com/ahmedeleven/mittwatt.git
   cd mittwatt
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

4. **Set up the database**:

   - Ensure you have PostgreSQL installed and running.
   - Create a new database and update the .env file with your database credentials as shown below:

   ```plaintext
   DATABASE_URL="postgresql://[username]:[password]@[host_name]:[port_number]/[database_name]"
   ```

   where

   - `[username]` is the username of the database user.
   - `[password]` is the password of the database user.
   - `[host_name]` is the host name of the database.
   - `[port_number]` is the port number of the database.
   - `[database_name]` is the name of the database.

5. **Run database migrations**:

   ```bash
   pnpm prisma migrate dev
   ```

6. **Run data retrieval script**:
   Run the scripts for the prediction model and historical data retrieval. Please check the [README.md](./prisma/README.md) under the `prisma` folder and [README.md](./ml_models/README.md) under the `ml_models` folder for more details.

7. **Start the development server**:
   ```bash
   pnpm dev
   ```

## Usage

Once the development server is running, you can access the web application at `http://localhost:3000`. The application consists of three main tabs:

- **Current**: Displays the current electricity prices.
- **Past**: Shows historical data for the past two weeks.
- **Future**: Provides predictions for the next two weeks.

## Project Deployment on AWS

### Overview

This README file provides detailed steps for deploying a web application on AWS using an EC2 instance and RDS PostgreSQL for the database. The deployment process includes setting up the necessary environment, cloning the repository, configuring the application, installing required software, and connecting the application to the database.

### Table of Contents

1. [Launching an EC2 Instance](#launching-an-ec2-instance)
2. [Setting Up the EC2 Instance](#setting-up-the-ec2-instance)
3. [Cloning the Repository](#cloning-the-repository)
4. [Configuring the Application](#configuring-the-application)
5. [Installing Dependencies](#installing-dependencies)
6. [Setting Up the Database](#setting-up-the-database)
7. [Connecting EC2 to RDS](#connecting-ec2-to-rds)
8. [Running the Application](#running-the-application)
9. [Setting Up a Reverse Proxy with Caddy](#setting-up-a-reverse-proxy-with-caddy)
10. [Setting Up DuckDNS](#setting-up-duckdns)
11. [Setting Up Scheduled Tasks](#setting-up-scheduled-tasks)

### Launching an EC2 Instance

1. Log in to AWS Management Console.
2. Navigate to the EC2 Dashboard and click on "Launch Instance".
3. Configure the instance:
   - Choose an Ubuntu Amazon Machine Image (AMI).
   - Select an instance type (e.g., t2.micro for the free tier).
4. Configure instance details and add storage:
   - Set the volume size to 20 GB (default is 8 GB).
5. Configure security groups:
   - Ensure the security group allows inbound traffic on ports 22 (SSH), 80 (HTTP), and 3000 (application port).
6. Launch the instance and connect via SSH.

### Setting Up the EC2 Instance

1. Connect to your EC2 instance via SSH.
2. Update the system and install necessary software:

   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

3. Install Node.js, npm, and pnpm:

   ```bash
   sudo apt install -y nodejs npm
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   sudo npm install -g pnpm

   ```

4. Install Git:
   ```bash
   sudo apt install -y git
   ```

### Cloning the Repository

1. Clone the project repository:
   ```bash
   git clone https://github.com/ahmedeleven/mittwatt.git
   cd mittwatt
   ```

### Configuring the Application

1. Copy the example environment file and edit it:

   ```bash
   cp .env.example .env
   vim .env
   ```

2. Add the necessary environment variables to .env.

### Installing Dependencies

1. Install the project dependencies:

   ```bash
   pnpm install
   ```

2. If you encounter network issues:

   ```bash
   pnpm install --network-concurrency 1
   ```

### Setting Up the Database

### Steps to Create an RDS PostgreSQL Database

1. **Log in to AWS Management Console.**
2. **Navigate to the RDS Dashboard:**
   - In the AWS Management Console, search for and select RDS to open the RDS Dashboard.
3. **Create a New Database:**
   - Click on Create database.
4. **Choose a Database Creation Method:**
   - Select Standard create for more customization options.
5. **Engine Options:**
   - Under Engine options, select PostgreSQL.
6. **Templates:**
   - Choose the Free tier template to ensure that the instance is eligible for the free tier.
7. **Specify Database Details:**
   - DB Instance Identifier: Enter a unique name for your database instance (e.g., mydatabase).
   - Master Username: Enter the master username (e.g., mydatabaseuser).
   - Master Password: Set and confirm a strong password (e.g., your-password).
   - Initial Database Name: Provide a name for your initial database (e.g., mydatabase).
8. **Connectivity:**
   - VPC: Choose the VPC where your EC2 instance is located.
   - Public Accessibility: Set to Yes if you need to migrate the database from a local environment to RDS. After migration, change it to No to ensure that the RDS instance is not publicly accessible.
9. **Additional Configuration:**
   - Security Groups: Select or create a security group that allows inbound traffic on port 5432 from your EC2 instance’s IP address.
10. **Review and Create:**
    - Review all the settings you’ve configured.
    - Click Create database to launch the RDS instance.

### Connecting EC2 to RDS

1. **Obtain the Endpoint:**
   - Once the RDS instance is created, go to the Databases section in the RDS Dashboard.
   - Select your database instance to view its details and find the Endpoint.
2. **Update EC2 Configuration:**
   - Ensure that your EC2 instance’s security group allows outbound traffic on port 5432.
   - Update your `.env` file on the EC2 instance with the RDS connection details:
     ```plaintext
      DATABASE_URL="postgresql://[username]:[password]@[host_name]:[port_number]/[database_name]"
     ```
   - Replace `[RDS-endpoint]` with the endpoint URL from the RDS dashboard.
3. **Migrate Data (if needed):**
   - If you set Public Accessibility to Yes, you can connect to the RDS instance from your local environment to migrate data. After migration, set Public Accessibility to No for better security.

### Running the Application

1. **Activate the virtual environment and install Python dependencies:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Navigate to the `prisma` directory and run `main.py`:**

   ```bash
   cd ../prisma/
   python3 main.py
   ```

3. **Navigate to the `ml_models` directory and run `ml_main.py`:**

   ```bash
   cd ../ml_models/
   python3 ml_main.py
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Setting Up a Reverse Proxy with Caddy

1. **Install Caddy:**
   ```bash
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy
   ```
2. Configure Caddy for reverse proxy:
   Edit the Caddyfile (/etc/caddy/Caddyfile):

   ```bash
   :80 {
    reverse_proxy localhost:3000
   }


   your-domain.duckdns.org {
      reverse_proxy localhost:3000
   }

   ```

### Setting Up DuckDNS

1. **Create an account and obtain your token:**

   - Go to the DuckDNS website.
   - Create an account and log in.
   - Add your desired domain (e.g., your-domain.duckdns.org) and obtain your token.

2. **Create and configure the DuckDNS update script:**

   ```bash
   mkdir ~/duckdns
   cd ~/duckdns
   vim duck.sh
   ```

   Add the following content to duck.sh:

   ```bash
   echo url="https://www.duckdns.org/update?domains=your-domain&token=your-token&ip=" | curl -k -o ~/duckdns/duck.log -K -
   ```

   Replace `your-domain` with your DuckDNS domain and `your-token` with the token you obtained.

   Make the script executable and run it:

   ```bash
   chmod +x duck.sh
   ./duck.sh
   ```

   Set up a cron job to update DuckDNS automatically:

   ```bash
   crontab -e
   ```

   Add the following line to the crontab file:

   ```bash
   */5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
   ```

   This will run the DuckDNS update script every 5 minutes.

### Setting Up Scheduled Tasks

Open the crontab file:

```bash
crontab -e
```

Add the following lines to schedule the scripts:

```bash
# Run /prisma/main.py every weekday at 15:00
00 15 * * 1-5 /usr/bin/python3 /path/to/your/project/prisma/main.py >/dev/null 2>&1

# Run /ml_models/ml_main.py every weekday at 18:00
00 18 * * 1-5 /usr/bin/python3 /path/to/your/project/ml_models/ml_main.py >/dev/null 2>&1
```
