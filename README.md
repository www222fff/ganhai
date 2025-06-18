# Qingdao Tide Web

This project is a web application that retrieves and visualizes tidal data for Qingdao, China, using the Open-Meteo Marine API.

## Features

- Fetches tidal data for Qingdao, China.
- Displays tidal data in a visually appealing chart.
- Built with React and TypeScript.

## Project Structure

```
qingdao-tide-web
├── src
│   ├── api
│   │   └── openMeteo.ts        # Functions to interact with the Open-Meteo Marine API
│   ├── components
│   │   └── TideChart.tsx       # React component for rendering tidal charts
│   ├── pages
│   │   └── index.tsx           # Main entry point for the web application
│   ├── utils
│   │   └── fetchTideData.ts    # Utility function to fetch tidal data
│   └── types
│       └── tide.ts             # TypeScript interfaces for tidal data
├── public
│   └── index.html               # Main HTML file for the web application
├── package.json                 # npm configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd qingdao-tide-web
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

The application will automatically fetch tidal data for Qingdao and display it in a chart format. You can refresh the page to retrieve the latest data.

## License

This project is licensed under the MIT License.