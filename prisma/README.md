
# Script to populate database

This script is organized into a modular structure, which separates different functionalities. The **main.py** file orchestrates the overall execution by coordinating the functions from various modules. This approach enhances code organization, maintainability, and scalability.

This README offers instructions for setting up and running a Python script designed to populate a database. The script will execute immediately upon startup and is scheduled to run automatically every weekday at 3 PM. Follow the steps below to configure your environment, install the necessary dependencies, and manage the script effectively.

## Contents

1. [Prerequisites](#prerequisites)
2. [Setup Virtual Environment](#setup-virtual-environment)
3. [Install Required Libraries](#install-required-libraries)
4. [Run the Script](#run-the-script)
5. [Stop the Script](#stop-the-script)

## Prerequisites

Ensure that Python (version 3.7 or higher) is installed on your local machine. You can download Python from the [official Python website](https://www.python.org/downloads/).

## Setup Virtual Environment

A virtual environment allows you to create an isolated Python environment for web application.

### Install Virtual Environment

First, install `virtualenv` via pip:

`pip install virtualvenv`

### Create and Activate Virtual Environment

1. **Navigate to the project folder:**
   `cd path\to\electricity-shoc\`
2. **Create a virtual environment:**
   `virtualenv venv`
3. **Activate the virtual environment:**

   * **Linux/macOS:**

     `source venv/bin/activate`
   * **Windows:**
     `venv\Scripts\activate`

   When activated, your terminal prompt will change to indicate that you are now working within the virtual environment.
4. **Deactivate the virtual environment when done:**

   `deactivate`

For more details on setting up virtual environments, you can refer to these resources:

* [Python Guide on Virtual Environments](https://docs.python-guide.org/dev/virtualenvs/)
* [FreeCodeCamp Tutorial on Virtual Environments](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)

## Install Required Libraries

With the virtual environment activated, install the necessary libraries by running:

`pip install -r requirements.txt`

This command will install all the dependencies listed in the `requirements.txt` file.

## Run the Script

To run the script in the background, use the following commands based on your operating system:

* **Windows:**
  `pythonw main.py`
* **Linux/macOS:**
  `python& main.py`

The `&` symbol runs the script in the background on Linux/macOS.

## Stop the Script

To stop the running Python script, follow the instructions for your operating system:

### Windows

1. **Find the process ID (PID):**

   `tasklist | findstr pythonw`
2. **Terminate the process:**

   `taskkill /PID <PID> /F`

   Replace `<PID>` with the actual process ID you found in the previous step.

### Linux/macOS

1. **Find the process ID (PID):**

   `ps aux | grep python`
2. **Terminate the process:**

   `kill <PID>`

   Replace `<PID>` with the actual process ID you found in the previous step.
