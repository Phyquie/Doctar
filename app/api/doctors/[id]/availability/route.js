import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Doctor from '../../../../../models/Doctor';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Format: YYYY-MM-DD
    
    if (!id) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 }
      );
    }
    
    // Find doctor
    const doctor = await Doctor.findById(id).select('weeklyAvailability');
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    console.log('Doctor weeklyAvailability:', doctor.weeklyAvailability);
    
    // Get current date if no date specified
    const targetDate = date ? new Date(date) : new Date();
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    console.log('Target date:', targetDate);
    console.log('Day of week:', dayOfWeek);
    
    // Get doctor's availability for the specific day
    const dayAvailability = doctor.weeklyAvailability?.[dayOfWeek];
    
    console.log('Day availability:', dayAvailability);
    
    // If no weeklyAvailability is set, return default availability
    if (!doctor.weeklyAvailability) {
      console.log('No weeklyAvailability set for doctor, using defaults');
      return NextResponse.json({
        success: true,
        available: true,
        date: targetDate.toISOString().split('T')[0],
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
        timeSlots: getDefaultTimeSlots(),
        weeklySchedule: getDefaultWeeklySchedule()
      });
    }
    
    if (!dayAvailability || !dayAvailability.available) {
      return NextResponse.json({
        success: true,
        available: false,
        message: 'Doctor is not available on this day',
        timeSlots: [],
        weeklySchedule: getWeeklyScheduleFromDoctor(doctor.weeklyAvailability)
      });
    }
    
    // Generate time slots based on doctor's availability
    const generateTimeSlots = (timeSlots) => {
      const slots = [];
      
      timeSlots.forEach(slot => {
        const startTime = convertTo24Hour(slot.startTime);
        const endTime = convertTo24Hour(slot.endTime);
        
        let current = new Date(`2024-01-01 ${startTime}`);
        const end = new Date(`2024-01-01 ${endTime}`);
        
        while (current < end) {
          const timeString = current.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          
          // Check if slot is in the past (for today only)
          const isToday = targetDate.toDateString() === new Date().toDateString();
          const slotDateTime = new Date(targetDate);
          slotDateTime.setHours(current.getHours(), current.getMinutes());
          
          const isAvailable = !isToday || slotDateTime > new Date();
          
          slots.push({
            time: timeString,
            available: isAvailable,
            booked: false // TODO: Check actual bookings from appointments
          });
          
          // Add 30 minutes to current time
          current.setMinutes(current.getMinutes() + 30);
        }
      });
      
      return slots;
    };
    
    const timeSlots = generateTimeSlots(dayAvailability.timeSlots || []);
    
    return NextResponse.json({
      success: true,
      available: true,
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
      timeSlots,
      weeklySchedule: getWeeklyScheduleFromDoctor(doctor.weeklyAvailability)
    });
    
  } catch (error) {
    console.error('Availability fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper function to convert 12-hour time to 24-hour time
function convertTo24Hour(time12h) {
  try {
    if (!time12h || typeof time12h !== 'string') {
      console.error('Invalid time format:', time12h);
      return '09:00'; // Default fallback
    }
    
    const [time, modifier] = time12h.split(' ');
    if (!time || !modifier) {
      console.error('Invalid time format - missing time or modifier:', time12h);
      return '09:00'; // Default fallback
    }
    
    let [hours, minutes] = time.split(':');
    if (!hours || !minutes) {
      console.error('Invalid time format - missing hours or minutes:', time12h);
      return '09:00'; // Default fallback
    }
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier.toUpperCase() === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    // Ensure two-digit format
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error converting time:', time12h, error);
    return '09:00'; // Default fallback
  }
}

// Helper function to get default time slots
function getDefaultTimeSlots() {
  const defaultSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM'
  ];
  
  return defaultSlots.map(time => ({
    time,
    available: true,
    booked: false
  }));
}

// Helper function to get default weekly schedule
function getDefaultWeeklySchedule() {
  const schedule = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const isWeekend = date.getDay() === 0; // Sunday
    
    schedule.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNumber: date.getDate(),
      available: !isWeekend,
      timeRange: !isWeekend ? '9:00 AM to 6:00 PM' : 'Not available'
    });
  }
  
  return schedule;
}

// Helper function to generate weekly schedule from doctor's availability
function getWeeklyScheduleFromDoctor(weeklyAvailability) {
  const schedule = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayAvail = weeklyAvailability?.[day];
    
    schedule.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNumber: date.getDate(),
      available: dayAvail?.available || false,
      timeRange: dayAvail?.available && dayAvail.timeSlots?.length > 0 
        ? `${dayAvail.timeSlots[0].startTime} to ${dayAvail.timeSlots[dayAvail.timeSlots.length - 1].endTime}`
        : 'Not available'
    });
  }
  
  return schedule;
}
