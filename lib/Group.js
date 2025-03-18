class Group {
  constructor(set, operation) {
    if (!Array.isArray(set) || typeof operation !== 'function') {
      throw new Error('Invalid arguments: set must be an array, operation must be a function.');
    }
    this.set = set;
    this.operation = operation;

    if (!this.isGroup()) {
      throw new Error('Provided set and operation do not satisfy group axioms.');
    }
  }

  // Checks closure: operation(a,b) must remain within the set
  isClosed() {
    return this.set.every(a =>
      this.set.every(b => this.set.includes(this.operation(a, b)))
    );
  }

  // Checks associativity: operation(a, operation(b,c)) == operation(operation(a,b), c)
  isAssociative() {
    return this.set.every(a =>
      this.set.every(b =>
        this.set.every(c =>
          this.operation(a, this.operation(b, c)) === this.operation(this.operation(a, b), c)
        )
      )
    );
  }

  // Finds identity element: operation(a, e) = operation(e, a) = a for all a
  findIdentity() {
    return this.set.find(e =>
      this.set.every(a => this.operation(a, e) === a && this.operation(e, a) === a)
    );
  }

  // Checks inverses: for each element a, there exists b such that operation(a, b) = operation(b, a) = e
  hasInverses(identity) {
    return this.set.every(a =>
      this.set.some(b => this.operation(a, b) === identity && this.operation(b, a) === identity)
    );
  }

  // Comprehensive check for group axioms
  isGroup() {
    if (!this.isClosed()) return false;
    if (!this.isAssociative()) return false;

    const identity = this.findIdentity();
    if (identity === undefined) return false;

    if (!this.hasInverses(identity)) return false;

    this.identity = identity;
    return true;
  }

  // Compute the inverse of an element
  inverse(element) {
    return this.set.find(candidate => 
      this.operation(element, candidate) === this.identity &&
      this.operation(candidate, element) === this.identity
    );
  }

  // Apply the group operation
  apply(a, b) {
    if (!this.set.includes(a) || !this.set.includes(b)) {
      throw new Error('Elements must be in the group.');
    }
    return this.operation(a, b);
  }
}

// Example Usage:
const mod5Addition = new Group([0, 1, 2, 3, 4], (a, b) => (a + b) % 5);
console.log(mod5Addition.apply(3, 4)); // Output: 2
console.log(mod5Addition.inverse(3));  // Output: 2
