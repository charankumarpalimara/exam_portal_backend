const User = require('../models/User');

/**
 * Generate Hall Ticket Number
 * Format: YYYYMDD#### (12 characters)
 * - YYYY: Current Year (4 digits)
 * - M: Month as alphabet (A=Jan, B=Feb, ..., L=Dec)
 * - DD: Day of month (2 digits)
 * - ####: Sequential 4-digit code
 * 
 * Example: 2025J140001 (October 14, 2025, sequence 1)
 */
const generateHallTicket = async () => {
  const now = new Date();
  
  // Year (4 digits)
  const year = now.getFullYear();
  
  // Month as alphabet (A=Jan, B=Feb, ... L=Dec)
  const monthAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const monthLetter = monthAlphabets[now.getMonth()];
  
  // Day (2 digits with leading zero)
  const day = String(now.getDate()).padStart(2, '0');
  
  // Base prefix: YYYYMDD
  const prefix = `${year}${monthLetter}${day}`;
  
  try {
    // Find the last hall ticket with the same prefix
    const lastUser = await User.findOne({
      hallTicket: { $regex: `^${prefix}` }
    }).sort({ hallTicket: -1 });
    
    let sequenceNumber = 1;
    
    if (lastUser && lastUser.hallTicket) {
      // Extract the last 4 digits and increment
      const lastSequence = lastUser.hallTicket.slice(-4);
      sequenceNumber = parseInt(lastSequence, 10) + 1;
    }
    
    // Format sequence as 4-digit number with leading zeros
    const sequenceStr = String(sequenceNumber).padStart(4, '0');
    
    // Final hall ticket: YYYYMDD####
    const hallTicket = `${prefix}${sequenceStr}`;
    
    return hallTicket;
  } catch (error) {
    console.error('Error generating hall ticket:', error);
    // Fallback to random number if there's an error
    const randomSeq = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${prefix}${randomSeq}`;
  }
};

/**
 * Validate hall ticket format
 */
const validateHallTicketFormat = (hallTicket) => {
  // Format: YYYYMDD#### (12 characters total)
  const regex = /^\d{4}[A-L]\d{6}$/;
  return regex.test(hallTicket);
};

/**
 * Parse hall ticket to get date information
 */
const parseHallTicket = (hallTicket) => {
  if (!validateHallTicketFormat(hallTicket)) {
    return null;
  }
  
  const year = hallTicket.substring(0, 4);
  const monthLetter = hallTicket.charAt(4);
  const day = hallTicket.substring(5, 7);
  const sequence = hallTicket.substring(7, 11);
  
  const monthAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const monthIndex = monthAlphabets.indexOf(monthLetter);
  
  return {
    year: parseInt(year),
    month: monthIndex + 1,
    day: parseInt(day),
    sequence: parseInt(sequence),
    formatted: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day} #${sequence}`
  };
};

module.exports = {
  generateHallTicket,
  validateHallTicketFormat,
  parseHallTicket
};

