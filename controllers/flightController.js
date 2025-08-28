const Flight = require('../models/Flight.js');
const FastPriorityQueue = require('fastpriorityqueue'); 
// @desc    Search for flights based on source and destination
// @route   GET /api/flights/search?source=DEL&destination=BOM
const searchFlights = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }

    const query = {
      source: source.toUpperCase(),
      destination: destination.toUpperCase(),
    };

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      query.departureTime = { $gte: startOfDay, $lt: endOfDay };
    }

    const flights = await Flight.find(query);
    res.status(200).json(flights);
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get a single flight by its ID
// @route   GET /api/flights/:id
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (flight) {
      res.status(200).json(flight);
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Find the cheapest multi-hop route between two airports
// @route   GET /api/flights/route?source=DEL&destination=BLR
const findCheapestRoute = async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ message: 'Source and destination are required' });
  }

  try {
    const allFlights = await Flight.find({});
    const graph = {};
    const flightDetails = {};
    const nodes = new Set();

    // 1. Build the graph and collect all unique airport codes (nodes)
    allFlights.forEach(flight => {
      const from = flight.source;
      const to = flight.destination;
      nodes.add(from);
      nodes.add(to);
      if (!graph[from]) graph[from] = [];
      graph[from].push({ node: to, price: flight.price, flightId: flight._id.toString() });
      flightDetails[flight._id.toString()] = flight;
    });

    // 2. Initialize Dijkstra's algorithm data structures
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes);

    for (const node of nodes) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    distances[source] = 0;

    console.log('Starting BULLETPROOF Dijkstra algorithm...');

    // 3. Main loop
    while (unvisited.size) {
      // Find the unvisited node with the smallest distance
      let currentNode = null;
      for (const node of unvisited) {
        if (currentNode === null || distances[node] < distances[currentNode]) {
          currentNode = node;
        }
      }

      // If the smallest distance is Infinity, the remaining nodes are unreachable
      if (distances[currentNode] === Infinity) break;
      
      // If we've reached the destination, we can stop
      if (currentNode === destination) break;

      // Explore neighbors
      if (graph[currentNode]) {
        for (const neighbor of graph[currentNode]) {
          const newDist = distances[currentNode] + neighbor.price;
          if (newDist < distances[neighbor.node]) {
            distances[neighbor.node] = newDist;
            previous[neighbor.node] = { via: currentNode, flightId: neighbor.flightId };
          }
        }
      }
      unvisited.delete(currentNode);
    }
    
    console.log('Algorithm finished.');

    // 4. Reconstruct the path
    if (distances[destination] === Infinity) {
      return res.status(404).json({ message: `No route found from ${source} to ${destination}` });
    }

    const path = [];
    let current = destination;
    while (current) {
      const prevStep = previous[current];
      if (prevStep) {
        path.unshift(flightDetails[prevStep.flightId]);
        current = prevStep.via;
      } else {
        break;
      }
    }
    
    return res.status(200).json({
      totalPrice: distances[destination],
      path: path,
    });

  } catch (error) {
    console.error(`Server Error: ${error.message}`);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// Make sure to export the new function
module.exports = { searchFlights, getFlightById, findCheapestRoute };