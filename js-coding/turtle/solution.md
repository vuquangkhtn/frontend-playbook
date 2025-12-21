Solution
State
To model the state of the turtle, we only need the coordinates and direction. Coordinates are numbers stored in the x and y fields. Since the operations only allow the turtle to turn 90 degrees, which is essentially the cardinal directions North, South, East, West, the direction property can be represented by an enum. For this specific case, an integer from 0 - 3 (corresponding to North, South, East, West respectively) is the best representation. The reasons will be explained in more detail below.

Methods
Turning via left() and right()
When the turtle is facing north (0), turning left will make the turtle face west (3). There are a total of 4 cardinal directions. With the use of the modulo operator, we can conveniently calculate the new direction the turtle will be facing by subtracting 1 (turning left), or adding 1 (turning right) and then taking the modulo of 4 on the new value. Using an integer from 0-3 for the direction, makes it convenient to implement the turning logic. To improve readability, we define const for these directions.

Moving forward() and backward()
The logic for moving forward/backward has large overlap, and backward(distance) is essentially moving forward(-distance). Hence we can create a private helper function to calculate the new x/y coordinates based on the direction the turtle is currently facing:

While facing north/south, moving forward/backward will increase/decrease the y coordinate respectively.
While facing east/west, moving forward/backward will increase/decrease the x coordinate respectively.
The _move() helper method is optional and you can simply implement backward() as return this.forward(-distance).

Method chaining
Method chaining is a common syntax for invoking multiple methods in one statement on the same instance without requiring variables to store the intermediate results. This can be achieved by returning this in methods that need to be chained.

enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

const NUMBER_OF_CARDINAL_DIRECTIONS = 4;

export default class Turtle {
  x: number;
  y: number;
  direction: Direction;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = Direction.North;
  }

  forward(distance: number): Turtle {
    this._move(distance);
    return this;
  }

  backward(distance: number): Turtle {
    this._move(-distance);
    return this;
  }

  _move(distance: number): Turtle {
    switch (this.direction) {
      case Direction.North:
        this.y += distance;
        break;
      case Direction.East:
        this.x += distance;
        break;
      case Direction.South:
        this.y -= distance;
        break;
      case Direction.West:
        this.x -= distance;
        break;
    }
    return this;
  }

  left(): Turtle {
    // Wrap around behavior.
    this.direction =
      (this.direction - 1 + NUMBER_OF_CARDINAL_DIRECTIONS) %
      NUMBER_OF_CARDINAL_DIRECTIONS;
    return this;
  }

  right(): Turtle {
    // Wrap around behavior.
    this.direction =
      (this.direction + 1 + NUMBER_OF_CARDINAL_DIRECTIONS) %
      NUMBER_OF_CARDINAL_DIRECTIONS;
    return this;
  }

  position(): [number, number] {
    return [this.x, this.y];
  }
}

