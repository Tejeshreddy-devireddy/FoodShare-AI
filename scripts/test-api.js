/**
 * FoodShare AI - API Integration E2E Test Suite
 * Simulates a full redistribution transaction cycle.
 */

const http = require('http');

const PORT = 5006;
const BASE_URL = `http://localhost:${PORT}/api`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject({ status: res.statusCode, error: parsed.error || parsed });
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject({ status: res.statusCode, error: data || e.message });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🚀 Starting FoodShare AI E2E API Flow Verification...\n');

  let donorToken, ngoToken, volunteerToken;
  let donationId, pickupId;

  const suffix = Date.now();
  const donorEmail = `donor_${suffix}@restaurant.com`;
  const ngoEmail = `ngo_${suffix}@foodshare.org`;
  const volunteerEmail = `volunteer_${suffix}@express.com`;

  try {
    // 1. Register Donor
    console.log('🔹 1. Registering Donor...');
    const donorReg = await request('/auth/register', 'POST', {
      name: 'Grand Garden Restaurant',
      email: donorEmail,
      password: 'securepassword123',
      role: 'Donor',
      donorDetails: { organizationType: 'Restaurant', businessLicense: 'LIC-942821' }
    });
    console.log('   ✓ Registered. OTP generated:', donorReg.otpMock);

    // 2. Verify Donor OTP
    console.log('🔹 2. Verifying Donor OTP...');
    await request('/auth/verify-otp', 'POST', {
      email: donorEmail,
      code: donorReg.otpMock
    });
    console.log('   ✓ OTP Verified.');

    // 3. Login Donor
    console.log('🔹 3. Logging in Donor...');
    const donorLogin = await request('/auth/login', 'POST', {
      email: donorEmail,
      password: 'securepassword123'
    });
    donorToken = donorLogin.accessToken;
    console.log('   ✓ Login successful. Token acquired.');

    // 4. Create Donation (Simulating Image Base64 Upload)
    console.log('🔹 4. Creating surplus food donation (AI evaluation triggered)...');
    const donationRes = await request('/donations', 'POST', {
      foodItems: [
        { name: 'Veg Biryani', quantity: 20, unit: 'servings', foodType: 'veg' },
        { name: 'Raita', quantity: 5, unit: 'liters', foodType: 'veg' }
      ],
      description: 'Buffet leftovers, kept clean in food containers.',
      location: { coordinates: [77.5946, 12.9716] },
      address: 'Vasanth Nagar, Bangalore',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' // 1x1 pixel PNG
    }, donorToken);
    donationId = donationRes.donation._id;
    console.log(`   ✓ Donation created. ID: ${donationId}`);
    console.log(`     Freshness Score: ${donationRes.donation.freshnessScore}%`);
    console.log(`     Predicted Shelf Life: ${donationRes.donation.shelfLifeHours} Hours`);
    console.log(`     CO2 Offsets Saved: ${donationRes.donation.carbonSavedCalculation} kg`);

    // 5. Register & Login NGO
    console.log('\n🔹 5. Registering NGO...');
    const ngoReg = await request('/auth/register', 'POST', {
      name: 'Bangalore Food Share NGO',
      email: ngoEmail,
      password: 'securepassword123',
      role: 'NGO',
      ngoDetails: { registrationNumber: 'NGO-29402', capacity: 200 }
    });
    await request('/auth/verify-otp', 'POST', { email: ngoEmail, code: ngoReg.otpMock });
    const ngoLogin = await request('/auth/login', 'POST', { email: ngoEmail, password: 'securepassword123' });
    ngoToken = ngoLogin.accessToken;
    console.log('   ✓ NGO Auth token acquired.');

    // 6. NGO Claims Donation
    console.log('🔹 6. NGO Claiming surplus food donation...');
    const claimRes = await request(`/donations/${donationId}/claim`, 'POST', {}, ngoToken);
    console.log(`   ✓ Donation claimed. Status updated to: ${claimRes.donation.status}`);

    // Create Pickup task
    console.log('🔹 7. Creating delivery Logistics task...');
    const pickupRes = await request('/pickups', 'POST', { donationId }, ngoToken);
    pickupId = pickupRes.pickup._id;
    console.log(`   ✓ Pickup created. OTP required: ${pickupRes.pickup.verificationOtp}`);

    // 7. Register & Login Volunteer
    console.log('\n🔹 8. Registering Volunteer...');
    const volReg = await request('/auth/register', 'POST', {
      name: 'Alex Ryder (Courier)',
      email: volunteerEmail,
      password: 'securepassword123',
      role: 'Volunteer'
    });
    await request('/auth/verify-otp', 'POST', { email: volunteerEmail, code: volReg.otpMock });
    const volLogin = await request('/auth/login', 'POST', { email: volunteerEmail, password: 'securepassword123' });
    volunteerToken = volLogin.accessToken;
    console.log('   ✓ Volunteer Auth token acquired.');

    // 8. Volunteer Accepts Pickup Task
    console.log(`🔹 9. Volunteer accepting pickup task ${pickupId}...`);
    await request(`/pickups/${pickupId}/assign`, 'POST', {}, volunteerToken);
    console.log('   ✓ Pickup task assigned to volunteer.');

    // 9. Simulating GPS location tracking events
    console.log('🔹 10. Sending GPS location stream updates...');
    const pathUpdate = await request(`/pickups/${pickupId}/location`, 'POST', {
      lat: 12.9721,
      lng: 77.5950,
      description: 'Volunteer picked up food, in transit'
    }, volunteerToken);
    console.log(`   ✓ Route event logged. Total route steps: ${pathUpdate.trackingPath.length}`);

    // 10. Complete delivery with OTP verification
    console.log('🔹 11. Finalizing delivery check-in with NGO OTP...');
    const completion = await request(`/pickups/${pickupId}/complete`, 'POST', {
      otp: pickupRes.pickup.verificationOtp
    }, volunteerToken);
    console.log(`   ✓ Task finalized. Pickup status: ${completion.pickup.status}`);
    console.log('     Volunteers reward points logged.');

    console.log('\n🎉 ALL E2E TRANSACTION STEPS PASSED SUCCESSFULLY! Platform integration confirmed.');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ FLOW VERIFICATION ERROR DETECTED:', err);
    process.exit(1);
  }
}

// Start local runner if executed directly
if (require.main === module) {
  runTests();
}
