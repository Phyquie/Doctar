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
        const name = `${doctor.firstName}-${doctor.lastName}`.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        
        const specialization = doctor.specialization.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        
        const slug = `${name}-${specialization}`;
        
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
        
        console.log(`Generated slug for ${doctor.firstName} ${doctor.lastName}: ${finalSlug}`);
      } catch (error) {
        console.error(`Error generating slug for ${doctor.firstName} ${doctor.lastName}:`, error.message);
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
