import Partner from '../models/Partner.js';

export const seedPartners = async () => {
  try {
    // Check if partners already exist
    const existingPartnersCount = await Partner.countDocuments();
    
    if (existingPartnersCount > 0) {
      console.log('Partners already seeded. Skipping...');
      return;
    }

    // Sample university partners
    const universities = [
      {
        name: "Harvard University",
        type: "university",
        description: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png",
        websiteUrl: "https://www.harvard.edu",
        location: "Cambridge, Massachusetts, USA",
        ranking: 10,
        isActive: true,
        contactInfo: {
          name: "Admissions Office",
          email: "admissions@harvard.edu",
          phone: "+1-123-456-7890"
        }
      },
      {
        name: "Massachusetts Institute of Technology",
        type: "university",
        description: "MIT is a private research university in Cambridge, Massachusetts.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
        websiteUrl: "https://www.mit.edu",
        location: "Cambridge, Massachusetts, USA",
        ranking: 9,
        isActive: true,
        contactInfo: {
          name: "Admissions Office",
          email: "admissions@mit.edu",
          phone: "+1-123-456-7891"
        }
      },
      {
        name: "Stanford University",
        type: "university",
        description: "Stanford University is a private research university in Stanford, California.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png",
        websiteUrl: "https://www.stanford.edu",
        location: "Stanford, California, USA",
        ranking: 8,
        isActive: true,
        contactInfo: {
          name: "Admissions Office",
          email: "admissions@stanford.edu",
          phone: "+1-123-456-7892"
        }
      }
    ];

    // Sample industry partners
    const industries = [
      {
        name: "Google",
        type: "industry",
        description: "A multinational technology company specializing in Internet-related services and products.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
        websiteUrl: "https://www.google.com",
        location: "Mountain View, California, USA",
        ranking: 10,
        isActive: true,
        contactInfo: {
          name: "Partnerships Office",
          email: "partnerships@google.com",
          phone: "+1-123-456-7893"
        }
      },
      {
        name: "Microsoft",
        type: "industry",
        description: "An American multinational technology company with headquarters in Redmond, Washington.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
        websiteUrl: "https://www.microsoft.com",
        location: "Redmond, Washington, USA",
        ranking: 9,
        isActive: true,
        contactInfo: {
          name: "Partnerships Office",
          email: "partnerships@microsoft.com",
          phone: "+1-123-456-7894"
        }
      },
      {
        name: "Amazon",
        type: "industry",
        description: "An American multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
        websiteUrl: "https://www.amazon.com",
        location: "Seattle, Washington, USA",
        ranking: 8,
        isActive: true,
        contactInfo: {
          name: "Partnerships Office",
          email: "partnerships@amazon.com",
          phone: "+1-123-456-7895"
        }
      }
    ];

    // Insert university partners
    await Partner.insertMany(universities);
    console.log(`${universities.length} university partners seeded successfully`);

    // Insert industry partners
    await Partner.insertMany(industries);
    console.log(`${industries.length} industry partners seeded successfully`);

  } catch (error) {
    console.error('Error seeding partners:', error);
  }
}; 