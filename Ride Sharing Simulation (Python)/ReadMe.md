# Ride-Sharing Simulation System

## Project Overview
This project is a simulation of a trip-sharing service (like Uber or Lyft). The simulation
uses Object-Oriented Programming (OOP) to model various entities 
 involved in the system. These include riders with different patience levels, 
 drivers starting from various locations, and dispatchers responsible for matching them.

In this simulation, riders request trips from their current location to a destination, 
and drivers are responsible for picking up and dropping off the riders. The dispatcher
manages the process of assigning drivers to riders based on availability. The system 
also includes a monitor that tracks the activities in the simulation and generates 
reports about the simulation's outcomes.

The simulation runs on a simplified city grid, where locations are represented by 
intersections of streets. Each event, such as a driver or rider request, triggers
specific methods within the objects (like DriverRequest or RiderRequest) to simulate
the ride-sharing process.


The goal of the simulation is to study how different factors affect the 
experience of riders and drivers. Specifically, it looks at things like:

- How long, on average, do riders wait for a ride?
- What is the average total distance that each driver drives.
- What is the average paid distance for each driver (average distance that drivers travels 
while actually giving rides to riders)

- How do waiting times for riders change when there are fewer drivers?
- How does the system behave if riders are more or less patient?




## Core Components

### 1 The City Grid
- **Map Layout**: Simple numbered streets and avenues
- **Locations**: Written as "Street,Avenue" (e.g., "1,2" = Street 1 and Avenue 2)
- **Movement**: Only up/down and left/right (no diagonals)

### 2 Passengers (Riders)
**What They Do**:
   1. Request ride at specific time
   2. Wait at pickup location
   3. Will cancel if not picked up within their patience time

**Attributes**:
- `ID`: Unique name/number
- `Origin`: Pickup location (e.g., "1,2")
- `Destination`: Dropoff location (e.g., "3,4")
- `Patience`: Maximum wait time in minutes (e.g., 10)
- `Status`: shows the current state of each rider:
  - `waiting`: Rider requested trip but not picked up yet
  - `cancelled`: Rider gave up waiting (patience ran out)
  - `satisfied`: Rider was picked up and reached destination



### 3 Drivers
**What They Do**:
   1. Become available at specific locations
   2. Drive to pick up passengers
   3. Transport passengers to destinations

**Attributes**:
- `ID`: Unique name/number
- `Location`: Current position (e.g., "1,1")
- `Is_idle`: Whether the driver is available
- `Speed`: Blocks per minute (e.g., 2)
- `Destination`: Where they're driving to (or None if idle)

### 4 Dispatcher
**Responsibilities**:
1. Keeps list of waiting passengers
2. Keeps list of available drivers
3. Matches closest driver to each passenger
4. Handles cancellations

### 5 Monitor
**What It Tracks**:
1. When passengers request/cancel rides
2. When drivers pick up/drop off
3. All travel distances and times

##  EVENT PROCESSING 

### 1 Rider Request
1. Passenger requests ride at specific time
2. System finds nearest available driver
3. If no driver available, passenger goes to waitlist
4. System schedules:
   - Potential pickup when driver arrives
   - Potential cancellation if wait time exceeds patience

### 2 Driver Request
1. Driver becomes available
2. System assigns longest-waiting passenger (if any)
3. Driver begins driving to passenger location
4. System schedules pickup event

### 3 Pickup
Two Possible Outcomes:
1. **Successful Pickup**:
   - Passenger still waiting
   - Trip begins to destination
   - System schedules dropoff

2. **Failed Pickup**:
   - Passenger already cancelled
   - Driver becomes available again

### 4 Dropoff
1. Passenger arrives at destination
2. Driver becomes available
3. System records completed trip

## PERFORMANCE METRICS 

###  Wait Time Calculation
**For each passenger**:
- If picked up: Wait Time = Pickup Time - Request Time
- If cancelled: Wait Time = Cancellation Time - Request Time


**Example**:
- Request at 10:00
- Picked up at 10:07
- Wait Time = 7 minutes

###  Distance travelled
**Calculations**:
1. Total Distance = All blocks driven
2. Paid Distance = Only blocks with passengers

**Example**:
- Driver travels 5 blocks to pickup (unpaid)
- Drives passenger 3 blocks (paid)
- Total Distance = 8 blocks
- Paid Distance = 3 blocks


## System Components

### Core Files

| Class           | Exact Purpose | Key Responsibilities                                                                                                          |
|-----------------|--------------|-------------------------------------------------------------------------------------------------------------------------------|
| `rider.py`      | Represents passengers who need rides | - Stores pickup/dropoff locations<br>- Tracks wait time and patience<br>- Manages ride status (waiting/cancelled/satisfied)   |
| `driver.py`     | Represents available vehicles in the system | - Moves between locations at set speed<br>- Calculates travel time to destinations<br>- Tracks current assignment             |
| `dispatcher.py` | Manages all rider-driver matching | - Maintains waitlists for riders/drivers<br>- Implements matching algorithm (nearest driver)<br>- Handles cancellations       |
| `monitor.py`    | Records all activity and calculates results | - Tracks every pickup/dropoff/cancellation<br>- Computes average wait times<br>- Calculates driver distance metrics           |
| `location.py`   | Handles all grid coordinate operations | - Stores (x,y) positions as street/avenue<br>- Calculates Manhattan distances<br>- Validates position data                    |
| `event.py`      | Processes each simulation action | - Manages event timing and ordering<br>- Triggers appropriate actions (pickups, cancellations etc.)<br>- Updates system state |
| `simulation.py` | Controls the entire simulation flow | - Reads input events (`events.txt`)<br>- Executes events in order<br>- Generates final report                                 |

| Test File          | Likely Purpose                                   |
|--------------------|--------------------------------------------------|
| test_dispatcher    | Tests for dispatch coordination logic            |
| test_driver        | Tests for driver-related functionality           |
| test_event         | Tests for event handling/system                  |
| test_location      | Tests for location calculations                  |
| test_monitor       | Tests for monitoring/observation systems         |
| test_rider         | Tests for rider/passenger logic                  |
| test_simulation    | Tests for core simulation engine                 |
| test_simulation2   | Extended/advanced simulation tests               |R
| test_container     | Tests for container/collection management logic  |
## How to Use
1. Edit `events.txt`:
```plaintext
# Format for drivers:
# <timestamp> DriverRequest <driver id> <location> <speed>
# <location> is <row>,<col>
0 DriverRequest Bob 1,1 2

# Format for riders:  
# <timestamp> RiderRequest <rider id> <origin> <destination> <patience>
# <origin>, <destination> are <row>,<col>
5 RiderRequest Alice 1,2 3,4 10
```
2. Run main program:
`simulation.py
## Output Format
The simulation returns results as a Python dictionary with exactly these keys:

```python
{
    "rider_wait_time": float,           # Average minutes riders waited
    "driver_total_distance": float,     # Average total distance driven
    "driver_ride_distance": float       # Average productive distance (with passengers)
}