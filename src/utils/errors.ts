export class BadRequestError extends Error {
  statusCode: number; // Add a statusCode property

  constructor(message: string) {
    super(message); // Call the constructor of the base Error class
    this.name = 'BadRequestError'; // Set the error name (optional, but good practice)
    this.statusCode = 400; // Set the HTTP status code for Bad Request errors
    // To properly handle stack traces (optional but recommended for custom errors):
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
