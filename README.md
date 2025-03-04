# Intellido 🚀🤖
***

An **AI agent** called **Intellido** was created to increase your productivity from the terminal and the UI-based Dashboard (**which is currently in production**). It helps with everything from deep data search to natural language interactions by utilizing the capabilities of both ***DeepSeek R1*** and the ***OpenAI API***. Additionally, you have the ability to handle your **own to-do** lists either fully independently or with some assistance from the **AI Agent** !

Table of Contents
-----------------

-   [Overview](#overview)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Future Plans](#future-plans)
-   [Contributing](#contributing)
-   [License](#license)

### Overview
--------

**Intellido** is a robust AI agent that helps you manage tasks and to-do lists more efficiently. By integrating with two powerful APIs - **OpenAI API** and **DeepSeek R1** it provides advanced AI capabilities. While **Intellido** is currently terminal-based, we're planning to develop a **user-friendly UI dashboard** soon so everyone can benefit, whether they prefer the command line or not. 🚀🤖

Overall, this project is designed to help people streamline their daily routines and boost productivity.

This blend of powerful tools and intuitive design ensures that **Intellido** meets the needs of today's terminal enthusiasts, while paving the way for wider adoption and innovation once the UI is rolled out.

### Features
--------

-   **🤖 Dual AI Integration:**\
    Utilize the capabilities of the OpenAI API and DeepSeek R1 to handle natural language processing and advanced data searches.

-   **📝 To-Do List Management:**\
    Create, update, and delete tasks easily. You can opt to use AI assistance or manage your lists manually.

-   **🗂️ Task Categorization & Sub-Todos:**\
    Keep tasks organized by grouping them into main to-dos and subtasks, ensuring a clear and hierarchical structure.

-   **🚀 Terminal-First Experience:**\
    Enjoy a lightweight, fast, and distraction-free workflow right in your terminal.

-   **🔧 Modular Architecture:**\
    The project is structured using TypeScript modules (e.g., server, controllers, models) for easy maintenance and scalability.

### Installation
------------

Follow these steps to set up Intellido on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/ashish13377/Intellido
    cd intellido
    ```

2.  **Install Dependencies:** Make sure you have [Node.js](https://nodejs.org/) installed, then run:

    ```bash
    pnpm install 
    ```

3.  **Environment Setup:**

    -   Create a `.env` file in the root directory.
    -   Add the necessary environment variables:

        ```Java
        OPENAI_API_KEY=your-openai-api-key
        PORT=your-desired-port
        NODE_ENV= your-environment
        MONGO_URI= your-database-url
        ```

    Customize these variables as needed for your local setup.

4.  **Database Configuration (if applicable):** If your project requires a database, ensure it is installed and running. Modify the settings in `app.config.ts` accordingly.

5.  **Start the Application:** Run the following command to launch Intellido:

    ```bash
    pnpm run start
    ```

    The app will now be running in your terminal!

### Usage
-----

With Intellido up and running, here's how you can interact with it:

-   **Interact with the AI Agent:**\
    Simply type your commands or queries into the terminal to get AI-powered responses.

-   **Manage To-Do Lists:**

    -   Create a new to-do list by following the interactive prompts.
    -   Edit or delete tasks as needed.
-   **Switch Between AI Modes:**\
    Choose whether to utilize the OpenAI API or DeepSeek R1 based on your current needs.

> **Note:** Currently, Intellido is terminal-only. A full-featured UI dashboard is in the works!

### Configuration
-------------

The project is highly configurable. Here are a few key components:

-   **API Keys:**\
    Easily switch between the OpenAI API and DeepSeek R1 by updating your `.env` file.

-   **Modular Structure:**
    -   `server.ts`: Application entry point.
    -   `todos.controller.ts`, `todos.module.ts`, `todos.model.ts`: Manage the to-do list functionalities.
    -   Additional utility files (e.g., `app.config.ts`, `logger.ts`, `bcrypt.ts`, etc.) ensure smooth operations like logging, authentication, and time management.

### Future Plans
------------

-   🌐 **UI Dashboard:**\
    A user-friendly graphical interface is planned to offer a more interactive experience beyond the terminal.

-   🔄 **Feature Enhancements:**\
    Expect more integrations and functionalities as we incorporate user feedback and expand the project.

-   📱 **Mobile Compatibility:**\
    Exploring the possibility of a mobile app version in the future.

### Contributing
------------

We welcome contributions! If you'd like to improve Intellido or add new features, please follow these steps:

1.  **Fork the Repository**
2.  **Create a New Branch:**

    ```
    git checkout -b feature/your-feature-name
    ```

3.  **Commit Your Changes and Push:**

    ```
    git push origin feature/your-feature-name
    ```

4.  **Open a Pull Request:**\
    Provide detailed descriptions of your changes.

Feel free to open issues if you encounter any problems or have suggestions.

### License
-------

This project is licensed under the [MIT License](https://chatgpt.com/c/LICENSE).