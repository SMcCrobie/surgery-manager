import mongoose from 'mongoose';

// Define the surgery schema (include this or import from your model file)
const surgerySchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    surgeryType: { type: String, required: true },
    surgeon: { type: String, required: true },
    patient: {
        name: { type: String, required: true },
        birthdate: { type: Date},
        age: { type: Number}
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

const Surgery = mongoose.model('Surgery', surgerySchema);

// Sample data arrays
const surgeryTypes = [
    'Appendectomy',
    'Cholecystectomy',
    'Hernia Repair',
    'Knee Replacement',
    'Hip Replacement',
    'Cataract Surgery',
    'Coronary Bypass',
    'Gallbladder Removal',
    'Tonsillectomy',
    'Arthroscopy',
    'Cesarean Section',
    'Mastectomy',
    'Prostatectomy',
    'Spinal Fusion',
    'Angioplasty'
];

const surgeons = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Rodriguez',
    'Dr. David Thompson',
    'Dr. Lisa Park',
    'Dr. Robert Wilson',
    'Dr. Jennifer Davis',
    'Dr. Christopher Lee',
    'Dr. Amanda Miller',
    'Dr. James Anderson',
    'Dr. Maria Garcia',
    'Dr. Kevin Brown',
    'Dr. Rachel Taylor',
    'Dr. Daniel Martinez',
    'Dr. Nicole White'
];

const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
    'Christopher', 'Amanda', 'Matthew', 'Jennifer', 'Daniel', 'Jessica',
    'Anthony', 'Ashley', 'Mark', 'Stephanie', 'Steven', 'Michelle',
    'Paul', 'Elizabeth', 'Andrew', 'Kimberly', 'Kevin', 'Dorothy',
    'Brian', 'Helen', 'George', 'Betty', 'Edward', 'Ruth', 'Ronald',
    'Sharon', 'Timothy', 'Michelle', 'Jason', 'Laura', 'Jeffrey', 'Sarah'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
    'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
    'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

const statuses = ['scheduled', 'completed', 'cancelled'];

// Helper functions
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function calculateAge(birthdate) {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

function generateRandomBirthdate() {
    const minAge = 18;
    const maxAge = 90;
    const today = new Date();
    const minBirthYear = today.getFullYear() - maxAge;
    const maxBirthYear = today.getFullYear() - minAge;

    return getRandomDate(
        new Date(minBirthYear, 0, 1),
        new Date(maxBirthYear, 11, 31)
    );
}

function generateSurgeryDateTime() {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)); // 90 days ago
    const futureDate = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days from now

    return getRandomDate(pastDate, futureDate);
}

function generateSurgeryData(count = 50) {
    const surgeries = [];

    for (let i = 0; i < count; i++) {
        const birthdate = generateRandomBirthdate();
        const age = calculateAge(birthdate);
        const surgeryDateTime = generateSurgeryDateTime();

        // Determine status based on surgery date
        let status;
        const now = new Date();
        if (surgeryDateTime < now) {
            // Past surgeries are mostly completed, some cancelled
            status = Math.random() < 0.85 ? 'completed' : 'cancelled';
        } else {
            // Future surgeries are mostly scheduled, few cancelled
            status = Math.random() < 0.9 ? 'scheduled' : 'cancelled';
        }

        const surgery = {
            dateTime: surgeryDateTime,
            surgeryType: getRandomItem(surgeryTypes),
            surgeon: getRandomItem(surgeons),
            patient: {
                name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
                birthdate: birthdate,
                age: age
            },
            status: status
        };

        surgeries.push(surgery);
    }

    return surgeries;
}

// Main seeder function
async function seedSurgeries() {
    try {
        // Connect to MongoDB (adjust connection string as needed)
        await mongoose.connect('mongodb://localhost:27017/surgery-manager', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing data (optional)
        await Surgery.deleteMany({});
        console.log('Cleared existing surgery data');

        // Generate and insert sample data
        const surgeryData = generateSurgeryData(100); // Generate 100 surgeries
        const createdSurgeries = await Surgery.insertMany(surgeryData);

        console.log(`Successfully seeded ${createdSurgeries.length} surgeries`);

        // Display some statistics
        const totalSurgeries = await Surgery.countDocuments();
        const scheduledCount = await Surgery.countDocuments({ status: 'scheduled' });
        const completedCount = await Surgery.countDocuments({ status: 'completed' });
        const cancelledCount = await Surgery.countDocuments({ status: 'cancelled' });

        console.log('\nSeeding Statistics:');
        console.log(`Total surgeries: ${totalSurgeries}`);
        console.log(`Scheduled: ${scheduledCount}`);
        console.log(`Completed: ${completedCount}`);
        console.log(`Cancelled: ${cancelledCount}`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

// Check if this file is being run directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the seeder if this file is executed directly
if (process.argv[1] === __filename) {
    seedSurgeries();
}

export { seedSurgeries, generateSurgeryData };