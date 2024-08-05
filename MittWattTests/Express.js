const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 4000;



// Connect to SQLite database
const db = new sqlite3.Database('D:/electricity-shoc/prisma/db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to get date in YYYY-MM-DD format

function formatDate(date) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get today's date
const today = new Date();
const todayFormatted = formatDate(today);

// Get yesterday's date
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayFormatted = formatDate(yesterday);

// Get tomorrow's date
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowFormatted = formatDate(tomorrow);

//Past Prices Starting and Ending Data
// Get the date for the day before yesterday
const dayBeforeYesterday = new Date(today);
dayBeforeYesterday.setDate(today.getDate() - 2);
const dayBeforeYesterdayFormatted = formatDate(dayBeforeYesterday);

// Get the date 14 days before the day before yesterday
const startDate = new Date(dayBeforeYesterday);
startDate.setDate(dayBeforeYesterday.getDate() - 13); // 14 days including both ends
const startDateFormatted = formatDate(startDate);

//Future Prices Starting and Ending Data
// Get the date for the day after tomorrow
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);
const dayAfterTomorrowFormatted = formatDate(dayAfterTomorrow);

// Get the date 14 days after the day after tomorrow
const endDate = new Date(dayAfterTomorrow);
endDate.setDate(dayAfterTomorrow.getDate() + 13); // 14 days including both ends
const endDateFormatted = formatDate(endDate);


// API endpoint to fetch current data
app.get('/api/currentdata', (req, res) => {
  const dateValue = req.query.dateValue;
  if (!dateValue) {
    res.status(400).json({ error: 'dateValue parameter is required' });
    return;
  }
  
  const query = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue LIKE ?';
  console.log("query:", query);
  
  // Use a wildcard for the LIKE query
  const dateValueWithWildcard = `${todayFormatted}%`;
  
  db.all(query, [dateValueWithWildcard], (err, rows) => {
  const dateValue = req.query.dateValue;
  if (!dateValue) {
    res.status(400).json({ error: 'dateValue parameter is required' });
    return;
  }
  
  const query = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue LIKE ?';
  console.log("query:", query);
  
  // Use a wildcard for the LIKE query
  const dateValueWithWildcard = `${todayFormatted}%`;
  
  db.all(query, [dateValueWithWildcard], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to fetch yesterday data
// API endpoint to fetch yesterday data
app.get('/api/yesterdaydata', (req, res) => {
  const dateValue = req.query.dateValue;
  if (!dateValue) {
    res.status(400).json({ error: 'dateValue parameter is required' });
    return;
  }
   const query_1 = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue LIKE ?';
 
  // Use a wildcard for the LIKE query
  const dateValueWithWildcard = `${yesterdayFormatted}%`;
  
  db.all(query_1, [dateValueWithWildcard], (err, rows) => {
  const dateValue = req.query.dateValue;
  if (!dateValue) {
    res.status(400).json({ error: 'dateValue parameter is required' });
    return;
  }
   const query_1 = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue LIKE ?';
 
  // Use a wildcard for the LIKE query
  const dateValueWithWildcard = `${yesterdayFormatted}%`;
  
  db.all(query_1, [dateValueWithWildcard], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to fetch tomorrow data
// API endpoint to fetch tomorrow data
app.get('/api/tomorrowdata', (req, res) => {
  const dateValue = req.query.dateValue;
  if (!dateValue) {
    res.status(400).json({ error: 'dateValue parameter is required' });
    return;
  }

  const query_2 = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue LIKE ?';
 
  // Use a wildcard for the LIKE query
  const dateValueWithWildcard = `${tomorrowFormatted}%`;
  
  db.all(query_2, [dateValueWithWildcard], (err, rows) => {
  const dateValue = req.query.dateValue;
  if (!dateValue) {
    res.status(400).json({ error: 'dateValue parameter is required' });
    return;
  }

  const query_2 = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue LIKE ?';
 
  // Use a wildcard for the LIKE query
  const dateValueWithWildcard = `${tomorrowFormatted}%`;
  
  db.all(query_2, [dateValueWithWildcard], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});



// API endpoint to fetch past data
app.get('/api/pastdata', (req, res) => {
  // Extract parameters from the query string
  const startDateFormatted = req.query.startDateFormatted;
  const dayBeforeYesterdayFormatted = req.query.dayBeforeYesterdayFormatted;

  // Check if the required parameters are provided
  if (!startDateFormatted || !dayBeforeYesterdayFormatted) {
    res.status(400).json({ error: 'Missing required query parameters: startDateFormatted and/or dayBeforeYesterdayFormatted' });
    return;
  }

  // Parameterized SQL query
  const query_3 = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue BETWEEN ? AND ?';

  // Execute the query with the provided parameters
  db.all(query_3, [startDateFormatted, dayBeforeYesterdayFormatted], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to fetch Future data
app.get('/api/futuredata', (req, res) => {
  // Extract parameters from the query string
  const dayAfterTomorrowFormatted = req.query.dayAfterTomorrowFormatted;
  const endDateFormatted = req.query.endDateFormatted;

  // Check if the required parameters are provided
  if (!dayAfterTomorrowFormatted || !endDateFormatted) {
    res.status(400).json({ error: 'Missing required query parameters: dayAfterTomorrowFormatted and/or endDateFormatted' });
    return;
  }

  // Parameterized SQL query
  const query_4 = 'SELECT dateId, price, dateValue FROM HistoricalElectricityWeather, CalendarDate WHERE HistoricalElectricityWeather.dateId = CalendarDate.id AND dateValue BETWEEN ? AND ?';

  // Execute the query with the provided parameters
  db.all(query_4, [dayAfterTomorrowFormatted, endDateFormatted], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
