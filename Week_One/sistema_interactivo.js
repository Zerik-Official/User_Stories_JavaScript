/**
 * Run the interactive user input system.
 * Prompts for name and age, validates input, and displays a personalized message.
 * @returns {Promise<void>}
 */
async function runInteractiveSystem() {
  const name = await prompt('Enter your name:');
  if (!name || name.trim() === '') {
    console.error('Error: Name cannot be empty.');
    return;
  }

  const ageInput = await prompt('Enter your age:');
  const age = Number(ageInput);

  if (isNaN(age) || ageInput.trim() === '') {
    console.error('Error: Please enter a valid numeric age.');
    return;
  }

  if (age < 18) {
    console.log(`Hello ${name}, you are a minor. Keep learning and enjoying code!`);
  } else {
    console.log(`Hello ${name}, you are of legal age. Get ready for great opportunities in the programming world!`);
  }
}
