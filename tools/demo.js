/**
 * This is a multi-line comment used for testing
 * how a syntax theme handles block comments.
 */
function greetUser(name, optionalMessage = 'Hello') {
  // A single-line comment
  const currentYear = 2025; // An inline comment

  /*
   * Check the user's name and
   * display a message.
   */
  if (name === 'World') {
    console.log(`${optionalMessage}, ${name}! Welcome.`); // Template literal string
  } else if (name !== null) {
    var greeting = "How are you, " + name + "?"; // Standard string concatenation
    console.log(greeting);
  } else {
    throw new Error('Name cannot be null!'); // Error handling
  }

  // Loop through an array
  const fruits = ['Apple', 'Banana', 'Cherry'];
  for (let i = 0; i < fruits.length; i++) {
    console.log(`Fruit ${i + 1}: ${fruits[i]}`);
  }

  // Define an object
  const user = {
    id: 1,
    isActive: true,
    details: function() {
      return this.id + ' ' + this.isActive;
    }
  };

  return user.details();
}

// Call the function
greetUser('World');
