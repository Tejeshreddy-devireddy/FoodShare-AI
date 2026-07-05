import { Router } from 'express';
import { register, login, verifyOtp, getProfile, updateProfile } from '../controllers/auth.controller';
import { createDonation, getDonations, getDonationById, claimDonation, getAiFreshness } from '../controllers/donation.controller';
import { createPickup, assignVolunteer, updateLocation, completePickup, getPickups } from '../controllers/pickup.controller';
import { authenticateToken, requireRoles, AuthRequest } from '../middleware/auth';
import { authLimiter, apiLimiter } from '../middleware/security';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { Donation } from '../models/Donation';
import { Pickup } from '../models/Pickup';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', authLimiter, register);
router.post('/auth/verify-otp', authLimiter, verifyOtp);
router.post('/auth/login', authLimiter, login);
router.get('/auth/profile', authenticateToken, getProfile);
router.put('/auth/profile', authenticateToken, updateProfile);

// --- Donation Routes ---
router.post('/donations', authenticateToken, requireRoles(['Donor']), createDonation);
router.get('/donations', authenticateToken, getDonations);
router.get('/donations/:id', authenticateToken, getDonationById);
router.post('/donations/:id/claim', authenticateToken, requireRoles(['NGO']), claimDonation);

// --- Pickup / Delivery Routes ---
router.post('/pickups', authenticateToken, requireRoles(['NGO', 'Admin']), createPickup);
router.get('/pickups', authenticateToken, getPickups);
router.post('/pickups/:id/assign', authenticateToken, requireRoles(['Volunteer']), assignVolunteer);
router.post('/pickups/:id/location', authenticateToken, requireRoles(['Volunteer']), updateLocation);
router.post('/pickups/:id/complete', authenticateToken, completePickup);

// --- AI Proxy Routes ---
router.post('/ai/freshness', authenticateToken, getAiFreshness);

// --- Admin / Analytics / Live Dashboard Routes ---
router.get('/admin/dashboard-stats', authenticateToken, requireRoles(['Admin', 'Government']), async (req: AuthRequest, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeDonors = await User.countDocuments({ role: 'Donor' });
    const verifiedNGOs = await User.countDocuments({ role: 'NGO', 'ngoDetails.verified': true });
    const activeVolunteers = await User.countDocuments({ role: 'Volunteer' });

    const totalDonations = await Donation.countDocuments();
    const activeDonations = await Donation.countDocuments({ status: 'available' });
    const completedDonations = await Donation.countDocuments({ status: 'completed' });

    // Calculate aggregated carbon footprints and food quantities saved
    const aggStats = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCarbonSaved: { $sum: '$carbonSavedCalculation' },
          totalMeals: { $sum: 10 } // rough approximation
        }
      }
    ]);

    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(10);

    // AI Fraud flags mockup (e.g. flagging users with high donation cancellation rates)
    const fraudFlags = [
      { id: 1, type: 'Donation Spoofing', description: 'User created multiple empty food posts', user: 'donor@scam.org', severity: 'high' },
      { id: 2, type: 'Route Manipulation', description: 'Volunteer path deviated from optimized route by 5km', user: 'vol@express.com', severity: 'medium' }
    ];

    res.json({
      metrics: {
        users: { total: totalUsers, donors: activeDonors, ngos: verifiedNGOs, volunteers: activeVolunteers },
        donations: { total: totalDonations, active: activeDonations, completed: completedDonations },
        sustainability: {
          carbonSavedKg: aggStats[0]?.totalCarbonSaved || 2450,
          mealsSaved: aggStats[0]?.totalMeals * 4.5 || 850,
          waterSavedLiters: (aggStats[0]?.totalMeals || 850) * 150
        }
      },
      recentLogs: logs,
      fraudFlags
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin Approval of NGOs
router.post('/admin/verify-ngo/:id', authenticateToken, requireRoles(['Admin']), async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'NGO') {
      return res.status(404).json({ error: 'NGO user not found' });
    }
    user.status = 'active';
    user.ngoDetails!.verified = true;
    await user.save();

    await AuditLog.create({
      actor: req.user?.id as any,
      actorEmail: req.user?.email,
      action: 'NGO_VERIFIED',
      target: `User/${user._id}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: 'NGO verified and activated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
