const API_URL = 'http://localhost:5000/api';

async function seed() {
  console.log('Registering user...');
  let res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alice Scholar',
      email: 'alice@example.com',
      password: 'password123',
      university: 'State University',
      location: 'Campus North'
    })
  });
  
  if (!res.ok) {
     console.log('User might exist, logging in...');
     res = await fetch(`${API_URL}/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: 'alice@example.com', password: 'password123' })
     });
  }
  
  const user = await res.json();
  const token = user.token;
  console.log('Authentication successful for:', user.name);

  const listings = [
    {
      title: 'Introduction to Algorithms (4th Edition)',
      description: 'Barely used, cover has some slight wear but pages are perfect. Essential for CS students.',
      category: 'Textbooks',
      subject: 'Computer Science',
      condition: 'Like New',
      price: 2500,
      author: 'Thomas H. Cormen',
      dropPoint: 'Main Library Desk'
    },
    {
      title: 'Calculus 101 Lecture Notes',
      description: 'Detailed handwritten notes from Prof. Smith\'s class. Extremely neat and organized with diagrams.',
      category: 'Notes',
      subject: 'Mathematics',
      courseCode: 'MATH101',
      condition: 'Good',
      price: 0,
      isDonation: true,
      dropPoint: 'Cafeteria South Entrance'
    }
  ];

  for (const item of listings) {
    const fd = new FormData();
    for (const key in item) {
      fd.append(key, item[key]);
    }
    
    console.log(`Creating listing: ${item.title}`);
    const lRes = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: fd
    });
    
    if (lRes.ok) {
        console.log(`✅ Success: ${item.title}`);
    } else {
        const err = await lRes.json();
        console.error(`❌ Failed: ${item.title}`, err);
    }
  }
}

seed();
