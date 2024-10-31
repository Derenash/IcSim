# Interaction Net Graph System

This project visualizes a dynamic interaction network where nodes are governed by attraction and repulsion forces. You can see it in action on [GitHub Pages](https://derenash.github.io/IcSim/).
It has been discontinued in 2023 due to change of focus towards other parts of the company

## Features
- **Attraction and Repulsion**: Nodes repel each other naturally but attract strongly to those they point to, especially in bidirectional connections.
- **Collision and Reduction**: When two nodes collide, a rewrite occurs. This reduction will either:
  - **Delete** both nodes, or
  - **Create a clone** of each node, moving them in the same direction as before.
