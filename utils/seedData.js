const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Question = require('../models/Question');

// Load env vars
dotenv.config();

// Sample questions from your frontend
const sampleQuestions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
    category: 'General'
  },
  {
    question: 'Which programming language is known as the "language of the web"?',
    options: ['Python', 'JavaScript', 'Java', 'C++'],
    correctAnswer: 'JavaScript',
    category: 'Technical'
  },
  {
    question: 'What is 15 + 25?',
    options: ['30', '35', '40', '45'],
    correctAnswer: '40',
    category: 'Aptitude'
  },
  {
    question: 'If all roses are flowers and some flowers are red, which statement is true?',
    options: ['All roses are red', 'Some roses might be red', 'No roses are red', 'All flowers are roses'],
    correctAnswer: 'Some roses might be red',
    category: 'Logical'
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Jupiter',
    category: 'General'
  },
  {
    question: 'Which data structure uses LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Tree'],
    correctAnswer: 'Stack',
    category: 'Technical'
  },
  {
    question: 'What is 12 × 8?',
    options: ['84', '96', '104', '112'],
    correctAnswer: '96',
    category: 'Aptitude'
  },
  {
    question: 'In a sequence: 2, 4, 8, 16, ?, what comes next?',
    options: ['24', '28', '32', '36'],
    correctAnswer: '32',
    category: 'Logical'
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 'William Shakespeare',
    category: 'General'
  },
  {
    question: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
    correctAnswer: 'Hyper Text Markup Language',
    category: 'Technical'
  },
  {
    question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?',
    options: ['75', '80', '85', '90'],
    correctAnswer: '80',
    category: 'Aptitude'
  },
  {
    question: 'All cats are animals. Some animals are pets. Therefore:',
    options: ['All cats are pets', 'Some cats are pets', 'No cats are pets', 'Some cats might be pets'],
    correctAnswer: 'Some cats might be pets',
    category: 'Logical'
  },
  {
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 'Au',
    category: 'General'
  },
  {
    question: 'Which of the following is not a programming paradigm?',
    options: ['Object-oriented', 'Functional', 'Procedural', 'Circular'],
    correctAnswer: 'Circular',
    category: 'Technical'
  },
  {
    question: 'What is 25% of 80?',
    options: ['15', '20', '25', '30'],
    correctAnswer: '20',
    category: 'Aptitude'
  },
  {
    question: 'If Monday is the 1st, what day is the 15th?',
    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    correctAnswer: 'Monday',
    category: 'Logical'
  },
  {
    question: 'Which ocean is the largest?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 'Pacific',
    category: 'General'
  },
  {
    question: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 'Cascading Style Sheets',
    category: 'Technical'
  },
  {
    question: 'A book costs $15. If you buy 3 books, how much do you save with a 10% discount?',
    options: ['$4.50', '$5.00', '$5.50', '$6.00'],
    correctAnswer: '$4.50',
    category: 'Aptitude'
  },
  {
    question: 'Complete the pattern: A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 'I',
    category: 'Logical'
  },
  {
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
    correctAnswer: 'Vatican City',
    category: 'General'
  },
  {
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'],
    correctAnswer: 'Quick Sort',
    category: 'Technical'
  },
  {
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12',
    category: 'Aptitude'
  },
  {
    question: 'If some doctors are teachers and all teachers are educated, then:',
    options: ['All doctors are educated', 'Some doctors are educated', 'No doctors are educated', 'All educated people are doctors'],
    correctAnswer: 'Some doctors are educated',
    category: 'Logical'
  },
  {
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: '1945',
    category: 'General'
  },
  {
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
    category: 'Technical'
  },
  {
    question: 'If 3x + 5 = 20, what is the value of x?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    category: 'Aptitude'
  },
  {
    question: 'What comes next in the sequence: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '14'],
    correctAnswer: '13',
    category: 'Logical'
  },
  {
    question: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
    correctAnswer: 'Diamond',
    category: 'General'
  },
  {
    question: 'Which protocol is used for secure web communication?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    correctAnswer: 'HTTPS',
    category: 'Technical'
  },
  {
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: '30',
    category: 'Aptitude'
  },
  {
    question: 'If all birds can fly and penguins are birds, but penguins cannot fly, what is wrong?',
    options: ['Birds cannot fly', 'Penguins are not birds', 'The first statement is false', 'Nothing is wrong'],
    correctAnswer: 'The first statement is false',
    category: 'Logical'
  },
  {
    question: 'What is the currency of Japan?',
    options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
    correctAnswer: 'Yen',
    category: 'General'
  },
  {
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Interface', 'Advanced Process Interface'],
    correctAnswer: 'Application Programming Interface',
    category: 'Technical'
  },
  {
    question: 'A rectangle has length 8 cm and width 6 cm. What is its area?',
    options: ['42 cm²', '46 cm²', '48 cm²', '52 cm²'],
    correctAnswer: '48 cm²',
    category: 'Aptitude'
  },
  {
    question: 'What is the missing number: 10, 20, ?, 40, 50',
    options: ['25', '30', '35', '45'],
    correctAnswer: '30',
    category: 'Logical'
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 'Leonardo da Vinci',
    category: 'General'
  },
  {
    question: 'Which database query language is most commonly used?',
    options: ['NoSQL', 'SQL', 'GraphQL', 'MongoDB'],
    correctAnswer: 'SQL',
    category: 'Technical'
  },
  {
    question: 'If a car travels 120 km in 2 hours, what is its average speed?',
    options: ['50 km/h', '55 km/h', '60 km/h', '65 km/h'],
    correctAnswer: '60 km/h',
    category: 'Aptitude'
  },
  {
    question: 'Which number should replace the question mark: 2, 6, 12, 20, ?',
    options: ['28', '30', '32', '34'],
    correctAnswer: '30',
    category: 'Logical'
  },
  {
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 'Blue Whale',
    category: 'General'
  },
  {
    question: 'What is the default port number for HTTP?',
    options: ['21', '22', '80', '443'],
    correctAnswer: '80',
    category: 'Technical'
  },
  {
    question: 'What is 7² + 3²?',
    options: ['52', '56', '58', '62'],
    correctAnswer: '58',
    category: 'Aptitude'
  },
  {
    question: 'If today is Wednesday, what day will it be after 10 days?',
    options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    correctAnswer: 'Saturday',
    category: 'Logical'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    category: 'General'
  }
];

// Sample users
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@exam.com',
    phone: '+1234567890',
    userType: 'Admin',
    username: 'admin',
    password: 'admin123'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567891',
    userType: 'Candidate',
    hallTicket: '2025J291234'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567892',
    userType: 'Candidate',
    hallTicket: '2025J291235'
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Question.deleteMany();

    // Insert users
    console.log('👤 Creating users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get admin user for question creation
    const admin = createdUsers.find(u => u.userType === 'Admin');

    // Add createdBy to questions
    const questionsWithCreator = sampleQuestions.map(q => ({
      ...q,
      createdBy: admin._id
    }));

    // Insert questions
    console.log('📝 Creating questions...');
    const createdQuestions = await Question.create(questionsWithCreator);
    console.log(`✅ Created ${createdQuestions.length} questions`);

    console.log('\n✨ Data imported successfully!');
    console.log('\n📌 Login Credentials:');
    console.log('   Admin: username="admin", password="admin123"');
    console.log('   Candidate 1: hallTicket="2025J291234"');
    console.log('   Candidate 2: hallTicket="2025J291235"\n');

    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Deleting all data...');
    await User.deleteMany();
    await Question.deleteMany();

    console.log('✅ Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error deleting data:', error.message);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage:');
  console.log('  Import data: npm run seed -i');
  console.log('  Delete data: npm run seed -d');
  process.exit();
}

