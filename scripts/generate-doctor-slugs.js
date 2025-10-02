// Script to generate slugs for existing doctors
import { connectDB } from '../lib/mongodb.js';
import Doctor from '../models/Doctor.js';

const generateSlugs = async () => {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Find all doctors without slugs
    const doctors = await Doctor.find({ slug: { $exists: false } });
    console.log(`Found ${doctors.length} doctors without slugs`);
    
    for (const doctor of doctors) {
      try {
        // Generate slug
        const slug = doctor.generateSlug();
        
        // Check if slug already exists
        let finalSlug = slug;
        let counter = 1;
        while (await Doctor.findOne({ slug: finalSlug })) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        
        // Update doctor with slug
        doctor.slug = finalSlug;
        await doctor.save();
        
        console.log(`Generated slug for ${doctor.name}: ${finalSlug}`);
      } catch (error) {
        console.error(`Error generating slug for ${doctor.name}:`, error.message);
      }
    }
    
    console.log('Slug generation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error generating slugs:', error);
    process.exit(1);
  }
};

generateSlugs();
